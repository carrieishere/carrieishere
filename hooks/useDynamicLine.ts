"use client";

import { useEffect } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";
import type { RefObject } from "react";

export interface DynamicLinePoints {
  x1: MotionValue<number>;
  y1: MotionValue<number>;
  x2: MotionValue<number>;
  y2: MotionValue<number>;
}

/**
 * 坐标写入 MotionValue，不触发 React 重绘。
 * getBoundingClientRect 只在打开、拖拽、resize 时经 rAF 合并执行一次，避免空闲轮询造成 layout thrashing。
 */
export function useDynamicLine(
  anchorA: RefObject<HTMLElement>,
  anchorB: RefObject<HTMLElement>,
  active: boolean,
): DynamicLinePoints {
  const x1 = useMotionValue(0);
  const y1 = useMotionValue(0);
  const x2 = useMotionValue(0);
  const y2 = useMotionValue(0);

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    let dragging = false;
    let bootId = 0;

    const measure = () => {
      frame = 0;
      const aEl = anchorA.current;
      const bEl = anchorB.current;
      if (!aEl || !bEl) return;

      const a = aEl.getBoundingClientRect();
      const b = bEl.getBoundingClientRect();
      x1.set(a.left + a.width / 1.8);
      y1.set(a.top + a.height / 1.4);
      x2.set(b.left + b.width / 2);
      y2.set(b.top + b.height / 2);
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    const onPointerMove = () => {
      if (dragging) schedule();
    };

    const onPointerDown = (event: PointerEvent) => {
      const handle = anchorB.current;
      if (!handle || !(event.target instanceof Node)) return;
      const modal = handle.closest("[data-cursor-idle]");
      if (modal && modal.contains(event.target)) {
        dragging = true;
        schedule();
      }
    };

    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      schedule();
    };

    schedule();
    bootId = window.setTimeout(schedule, 80);

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.clearTimeout(bootId);
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", schedule);
    };
  }, [active, anchorA, anchorB, x1, y1, x2, y2]);

  return { x1, y1, x2, y2 };
}
