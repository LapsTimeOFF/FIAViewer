import { IpcMainInvokeEvent } from "electron";
import Store from "electron-store";

const store = new Store();

export const handleSetKey = (event: IpcMainInvokeEvent | null, key: string, value: unknown): any => {
  store.set(key, value);
  console.log(`[${__filename.split("/")[__filename.split("/").length-1]}]`, "Key:", key, "Value:", value);
};

export const handleGetKey = (event: IpcMainInvokeEvent | null, key: string): any => {
  console.log(`[${__filename.split("/")[__filename.split("/").length-1]}]`, "Key:", key, "read");
  return store.get(key);
};

export const handleDeleteKey = (event: IpcMainInvokeEvent | null, key: string): any => {
  console.log(`[${__filename.split("/")[__filename.split("/").length-1]}]`, "Key:", key, "deleted");
  store.delete(key);
};