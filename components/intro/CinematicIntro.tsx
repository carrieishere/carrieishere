"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { motion } from "framer-motion";
import type { IntroPhase } from "@/hooks/useCinematicIntro";
import { SpeechCapsule } from "@/components/SpeechCapsule";

const TITLE = "(CARRIE .IS .HERE)";
const DOT_AT = TITLE.indexOf(".");
const KICKER_A = "CARRIE YANG";
const KICKER_B = "DESIGNER/ART DIRECTOR";
const BLURB_1 = "SOME THINGS I LIKE, SOME THINGS I MAKE, AND SOME THINGS";
const BLURB_2 = "THAT JUST HAPPENED TO END UP HERE. CONSIDER THIS A";
const BLURB_3 = "LITTLE LOOK INTO MY OWN LITTLE WORLD.";
const GLITCH = "$%@!&*<>?/]{}+^#=~";
const TITLE_MS = 500;
const KICKER_MS = 1200;
const BLURB_MS = 1900;
const HOLD_MS = 900;
const EXIT_MS = 620;
const IDLE_DELAY_MS = 500;
const SECONDARY_MS = Math.max(KICKER_MS + 200, BLURB_MS + 180);
/** 相对白点，单位 px。正数往右；越大离点越远。不要用百分比（父级只有圆点那么宽）。 */
const IDLE_BUBBLE_X = -10;
const IDLE_BUBBLE_Y = 10;

function scrambleToward(target: string, progress: number, keepIndex = -1) {
  const reveal = Math.floor(Math.max(0, Math.min(1, progress)) * target.length);
  let next = "";
  for (let i = 0; i < target.length; i += 1) {
    if (i === keepIndex || target[i] === " " || target[i] === "\n") {
      next += target[i];
      continue;
    }
    const frontier = i >= reveal - 2 && i <= reveal + 1;
    next +=
      i < reveal && !frontier
        ? target[i]!
        : GLITCH[Math.floor(Math.random() * GLITCH.length)]!;
  }
  return next;
}

function easeOut(t: number) {
  return 1 - (1 - t) * (1 - t);
}

function writeNode(node: HTMLElement | null, value: string) {
  if (node && node.textContent !== value) node.textContent = value;
}

interface CinematicIntroProps {
  phase: IntroPhase;
  origin: { x: number; y: number; size: number };
  hasOrigin: boolean;
  onTypingComplete: () => void;
  onOrigin: (x: number, y: number, size: number) => void;
  onReveal: () => void;
}

