import { IpcMainInvokeEvent } from "electron";
import { ReleaseData } from "../types/Update";
// @ts-ignore
const fetch = (...args: any[]) => import("node-fetch").then(({default: fetch}) => fetch(...args));

export const currentVersion = "v1.0.0";

export const handleCheckForUpdate = async (event: IpcMainInvokeEvent): Promise<boolean> => {
  const releaseData: ReleaseData[] = await (await fetch("http://lapstimevpn.chickenkiller.com:3002/api/v1/releases/")).json() as ReleaseData[];

  const lastRelease: ReleaseData = releaseData[0];
  if(!lastRelease) throw "No release found.";

  if(lastRelease.tag_name !== currentVersion) return true;
  return false;
};