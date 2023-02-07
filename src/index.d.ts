import { f1tvApi } from "../electron/preload/preload";
export {};
declare global {
  interface Window {
    f1tvApi: typeof f1tvApi;
  }
}
