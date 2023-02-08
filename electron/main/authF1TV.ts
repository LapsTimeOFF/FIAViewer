import { BrowserWindow, IpcMainInvokeEvent } from "electron";
import { handleDeleteKey, handleGetKey, handleSetKey } from "./config";
import jwt_decode from "jwt-decode";
import { F1TV_TokenPayload } from "../types/F1TV";

export const handleSignIn = async (
  event: IpcMainInvokeEvent,
  win: BrowserWindow
) => {
  const child = new BrowserWindow({ parent: win, modal: true, show: false });
  child.loadURL(
    "https://account.formula1.com/#/en/login?redirect=https%3A%2F%2Ff1tv.formula1.com%2F"
  );
  child.once("ready-to-show", async () => {
    child.show();
    child.webContents.on("did-navigate", async () => {
      const token = await child.webContents.session.cookies.get({
        name: "entitlement_token",
      });
      const payload = jwt_decode(token[0].value);

      handleSetKey(event, "f1tv.token", token[0].value);
      handleSetKey(event, "f1tv.payload", payload);

      child.destroy();
    });
  });
};

export const handleSignOut = (
  event: IpcMainInvokeEvent | null
) => {
  handleDeleteKey(null, "f1tv");
};

export const handleGetPayload = (
  event?: IpcMainInvokeEvent | null
): F1TV_TokenPayload | undefined => {
  let payload: F1TV_TokenPayload = handleGetKey(null, "f1tv.payload");
  return payload;
};

export const handleCheckExpired = () => {
  let payload: F1TV_TokenPayload = handleGetPayload();

  if(payload === undefined) {
    return false;
  }

  console.log(`[${__filename.split('/')[__filename.split('/').length-1]}]`, payload.exp, Math.round(Date.now() / 1000) > payload.exp);

  return Math.round(Date.now() / 1000) > payload.exp;
};
