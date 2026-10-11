"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, useMotionValue, useTransform } from "framer-motion";

export type IntroPhase =
  | "typing"
  | "idle"
  | "revealing"
  | "ready"
  | "reversing";

type Origin = {
  x: number;
  y: number;
  r: number;
  size: number;
  nx: number;
  ny: number;
  ns: number;
};

function coverRadius(x: number, y: number) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + 48;
}

function readOrigin(raw: Origin): Origin {
  const w = window.innerWidth || 1;
  const h = window.innerHeight || 1;
  const size = Math.max(6, raw.ns * w);
  const x = raw.nx * w;
  const y = raw.ny * h;
  return { ...raw, x, y, size, r: size / 2 };
}

export function useCinematicIntro(locked: boolean) {
  const [phase, setPhase] = useState<IntroPhase>("typing");
  const [isFiltering, setIsFiltering] = useState(false);
  const [hasOrigin, setHasOrigin] = useState(false);
  const [origin, setOriginState] = useState({ x: 0, y: 0, size: 8 });
  const phaseRef = useRef<IntroPhase>("typing");
  const originRef = useRef<Origin>({
    x: 0,
    y: 0,
    r: 6,
    size: 8,
    nx: 0.5,
    ny: 0.5,
    ns: 8 / 1440,
  });
  const busyRef = useRef(false);
  const clipR = useMotionValue(0);
  const blurPx = useMotionValue(0);

  const clipPath = useTransform(clipR, (radius) => {
    const { x, y } = originRef.current;
    if (radius <= 0.5) return `circle(0px at ${x}px ${y}px)`;
    return `circle(${radius}px at ${x}px ${y}px)`;
  });

  const filter = useTransform(blurPx, (blur) =>
    blur < 0.35 ? "none" : `blur(${blur}px)`,
  );

  const setOrigin = useCallback(
    (x: number, y: number, size: number) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const next: Origin = {
        x,
        y,
        size,
        r: Math.max(3, size / 2),
        nx: x / w,
        ny: y / h,
        ns: size / w,
      };
      originRef.current = next;
      setOriginState({ x, y, size });
      setHasOrigin(true);
      clipR.set(clipR.get());
    },
    [clipR],
  );

  const markIdle = useCallback(() => {
    phaseRef.current = "idle";
    setPhase("idle");
  }, []);

  const reveal = useCallback(async () => {
    if (busyRef.current || phaseRef.current !== "idle") return;
    busyRef.current = true;
    phaseRef.current = "revealing";
    setPhase("revealing");
    setIsFiltering(true);
    blurPx.set(20);

    const { x, y, r } = originRef.current;
    clipR.set(r);
    await animate(clipR, coverRadius(x, y), {
      duration: 0.72,
      ease: [0.16, 1, 0.3, 1],
    });
    await animate(blurPx, 0, {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    });

    clipR.set(coverRadius(x, y));
    setIsFiltering(false);
    phaseRef.current = "ready";
    setPhase("ready");
    busyRef.current = false;
  }, [blurPx, clipR]);

  const reverse = useCallback(async () => {
    if (busyRef.current || phaseRef.current !== "ready") return;
    busyRef.current = true;
    phaseRef.current = "reversing";
    setPhase("reversing");
    setIsFiltering(true);

    const { x, y } = originRef.current;
    clipR.set(coverRadius(x, y));
    await animate(blurPx, 20, {
      duration: 0.38,
      ease: [0.4, 0, 0.2, 1],
    });
    await animate(clipR, 0, {
      duration: 0.55,
      ease: [0.4, 0, 1, 1],
    });

    blurPx.set(0);
    setIsFiltering(false);
    phaseRef.current = "idle";
    setPhase("idle");
    busyRef.current = false;
  }, [blurPx, clipR]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!reduced.matches) return;
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    originRef.current = {
      x,
      y,
      r: 6,
      size: 8,
      nx: 0.5,
      ny: 0.5,
      ns: 8 / window.innerWidth,
    };
    clipR.set(coverRadius(x, y));
    phaseRef.current = "ready";
    setPhase("ready");
  }, [clipR]);

  useEffect(() => {
    const onResize = () => {
      originRef.current = readOrigin(originRef.current);
      const { x, y, size } = originRef.current;
      setOriginState({ x, y, size });
      if (phaseRef.current === "ready") {
        clipR.set(coverRadius(x, y));
      } else {
        clipR.set(clipR.get());
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clipR]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (locked || busyRef.current) {
        if (phaseRef.current !== "ready") event.preventDefault();
        return;
      }

      if (phaseRef.current === "idle" && event.deltaY > 6) {
        event.preventDefault();
        void reveal();
        return;
      }

      if (
        phaseRef.current === "ready" &&
        event.deltaY < -6 &&
        window.scrollY <= 0
      ) {
        event.preventDefault();
        void reverse();
        return;
      }

      if (phaseRef.current !== "ready") {
        event.preventDefault();
      }
    };

    let touchY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (locked || busyRef.current) {
        if (phaseRef.current !== "ready") event.preventDefault();
        return;
      }
      const currentY = event.touches[0]?.clientY ?? touchY;
      const deltaY = touchY - currentY;
      touchY = currentY;

      if (phaseRef.current === "idle" && deltaY > 8) {
        event.preventDefault();
        void reveal();
        return;
      }
      if (
        phaseRef.current === "ready" &&
        deltaY < -8 &&
        window.scrollY <= 0
      ) {
        event.preventDefault();
        void reverse();
        return;
      }
      if (phaseRef.current !== "ready") {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [locked, reveal, reverse]);

  const clipActive = phase !== "ready";
  const masking = phase === "revealing" || phase === "reversing";

  return {
    phase,
    clipPath,
    filter,
    isFiltering,
    clipActive,
    masking,
    origin,
    hasOrigin,
    setOrigin,
    markIdle,
  };
}
