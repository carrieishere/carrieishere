"use client";

import { useEffect, useRef, useState } from "react";
import { listenMediaChange } from "@/lib/listenMediaChange";
import { clearSpotlight, writeSpotlight } from "@/lib/spotlight";

/** 圆在布局里的真实像素，缩小显示而不是把小圆放大，避免锯齿。 */
const BASE_SIZE = 160;
const DEFAULT_SCALE = 10 / BASE_SIZE;
const HOVER_SCALE = 120 / BASE_SIZE;
const POS_LERP = 0.14;
const POS_LERP_REDUCED = 1;
const SCALE_LERP = 0.09;
const STRETCH_DISTANCE = 110;
const MAX_STRETCH = 0.48;
const SETTLE_PX = 0.08;
const SETTLE_SCALE = 0.003;
const SETTLE_STRETCH = 0.004;
const FPS_WINDOW = 60;
const FPS_MIN = 45;
const FPS_MAX_FRAME_MS = 100;
const MONITOR_DELAY_MS = 3000;
const HOVER_SELECTOR =
  "a, button, [role='button'], .hover-item, [data-interactive]";

function lerp(current: number, target: number, factor: number) {
  return current + (target - current) * factor;
}

function isHoverTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el?.closest) return false;
  if (el.closest("[data-cursor-idle], [data-cursor-ignore]")) return false;
  return Boolean(el.closest(HOVER_SELECTOR));
}

function isOverChat(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return Boolean(el?.closest?.(".chat-easter-modal"));
}

function hasNativeCursor() {
  return document.documentElement.classList.contains("native-cursor");
}

function isMousePointer(event: PointerEvent) {
  return event.pointerType === "mouse" || event.pointerType === "";
}

/**
 * Cuberto 风格圆形光标：大圆缩小绘制去锯齿，exclusion 叠印，速度拉长。
 * 减弱动态效果或首页可用后持续掉帧时，关掉混合模式与阻尼，贴指针 1:1 移动。
 */
