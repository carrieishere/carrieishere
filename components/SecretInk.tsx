"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { registerSecretInk } from "@/lib/spotlight";

interface SecretInkProps {
  src: string;
  blend?: "screen";
  style?: CSSProperties;
}

/**
 * 手写隐字：clip-path 跟自身 CSS 变量；偏移只在 resize 时测量。
 */
export function SecretInk({ src, blend, style }: SecretInkProps) {
  const ref = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncOffset = () => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--ink-left", `${rect.left}px`);
      el.style.setProperty("--ink-top", `${rect.top}px`);
    };

    syncOffset();
    const unregister = registerSecretInk(el);
    const observer = new ResizeObserver(syncOffset);
    observer.observe(el);
    window.addEventListener("resize", syncOffset);

    return () => {
      unregister();
      observer.disconnect();
      window.removeEventListener("resize", syncOffset);
    };
  }, []);

  return (
    <img
      ref={ref}
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      decoding="async"
      className="secret-ink pointer-events-none absolute z-[2] h-auto max-w-none select-none"
      style={{
        ...style,
        mixBlendMode: blend,
      }}
    />
  );
}
