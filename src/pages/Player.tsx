import React, { useEffect } from "react";
// @ts-ignore
import shaka from "shaka-player/dist/shaka-player.ui.debug";
// @ts-ignore
import muxjs from "mux.js";
import "shaka-player/dist/controls.css";
import "../style/Player.scss";

export interface F1TV_API_PlaybackResponse {
  resultCode: string;
  message: string;
  errorDescription: string;
  resultObj: ContentStream;
  systemTime: number;
}

export interface ContentStream {
  entitlementToken: string;
  url: string;
  streamType: "DASHWV" | "HLSFP" | "DASH";
  drmType: "widevine" | "fairplay";
  drmToken?: string;
  laURL: string;
  certUrl?: string;
  channelId: number;
}

const Player = () => {
  let manifestUri = "";

  function initApp() {
    // Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll();

    shaka.dependencies.add(shaka.dependencies.Allowed.muxjs, muxjs);

    // Check to see if the browser supports the basic APIs Shaka needs.
    if (shaka.Player.isBrowserSupported()) {
      // Everything looks good!
      initPlayer();
    } else {
      // This browser does not have the minimum set of APIs we need.
      console.error("Browser not supported!");
    }
  }

  async function initPlayer() {
    // Create a Player instance.
    const video = document.getElementById("video");
    const uiContainer = document.getElementById("video-container");
    const player = new shaka.Player(video);

    // Attach player to the window to make it easy to access in the JS console.
    window.player = player;

    // Listen for error events.
    player.addEventListener("error", onErrorEvent);

    const url = await window.fiaviewer.f1tv.player.getStreamURL(1000006446);
    console.log(url);

    if (await window.fiaviewer.f1tv.auth.checkExpired())
      throw new Error("Token expired.");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        ascendonToken: await window.fiaviewer.config.get("f1tv.token"),
      },
    });

    let data: F1TV_API_PlaybackResponse;
    try {
      data = await response.json();
    } catch (error) {
      console.log(error);
      console.log(response.text());
      return;
    }

    console.log(data);

    if (data.errorDescription !== "") {
      console.error(data.message);
      throw new Error("Failed to get a streaming url.");
    }

    manifestUri = data.resultObj.url;

    // Try to load a manifest.
    // This is an asynchronous process.
    try {
      const ui = new shaka.ui.Overlay(player, uiContainer, video);
      ui.configure({
        overflowMenuButtons: [
          "captions",
          "quality",
          "language",
          "picture_in_picture",
          "cast",
          "playback_rate",
          "statistics",
        ],
        singleClickForPlayAndPause: false,
        doubleClickForFullscreen: false,
        enableKeyboardPlaybackControls: false,
      } as shaka.extern.UIConfiguration);

      player.load(manifestUri);
      // This runs if the asynchronous load is successful.
      console.log("The video has now been loaded!");
    } catch (e) {
      // onError is executed if the asynchronous load fails.
      onError(e);
    }
  }

  function onErrorEvent(event: { detail: any }) {
    // Extract the shaka.util.Error object from the event.
    onError(event.detail);
  }

  function onError(error: any) {
    // Log the error.
    console.error("Error code", error.code, "object", error);
  }

  useEffect(() => {
    initApp();

    return () => {};
  }, []);

  return (
    <div id="video-container">
      <video id="video" width="640" autoPlay></video>
    </div>
  );
};

export default Player;