export function CinematicIntro({
  phase,
  origin,
  hasOrigin,
  onTypingComplete,
  onOrigin,
  onReveal,
}: CinematicIntroProps) {
  const [exiting, setExiting] = useState(false);
  const [showSecondary, setShowSecondary] = useState(false);
  const [dotOn, setDotOn] = useState(true);
  const dotRef: MutableRefObject<HTMLSpanElement | null> = useRef(null);
  const doneRef = useRef(false);
  const titleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const kickerARef = useRef<HTMLSpanElement>(null);
  const kickerBRef = useRef<HTMLSpanElement>(null);
  const blurb1Ref = useRef<HTMLParagraphElement>(null);
  const blurb2Ref = useRef<HTMLParagraphElement>(null);
  const blurb3Ref = useRef<HTMLParagraphElement>(null);

  const paintTitle = (title: string) => {
    titleRefs.current.forEach((node, index) => {
      writeNode(node, title[index] ?? TITLE[index] ?? "");
    });
  };

  const paintSecondary = (copy: {
    kickerA: string;
    kickerB: string;
    blurb1: string;
    blurb2: string;
    blurb3: string;
  }) => {
    writeNode(kickerARef.current, copy.kickerA);
    writeNode(kickerBRef.current, copy.kickerB);
    writeNode(blurb1Ref.current, copy.blurb1);
    writeNode(blurb2Ref.current, copy.blurb2);
    writeNode(blurb3Ref.current, copy.blurb3);
  };

  useEffect(() => {
    if (phase !== "typing" || doneRef.current) return;

    let alive = true;
    let frame = 0;
    const timers = new Set<number>();

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          resolve();
        }, ms);
        timers.add(id);
      });

    const waitFrames = (
      duration: number,
      onFrame: (elapsed: number, t: number) => void,
    ) =>
      new Promise<void>((resolve) => {
        const started = performance.now();
        const tick = (now: number) => {
          if (!alive) return;
          const elapsed = now - started;
          const t = Math.min(1, elapsed / duration);
          onFrame(elapsed, t);
          if (t < 1) {
            frame = window.requestAnimationFrame(tick);
            return;
          }
          resolve();
        };
        frame = window.requestAnimationFrame(tick);
      });

    const reportOrigin = () => {
      const node = dotRef.current;
      if (node) {
        const rect = node.getBoundingClientRect();
        const size = Math.max(8, Math.round(rect.height * 0.125));
        onOrigin(rect.left + rect.width / 2, rect.top + rect.height / 2, size);
        return;
      }
      onOrigin(window.innerWidth / 2, window.innerHeight / 2, 8);
    };

    const playIntro = async () => {
      setExiting(false);
      setShowSecondary(false);
      paintTitle(scrambleToward(TITLE, 0));

      await waitFrames(TITLE_MS, (_elapsed, t) => {
        paintTitle(t >= 1 ? TITLE : scrambleToward(TITLE, easeOut(t)));
      });
      if (!alive) return;
      paintTitle(TITLE);

      setShowSecondary(true);
      await waitFrames(SECONDARY_MS, (elapsed) => {
        paintSecondary({
          kickerA:
            elapsed >= KICKER_MS
              ? KICKER_A
              : scrambleToward(KICKER_A, easeOut(elapsed / KICKER_MS)),
          kickerB:
            elapsed >= KICKER_MS + 200
              ? KICKER_B
              : scrambleToward(KICKER_B, easeOut(elapsed / (KICKER_MS + 200))),
          blurb1:
            elapsed >= BLURB_MS
              ? BLURB_1
              : scrambleToward(BLURB_1, easeOut(elapsed / BLURB_MS)),
          blurb2:
            elapsed >= BLURB_MS
              ? BLURB_2
              : scrambleToward(BLURB_2, easeOut(elapsed / BLURB_MS)),
          blurb3:
            elapsed >= BLURB_MS + 180
              ? BLURB_3
              : scrambleToward(BLURB_3, easeOut(elapsed / (BLURB_MS + 180))),
        });
      });
      if (!alive) return;
      paintTitle(TITLE);
      paintSecondary({
        kickerA: KICKER_A,
        kickerB: KICKER_B,
        blurb1: BLURB_1,
        blurb2: BLURB_2,
        blurb3: BLURB_3,
      });

      await sleep(HOLD_MS);
      if (!alive) return;
      reportOrigin();
      setExiting(true);

      await waitFrames(EXIT_MS, (_elapsed, t) => {
        const progress = 1 - t;
        paintTitle(scrambleToward(TITLE, progress, DOT_AT));
        paintSecondary({
          kickerA: scrambleToward(KICKER_A, progress),
          kickerB: scrambleToward(KICKER_B, progress),
          blurb1: scrambleToward(BLURB_1, progress),
          blurb2: scrambleToward(BLURB_2, progress),
          blurb3: scrambleToward(BLURB_3, progress),
        });
      });
      if (!alive) return;
      doneRef.current = true;
      onTypingComplete();
    };

    void playIntro();

    return () => {
      alive = false;
      window.cancelAnimationFrame(frame);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [onOrigin, onTypingComplete, phase]);

  useEffect(() => {
    if (phase !== "idle") {
      setDotOn(true);
      return;
    }

    let alive = true;
    const timers = new Set<number>();
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          resolve();
        }, ms);
        timers.add(id);
      });

    const blinkOnce = async () => {
      setDotOn(false);
      await sleep(90);
      if (!alive) return;
      setDotOn(true);
      await sleep(210);
    };

    const loop = async () => {
      await sleep(IDLE_DELAY_MS);
      while (alive) {
        await blinkOnce();
        if (!alive) return;
        await blinkOnce();
        if (!alive) return;
        await blinkOnce();
        if (!alive) return;
        await sleep(500);
        if (!alive) return;
        await blinkOnce();
      }
    };

    void loop();
    return () => {
      alive = false;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [phase]);

  if (phase === "ready" || phase === "revealing" || phase === "reversing") {
    return null;
  }

  const showType = phase === "typing";
  const showDot =
    hasOrigin && (phase === "idle" || (phase === "typing" && exiting));
  const secondaryOpacity = exiting ? 0 : showSecondary ? 1 : 0;

  return (
    <div className="pointer-events-auto fixed inset-0 z-[120] flex items-center justify-center bg-black">
      {showType ? (
        <div className="flex max-w-[min(80vw,56rem)] flex-col items-center px-6 text-center">
          <motion.p
            className="opacity-0 font-creato-black text-[0.75rem] leading-[1.1] tracking-[0.08em] text-[#4a4a4a]"
            initial={{ opacity: 0 }}
            animate={{ opacity: secondaryOpacity }}
            transition={{
              duration: exiting ? EXIT_MS / 1000 : 0,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <span ref={kickerARef}>{KICKER_A}</span>
            <br />
            <span ref={kickerBRef}>{KICKER_B}</span>
          </motion.p>
          <h1 className="mt-[0.4rem] whitespace-pre font-creato-black text-[3rem] leading-[0.92] tracking-[-0.032em] text-white">
            {TITLE.split("").map((ch, index) => {
              const isDot = index === DOT_AT;
              return (
                <motion.span
                  key={`${ch}-${index}`}
                  ref={(node) => {
                    const el = node as HTMLSpanElement | null;
                    titleRefs.current[index] = el;
                    if (isDot) dotRef.current = el;
                  }}
                  className={isDot ? "inline-block opacity-0" : "opacity-0"}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: exiting && (!isDot || showDot) ? 0 : 1,
                  }}
                  transition={{
                    duration: EXIT_MS / 1000,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  {ch}
                </motion.span>
              );
            })}
          </h1>
          <motion.div
            className="mt-[0.7rem] opacity-0 font-creato-black text-[0.75rem] leading-[1.1] tracking-[0.em] text-[#4a4a4a]"
            initial={{ opacity: 0 }}
            animate={{ opacity: secondaryOpacity }}
            transition={{
              duration: exiting ? EXIT_MS / 1000 : 0,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <p ref={blurb1Ref} className="whitespace-nowrap">
              {BLURB_1}
            </p>
            <p ref={blurb2Ref} className="whitespace-nowrap">
              {BLURB_2}
            </p>
            <p ref={blurb3Ref} className="whitespace-nowrap">
              {BLURB_3}
            </p>
          </motion.div>
        </div>
      ) : null}

      {showDot ? (
        <div
          className="fixed"
          style={{
            left: origin.x,
            top: 415,
            transform: "translate(-50%, -50%)",
          }}
          onClick={phase === "idle" ? onReveal : undefined}
        >
          <span
            aria-hidden
            className="block rounded-full bg-white"
            style={{
              width: 11,
              height: 11,
              opacity: phase === "idle" && !dotOn ? 0 : 1,
            }}
          />
          {phase === "idle" ? (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              className="absolute"
              style={{
                left: IDLE_BUBBLE_X,
                bottom: `calc(100% + ${IDLE_BUBBLE_Y}px)`,
              }}
            >
              <SpeechCapsule>Hi, I&apos;m right here.</SpeechCapsule>
            </motion.div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
