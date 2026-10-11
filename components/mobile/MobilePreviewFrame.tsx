"use client";

import { useEffect, useState } from "react";

const PHONE_WIDTH = 390;
const PHONE_HEIGHT = 844;

export function MobilePreviewFrame() {
  const [scale, setScale] = useState(1);
  const [frameSrc, setFrameSrc] = useState("/?view=mobile&embed=1");

  useEffect(() => {
    const fit = () => {
      const next = Math.min(
        1,
        (window.innerHeight - 88) / PHONE_HEIGHT,
        (window.innerWidth - 32) / PHONE_WIDTH,
      );
      setScale(Math.max(0.35, next));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const extra =
      new URLSearchParams(window.location.search).get("hotspots") === "1"
        ? "&hotspots=1"
        : "";
    setFrameSrc(`/?view=mobile&embed=1${extra}`);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-200 px-4 py-6">
      <p className="mb-3 text-center text-xs leading-relaxed text-neutral-500">
        iPhone 14 预览 · 390 × 844
        <br />
        这是手机实际 CSS 尺寸，不用再拖窗口
      </p>
      <div
        className="relative"
        style={{
          width: PHONE_WIDTH * scale,
          height: PHONE_HEIGHT * scale,
        }}
      >
        <div
          className="overflow-hidden rounded-[2.4rem] border border-black/15 bg-black shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
          style={{
            width: PHONE_WIDTH,
            height: PHONE_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <iframe
            title="手机端预览"
            src={frameSrc}
            className="h-full w-full border-0 bg-black"
          />
        </div>
      </div>
    </div>
  );
}
