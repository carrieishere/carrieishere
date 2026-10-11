"use client";

import { useEffect, useRef, useState } from "react";
import {
  MOBILE_FOOTER_FADE_MS,
  MOBILE_FOOTER_GAP_MS,
  MOBILE_FOOTER_LINES,
  MOBILE_FOOTER_SHOW_MS,
  MOBILE_FOOTER_STAGGER_MS,
  type MobileBubbleSlot,
} from "@/lib/mobileHome";

export type CarouselBubble = {
  key: number;
  text: string;
  slot: MobileBubbleSlot;
};

const SLOT_ORDER: MobileBubbleSlot[] = ["tl", "br", "bl"];

function takeLine(
  queue: readonly string[],
  cursors: Record<MobileBubbleSlot, number>,
  slot: MobileBubbleSlot,
) {
  const total = queue.length;
  if (!total) return null;
  const text = queue[cursors[slot] % total]!;
  cursors[slot] = (cursors[slot] + 1) % total;
  return text;
}

export function useMobileIntroCarousel(active: boolean) {
  const [bubbles, setBubbles] = useState<CarouselBubble[]>([]);
  const keyRef = useRef(0);
  const cursors = useRef<Record<MobileBubbleSlot, number>>({
    tl: 0,
    bl: 0,
    br: 0,
  });

  useEffect(() => {
    if (!active) {
      setBubbles([]);
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    cursors.current = { tl: 0, bl: 0, br: 0 };
    const timers = new Set<number>();
    let alive = true;

    const runSlot = (slot: MobileBubbleSlot) => {
      if (!alive) return;
      const text = takeLine(MOBILE_FOOTER_LINES[slot], cursors.current, slot);
      if (!text) return;

      const key = (keyRef.current += 1);
      setBubbles((current) => [...current.filter((bubble) => bubble.slot !== slot), { key, text, slot }]);

      const hide = window.setTimeout(() => {
        timers.delete(hide);
        setBubbles((current) => current.filter((bubble) => bubble.key !== key));
        const refill = window.setTimeout(runSlot, MOBILE_FOOTER_FADE_MS + MOBILE_FOOTER_GAP_MS, slot);
        timers.add(refill);
      }, MOBILE_FOOTER_SHOW_MS);
      timers.add(hide);
    };

    SLOT_ORDER.forEach((slot, index) => {
      const start = window.setTimeout(() => runSlot(slot), index * MOBILE_FOOTER_STAGGER_MS);
      timers.add(start);
    });

    return () => {
      alive = false;
      timers.forEach((id) => window.clearTimeout(id));
      setBubbles([]);
    };
  }, [active]);

  return bubbles;
}
