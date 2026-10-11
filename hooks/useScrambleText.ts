"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GLITCH_CHARS = "$%@!&*<>?/]{}+^";

/**
 * 与首页主标题相同的乱码过渡：rAF 逐帧揭示目标字符串，卸载时取消帧。
 */
export function useScrambleText(initial: string) {
  const [text, setText] = useState(initial);
  const rafRef = useRef(0);
  const aliveRef = useRef(true);

  const stopScramble = useCallback(() => {
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const playScramble = useCallback(
    (target: string, duration: number) => {
      stopScramble();
      if (!aliveRef.current) return;
      const started = performance.now();

      const tick = (now: number) => {
        if (!aliveRef.current) {
          rafRef.current = 0;
          return;
        }
        const t = Math.min(1, (now - started) / duration);
        const eased = 1 - (1 - t) * (1 - t);
        const reveal = Math.floor(eased * target.length);
        let next = "";
        for (let i = 0; i < target.length; i += 1) {
          next +=
            i < reveal
              ? target[i]!
              : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]!;
        }
        setText(next);

        if (t < 1) {
          rafRef.current = window.requestAnimationFrame(tick);
          return;
        }

        setText(target);
        rafRef.current = 0;
      };

      rafRef.current = window.requestAnimationFrame(tick);
    },
    [stopScramble],
  );

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      stopScramble();
    };
  }, [stopScramble]);

  return { text, playScramble };
}
