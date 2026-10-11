"use client";

import { useLayoutEffect, useState } from "react";

export type DeviceMode = "desktop" | "mobile";

function readParams() {
  return new URLSearchParams(window.location.search);
}

function isForcedMobile(params: URLSearchParams) {
  const view = params.get("view") ?? params.get("mobile");
  return view === "mobile" || view === "1";
}

function hasFinePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function detectMode(): DeviceMode {
  const params = readParams();
  if (isForcedMobile(params)) return "mobile";
  if (params.get("view") === "desktop") return "desktop";
  return hasFinePointer() ? "desktop" : "mobile";
}

function detectFramePreview() {
  const params = readParams();
  if (params.get("embed") === "1") return false;
  return isForcedMobile(params) && hasFinePointer();
}

/** 客户端挂载后锁定端侧，本次访问不再随 resize 切换。 */
export function useDeviceMode(): DeviceMode | null {
  const [mode, setMode] = useState<DeviceMode | null>(null);

  useLayoutEffect(() => {
    setMode(detectMode());
  }, []);

  return mode;
}

/** 电脑上打开 ?view=mobile 时，用手机画框预览，不铺满桌面窗口。 */
export function useMobileFramePreview(): boolean | null {
  const [framed, setFramed] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    setFramed(detectFramePreview());
  }, []);

  return framed;
}
