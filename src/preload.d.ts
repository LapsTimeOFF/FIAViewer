import { f1tv, config } from "../electron/preload/preload";
export {};
declare global {
  interface Window {
    f1tv: typeof f1tv;
    config: typeof config;
  }
}
