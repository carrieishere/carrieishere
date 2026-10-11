"use client";

import { useLayoutEffect, useState } from "react";

export type DeviceMode = "desktop" | "mobile";

function detectMode(): DeviceMode {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view") ?? params.get("mobile");
  if (view === "mobile" || view === "1") return "mobile";
  if (view === "desktop") return "desktop";

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  return finePointer ? "desktop" : "mobile";
}

/** 客户端挂载后锁定端侧，本次访问不再随 resize 切换。 */
export function useDeviceMode(): DeviceMode | null {
  const [mode, setMode] = useState<DeviceMode | null>(null);

  useLayoutEffect(() => {
    setMode(detectMode());
  }, []);

  return mode;
}
