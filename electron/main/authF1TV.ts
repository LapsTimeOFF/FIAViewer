import { BrowserWindow, IpcMainInvokeEvent } from "electron";

export const handleSignIn = async (
  event: IpcMainInvokeEvent,
  win: BrowserWindow
) => {
  const child = new BrowserWindow({ parent: win, modal: true, show: false });
  child.loadURL("https://account.formula1.com/#/en/login?redirect=https%3A%2F%2Ff1tv.formula1.com%2F");
  child.once("ready-to-show", async () => {
    child.show();
    child.webContents.on("did-navigate", async () => {
      console.log(await child.webContents.session.cookies.get({name: 'entitlement_token'}));
      child.destroy();
    });
  });
};
