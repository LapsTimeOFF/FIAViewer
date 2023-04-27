import { ipcRenderer } from "electron";

export const fiaviewer = {
  f1tv: {
    auth: {
      signIn: () => ipcRenderer.invoke("f1tv:auth:signIn"),
      signInWithToken: (token: string) => ipcRenderer.invoke("f1tv:auth:signInWithToken", token),
      getPayload: () => ipcRenderer.invoke("f1tv:auth:getPayload"),
      checkExpired: () => ipcRenderer.invoke("f1tv:auth:checkExpired"),
      signOut: () => ipcRenderer.invoke("f1tv:auth:signOut"),
    },
    events: {
      handleAuthLogged: (callback) =>
        ipcRenderer.on("f1tv:auth:logged", callback),
    },
    player: {
      getStreamURL: (contentId: string | number, channelId?: string | number) =>
        ipcRenderer.invoke("f1tv:player:getStreamURL", contentId, channelId),
      open: (url: string) => ipcRenderer.invoke("f1tv:player:open", url),
    },
  },
  config: {
    set: (key: string, value) => ipcRenderer.invoke("config:set", key, value),
    get: (key: string) => ipcRenderer.invoke("config:get", key),
    delete: (key: string) => ipcRenderer.invoke("config:delete", key),
  },
  updater: {
    checkForUpdate: () => ipcRenderer.invoke("updater:checkForUpdate"),
  },
};

window.fiaviewer = fiaviewer;
