import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  IpcMainInvokeEvent,
  protocol,
  components,
  session,
  OnBeforeSendHeadersListenerDetails
} from "electron";
import { release } from "node:os";
import { join } from "node:path";
import {
  handleCheckExpired,
  handleGetPayload,
  handleSignIn,
  handleSignInWithToken,
  handleSignOut,
} from "./f1tv/auth";
import { handleDeleteKey, handleGetKey, handleSetKey } from "./config";
import { handleCheckForUpdate } from "./update";
import { requestPlaybackPath } from "./f1tv/player";
import { userAgent } from "./utils";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

export let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/preload.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

const privileges = {
  standard: true,
  bypassCSP: true,
  allowServiceWorkers: true,
  supportFetchAPI: true,
  corsEnabled: false,
  stream: true,
};

protocol.registerSchemesAsPrivileged([
  { scheme: "file", privileges },
  { scheme: "http", privileges },
  { scheme: "https", privileges },
  { scheme: "wss", privileges },
  { scheme: "mailto", privileges: { standard: true } },
]);

async function createWindow() {
  win = new BrowserWindow({
    title: "FIAViewer",
    icon: join(process.env.PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    // win?.webContents.send('main-process-message', new Date().toLocaleString())
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(async () => {
  await components.whenReady();
  console.log("components ready:", components.status());
  session.defaultSession.webRequest.onBeforeSendHeaders(
    {
      urls: ["https://*.formula1.com/*"],
    },
    (details: OnBeforeSendHeadersListenerDetails, callback: any) => {
      console.log("F1 Call - Editing headers...");
      const { referer, Referer, ...headers } = details.requestHeaders;

      const secFetchSite = details.url.startsWith("https://f1tv.formula1.com")
        ? "same-origin"
        : "same-site";

      callback({
        requestHeaders: {
          ...headers,
          referer: "https://www.formula1.com/",
          Origin: "https://f1tv.formula1.com",
          "Sec-Fetch-Site": secFetchSite,
          // Cookie: [authCookie, Cookie, cookie]
          //     .filter(Boolean)
          //     .join('; '),
          Cookie: encodeURI(
            `login-session=${JSON.stringify({
              data: {
                subscriptionToken: handleGetKey(null, "f1tv.token"),
              },
            })}`
          ),
          "user-agent": userAgent,
          "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Chromium\";v=\"106\"",
        },
      });
    }
  );

  ipcMain.handle(
    "updater:checkForUpdate",
    async (event: IpcMainInvokeEvent) => {
      return await handleCheckForUpdate(event);
    }
  );

  ipcMain.handle(
    "f1tv:player:getStreamURL",
    async (
      event: IpcMainInvokeEvent,
      contentId: string | number,
      channelId?: string | number
    ) => {
      return await requestPlaybackPath(contentId, channelId);
    }
  );

  ipcMain.handle("f1tv:auth:signIn", (event: IpcMainInvokeEvent) => {
    return handleSignIn(event, win);
  });
  ipcMain.handle("f1tv:auth:signInWithToken", async (event: IpcMainInvokeEvent, token: string) => {
    return await handleSignInWithToken(event, win, token);
  });
  ipcMain.handle("f1tv:auth:getPayload", (event: IpcMainInvokeEvent) => {
    return handleGetPayload(event);
  });
  ipcMain.handle("f1tv:auth:checkExpired", (event: IpcMainInvokeEvent) => {
    return handleCheckExpired();
  });
  ipcMain.handle("f1tv:auth:signOut", (event: IpcMainInvokeEvent) => {
    return handleSignOut(event);
  });

  ipcMain.handle("config:set", handleSetKey);
  ipcMain.handle("config:get", handleGetKey);
  ipcMain.handle("config:delete", handleDeleteKey);
  createWindow();
});

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
