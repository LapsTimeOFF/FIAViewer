import { BrowserWindow, IpcMainInvokeEvent } from "electron";
import { handleDeleteKey, handleGetKey, handleSetKey } from "../config";
import jwt_decode from "jwt-decode";
import { F1TV_TokenPayload } from "../../types/F1TV";
import { userAgent } from "../utils";

export const handleSignIn = async (
  event: IpcMainInvokeEvent,
  win: BrowserWindow
) => {
  const child = new BrowserWindow({
    parent: win,
    modal: true,
    show: false,
    webPreferences: { partition: "persist:f1tv" },
  });
  child.loadURL(
    "https://account.formula1.com/#/en/login?redirect=https%3A%2F%2Ff1tv.formula1.com%2F",
    {
      userAgent,
    }
  );
  child.once("ready-to-show", async () => {
    child.show();
    child.webContents.on("did-navigate", async () => {
      const data = (
        await child.webContents.session.cookies.get({
          name: "login-session",
        })
      )[0].value;

      console.log(data);

      const token = JSON.parse(decodeURIComponent(data)).data.subscriptionToken;

      console.log(token);

      const payload = jwt_decode(token);

      console.log(payload);

      handleSetKey(event, "f1tv.token", token);
      handleSetKey(event, "f1tv.payload", payload);

      win.webContents.send("f1tv:auth:logged");

      child.destroy();
    });
  });
};

export const handleSignInWithToken = async (
  event: IpcMainInvokeEvent,
  win: BrowserWindow,
  token: string
) => {
  const payload = jwt_decode(token);

  handleSetKey(event, "f1tv.token", token);
  handleSetKey(event, "f1tv.payload", payload);

  win.webContents.send("f1tv:auth:logged");
};

export const handleSignOut = (event: IpcMainInvokeEvent | null) => {
  handleDeleteKey(null, "f1tv");
};

export const handleGetPayload = (
  event?: IpcMainInvokeEvent | null
): F1TV_TokenPayload | undefined => {
  const payload: F1TV_TokenPayload = handleGetKey(null, "f1tv.payload");
  return payload;
};

export const handleCheckExpired = (): boolean => {
  const payload: F1TV_TokenPayload = handleGetPayload();

  if (payload === undefined) {
    return true;
  }

  console.log(
    `[${__filename.split("/")[__filename.split("/").length - 1]}]`,
    "Token exp:",
    payload.exp,
    "Date now:",
    Math.round(Date.now() / 1000),
    "Token expired:",
    Math.round(Date.now() / 1000) > payload.exp
  );

  return Math.round(Date.now() / 1000) > payload.exp;
};