export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const scale = useRef(DEFAULT_SCALE);
  const targetScale = useRef(DEFAULT_SCALE);
  const visible = useRef(false);
  const raf = useRef(0);
  const hasDowngradedRef = useRef(false);
  const canMonitorRef = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const [degraded, setDegraded] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let armTimer = 0;
    let sawNativeCursor = hasNativeCursor();

    const syncPointer = () => setEnabled(finePointer.matches);

    const lockDegraded = () => {
      if (hasDowngradedRef.current) return;
      hasDowngradedRef.current = true;
      canMonitorRef.current = false;
      window.clearTimeout(armTimer);
      armTimer = 0;
      setDegraded(true);
    };

    const disarmProbe = () => {
      canMonitorRef.current = false;
      window.clearTimeout(armTimer);
      armTimer = 0;
    };

    const armProbe = () => {
      if (hasDowngradedRef.current) return;
      if (hasNativeCursor()) {
        disarmProbe();
        return;
      }
      window.clearTimeout(armTimer);
      armTimer = window.setTimeout(() => {
        armTimer = 0;
        if (!hasDowngradedRef.current && !hasNativeCursor()) {
          canMonitorRef.current = true;
        }
      }, MONITOR_DELAY_MS);
    };

    syncPointer();
    if (reduceMotion.matches) lockDegraded();
    else armProbe();

    const onReduceChange = (event: MediaQueryListEvent) => {
      if (event.matches) lockDegraded();
    };

    const unlistenFine = listenMediaChange(finePointer, () => syncPointer());
    const unlistenReduce = listenMediaChange(reduceMotion, onReduceChange);

    const observer = new MutationObserver(() => {
      const native = hasNativeCursor();
      if (native === sawNativeCursor) return;
      sawNativeCursor = native;
      armProbe();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.clearTimeout(armTimer);
      unlistenFine();
      unlistenReduce();
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let alive = true;
    let sampleCount = 0;
    let sampleSum = 0;
    let lastSampleAt = 0;
    const posLerp = degraded ? POS_LERP_REDUCED : POS_LERP;
    const scaleLerp = degraded ? 1 : SCALE_LERP;
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    pos.current = { x: startX, y: startY };
    target.current = { x: startX, y: startY };
    const mouseSpot = { current: false };
    const overChat = { current: false };

    const setOverChat = (next: boolean) => {
      if (overChat.current === next) return;
      overChat.current = next;
      document.documentElement.classList.toggle("over-chat-cursor", next);
    };

    const resetSamples = () => {
      sampleCount = 0;
      sampleSum = 0;
      lastSampleAt = 0;
    };

    const noteFrame = () => {
      if (!canMonitorRef.current || hasDowngradedRef.current) return;
      const now = performance.now();
      if (lastSampleAt > 0) {
        const dt = now - lastSampleAt;
        if (dt > 0 && dt < FPS_MAX_FRAME_MS) {
          sampleCount += 1;
          sampleSum += dt;
          if (sampleCount >= FPS_WINDOW) {
            const avgFps = (1000 * sampleCount) / sampleSum;
            sampleCount = 0;
            sampleSum = 0;
            if (avgFps < FPS_MIN) {
              hasDowngradedRef.current = true;
              canMonitorRef.current = false;
              setDegraded(true);
            }
          }
        } else {
          sampleCount = 0;
          sampleSum = 0;
        }
      }
      lastSampleAt = now;
    };

    const paint = (angle: number, stretchX: number, stretchY: number) => {
      const root = rootRef.current;
      const dot = dotRef.current;
      if (!root || !dot) return;

      root.style.opacity = visible.current ? "1" : "0";
      root.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      dot.style.transform = `rotate(${angle}rad) scale(${stretchX}, ${stretchY})`;
      const radius = visible.current && mouseSpot.current
        ? (BASE_SIZE / 2) * Math.max(stretchX, stretchY)
        : 0;
      writeSpotlight(pos.current.x, pos.current.y, radius);
    };

    const tick = () => {
      if (!alive) return;

      noteFrame();

      pos.current.x = lerp(pos.current.x, target.current.x, posLerp);
      pos.current.y = lerp(pos.current.y, target.current.y, posLerp);
      scale.current = lerp(scale.current, targetScale.current, scaleLerp);

      const dx = target.current.x - pos.current.x;
      const dy = target.current.y - pos.current.y;
      const dist = Math.hypot(dx, dy);
      const stretch = degraded
        ? 0
        : Math.min(dist / STRETCH_DISTANCE, MAX_STRETCH);
      const angle = !degraded && dist > 0.001 ? Math.atan2(dy, dx) : 0;
      const stretchX = scale.current * (1 + stretch);
      const stretchY = scale.current * (1 - stretch * 0.5);

      paint(angle, stretchX, stretchY);

      const settled =
        dist < SETTLE_PX &&
        Math.abs(targetScale.current - scale.current) < SETTLE_SCALE &&
        stretch < SETTLE_STRETCH;

      if (!alive) {
        raf.current = 0;
        return;
      }
      raf.current = settled ? 0 : window.requestAnimationFrame(tick);
    };

    const kick = () => {
      if (!alive || raf.current) return;
      raf.current = window.requestAnimationFrame(tick);
    };

    const snapToPointer = () => {
      pos.current.x = target.current.x;
      pos.current.y = target.current.y;
      scale.current = targetScale.current;
      paint(0, scale.current, scale.current);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (isOverChat(event.target)) {
        setOverChat(true);
        visible.current = false;
        mouseSpot.current = false;
        window.cancelAnimationFrame(raf.current);
        raf.current = 0;
        paint(0, scale.current, scale.current);
        return;
      }

      setOverChat(false);
      visible.current = true;
      mouseSpot.current = isMousePointer(event);
      target.current.x = event.clientX;
      target.current.y = event.clientY;
      targetScale.current = isHoverTarget(event.target) ? HOVER_SCALE : DEFAULT_SCALE;
      if (degraded) {
        snapToPointer();
        return;
      }
      kick();
    };

    const onPointerOut = (event: PointerEvent) => {
      if (event.relatedTarget) return;
      setOverChat(false);
      visible.current = false;
      mouseSpot.current = false;
      targetScale.current = DEFAULT_SCALE;
      if (degraded) {
        snapToPointer();
        return;
      }
      kick();
    };

    const onResize = () => {
      target.current.x = Math.min(target.current.x, window.innerWidth);
      target.current.y = Math.min(target.current.y, window.innerHeight);
      if (degraded) {
        snapToPointer();
        return;
      }
      kick();
    };

    const onVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(raf.current);
        raf.current = 0;
        resetSamples();
        return;
      }
      if (degraded) {
        snapToPointer();
        return;
      }
      kick();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    if (!degraded) kick();

    return () => {
      alive = false;
      window.cancelAnimationFrame(raf.current);
      raf.current = 0;
      document.documentElement.classList.remove("over-chat-cursor");
      clearSpotlight();
      const html = document.documentElement.style;
      html.removeProperty("--spot-x");
      html.removeProperty("--spot-y");
      html.removeProperty("--spot-r");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, degraded]);

  if (!enabled) return null;

  const offset = -BASE_SIZE / 2;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-[9999] custom-cursor-root ${
        degraded ? "" : "mix-blend-exclusion"
      }`}
      style={{
        width: 0,
        height: 0,
        opacity: 0,
        willChange: degraded ? "auto" : "transform",
      }}
    >
      <div
        ref={dotRef}
        className={`rounded-full ${
          degraded ? "bg-black/20 dark:bg-white/50" : "bg-white"
        }`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: BASE_SIZE,
          height: BASE_SIZE,
          marginLeft: offset,
          marginTop: offset,
          willChange: degraded ? "auto" : "transform",
          backfaceVisibility: "hidden",
          boxShadow: degraded ? "none" : "0 0 0.4px #fff",
        }}
      />
    </div>
  );
}
