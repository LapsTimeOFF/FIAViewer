import { IpcMainInvokeEvent } from "electron";
import Store from 'electron-store';

const store = new Store();

export const handleSetKey = (event: IpcMainInvokeEvent | null, key: string, value: unknown): any => {
    store.set(key, value);
};

export const handleGetKey = (event: IpcMainInvokeEvent | null, key: string): any => {
    return store.get(key);
};

export const handleDeleteKey = (event: IpcMainInvokeEvent | null, key: string): any => {
    store.delete(key);
};