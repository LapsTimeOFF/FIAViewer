import { IpcMainInvokeEvent } from "electron";
import { F1TV_API_PlaybackResponse } from "../../types/PlayerF1TV";
import { handleGetKey } from "../config";
import { handleCheckExpired, handleGetPayload } from "./auth";
import { baseURL } from "./variables";
const HttpsProxyAgent = require('https-proxy-agent');

// @ts-ignore
const fetch = (...args: any[]) =>
  // @ts-ignore
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

export const requestPlaybackPath = async (
  contentId: string | number,
  channelId?: string | number
) => {
  const payload = handleGetPayload();
  const url = new URL(
    `${baseURL}/2.0/R/ENG/WEB_HLS/ALL/CONTENT/PLAY`
  );
  const searchParams = new URLSearchParams();
  searchParams.set("contentId", contentId.toString(10));
  if (channelId) searchParams.set("channelId", channelId.toString(10));
  url.search = searchParams.toString();

  return url.toString();
};
