import { fiaviewer } from "../electron/preload/preload";
export {};
declare global {
  interface Window {
    fiaviewer: typeof fiaviewer;
    player: any;
  }
}
