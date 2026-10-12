"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  MOBILE_ART_HEIGHT,
  MOBILE_ART_WIDTH,
  MOBILE_EMAIL,
  MOBILE_FOOTER_BUBBLE,
  MOBILE_FOOTER_ENTER_S,
  MOBILE_FOOTER_EXIT_MS,
  MOBILE_FOOTER_GAP_MS,
  MOBILE_FOOTER_LINES,
  MOBILE_FOOTER_TYPING_MAX_MS,
  MOBILE_FOOTER_TYPING_MIN_MS,
  MOBILE_HOTSPOTS,
  MOBILE_INSTAGRAM,
  MOBILE_ITEM_HINTS,
  MOBILE_MAILTO,
  MOBILE_SCENE_PARALLAX,
  MOBILE_TITLE_BUBBLE,
  MOBILE_TOP_IDLE,
  MOBILE_TOP_NUDGE,
  MOBILE_TOP_NUDGE_MS,
  MOBILE_TOP_TAP,
  SHOW_MOBILE_HOTSPOTS,
  mobileFooterDwellMs,
  type MobileBubbleTail,
  type MobileItemId,
} from "@/lib/mobileHome";

const ITEM_HINT_MS = 3000;

const HOTSPOT_TINT = [
  "outline-red-500 bg-red-500/25",
  "outline-orange-500 bg-orange-500/25",
  "outline-amber-400 bg-amber-400/25",
  "outline-blue-500 bg-blue-500/25",
  "outline-violet-500 bg-violet-500/25",
  "outline-pink-500 bg-pink-500/25",
  "outline-cyan-500 bg-cyan-500/25",
  "outline-lime-500 bg-lime-500/25",
  "outline-stone-600 bg-stone-600/25",
];

const TAIL_BASE =
  "pointer-events-none absolute -bottom-[5px] z-[1] h-[11px] w-[11px] rotate-[40deg] rounded-[0.5px] bg-[#e6e6e6]";

const TAIL_CLASS: Record<MobileBubbleTail, string> = {
  left: `${TAIL_BASE} left-[1.4rem]`,
  center: `${TAIL_BASE} left-1/2 -translate-x-1/2`,
  right: `${TAIL_BASE} right-[1.4rem]`,
};

const CAPSULE_CLASS =
  "relative overflow-visible whitespace-normal rounded-[1.25rem] bg-[#e6e6e6] px-[1.05rem] py-[0.55rem] font-creato-medium text-[0.82rem] leading-snug tracking-wide !text-black";

const POP = {
  initial: { opacity: 0, y: 6, scale: 0.94 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 6, scale: 0.94 },
  transition: { duration: 0.2 },
};

function sleep(ms: number, timers: Set<number>) {
  return new Promise<void>((resolve) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      resolve();
    }, ms);
    timers.add(id);
  });
}

function JustifiedLine({ text }: { text: string }) {
  return (
    <p className="flex w-full justify-between whitespace-nowrap">
      {text.split(" ").map((word, index) => (
        <span key={`${word}-${index}`}>{word}</span>
      ))}
    </p>
  );
}

function Capsule({
  children,
  className = "",
  tail = "left",
  bw,
}: {
  children: ReactNode;
  className?: string;
  tail?: MobileBubbleTail;
  bw?: number;
}) {
  return (
    <div
      className={`${CAPSULE_CLASS} ${className}`}
      style={{ maxWidth: bw ?? 280 }}
    >
      {children}
      <span aria-hidden className={TAIL_CLASS[tail]} />
    </div>
  );
}

function TypingDots() {
  return (
    <span className="mobile-typing" aria-hidden>
      <i />
      <i />
      <i />
    </span>
  );
}

function ItemBubble({
  text,
  tail = "left",
  bx = 0,
  by = 0,
  bw,
}: {
  text: string;
  tail?: MobileBubbleTail;
  bx?: number;
  by?: number;
  bw?: number;
}) {
  return (
    <div
      className="pointer-events-none absolute z-30 w-max"
      style={{ left: bx, top: by }}
    >
      <motion.div {...POP}>
        <Capsule tail={tail} bw={bw}>
          {text}
        </Capsule>
      </motion.div>
    </div>
  );
}

function TitleBubble({ text }: { text: string }) {
  const { bx, by, bw, tail } = MOBILE_TITLE_BUBBLE;
  return (
    <motion.div
      className="pointer-events-none absolute z-30 w-max"
      style={{ right: -bx, top: by }}
      {...POP}
    >
      <Capsule tail={tail} bw={bw}>
        {text}
      </Capsule>
    </motion.div>
  );
}

export function MobileHome({ active = true }: { active?: boolean }) {
  const [activeId, setActiveId] = useState<MobileItemId | null>(null);
  const [titleText, setTitleText] = useState<string | null>(null);
  const [showHotspots, setShowHotspots] = useState(SHOW_MOBILE_HOTSPOTS);
  const hintTimer = useRef(0);
  const titleLocked = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("hotspots") === "1") setShowHotspots(true);
  }, []);

  const clearItemHint = useCallback(() => {
    window.clearTimeout(hintTimer.current);
    setActiveId(null);
  }, []);

  const showItem = useCallback((id: MobileItemId) => {
    window.clearTimeout(hintTimer.current);
    setActiveId(id);
    hintTimer.current = window.setTimeout(() => {
      setActiveId(null);
    }, ITEM_HINT_MS);
  }, []);

  useEffect(() => {
    if (!active) {
      titleLocked.current = false;
      setTitleText(null);
      return;
    }

    titleLocked.current = false;
    setTitleText(MOBILE_TOP_IDLE);
    let hide = 0;
    const nudge = window.setTimeout(() => {
      if (titleLocked.current) return;
      setTitleText(MOBILE_TOP_NUDGE);
      hide = window.setTimeout(() => {
        if (!titleLocked.current) setTitleText(null);
      }, MOBILE_TOP_NUDGE_MS);
    }, MOBILE_TOP_NUDGE_MS);
    return () => {
      window.clearTimeout(nudge);
      window.clearTimeout(hide);
      window.clearTimeout(hintTimer.current);
    };
  }, [active]);

  const onTitleTap = (event: MouseEvent<HTMLHeadingElement>) => {
    event.stopPropagation();
    titleLocked.current = true;
    setTitleText(MOBILE_TOP_TAP);
    window.location.href = MOBILE_MAILTO;
  };

  const scrollerRef = useRef<HTMLDivElement>(null);
  const grow = useMotionValue(0);
  const sceneY = useMotionValue(0);
  const scrollMix = useMotionValue(0);
  const pageBg = useTransform(
    scrollMix,
    [0, 1],
    ["rgb(255, 255, 255)", "rgb(0, 0, 0)"],
  );
  const atBottomRef = useRef(false);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    if (!active) return;
    const el = scrollerRef.current;
    if (!el) return;

    const readBottom = () =>
      el.scrollHeight - el.scrollTop - el.clientHeight <= 10;

    const paintScroll = () => {
      const max = Math.max(1, el.scrollHeight - el.clientHeight);
      scrollMix.set(el.scrollTop / max);
      sceneY.set(
        reduceMotion.current ? 0 : el.scrollTop * MOBILE_SCENE_PARALLAX,
      );
    };

    const onScroll = () => {
      paintScroll();
      const hit = readBottom();
      if (hit && !atBottomRef.current) {
        atBottomRef.current = true;
        void animate(grow, 24, {
          type: "spring",
          stiffness: 200,
          damping: 13,
          mass: 0.7,
        }).then(() =>
          animate(grow, 11, {
            type: "spring",
            stiffness: 170,
            damping: 16,
          }),
        );
      } else if (!hit && atBottomRef.current) {
        atBottomRef.current = false;
        void animate(grow, 0, { type: "spring", stiffness: 260, damping: 24 });
      }
    };

    let startY = 0;
    let base = 0;
    const onTouchStart = (event: TouchEvent) => {
      startY = event.touches[0]?.clientY ?? 0;
      base = grow.get();
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!readBottom()) return;
      const y = event.touches[0]?.clientY ?? startY;
      const dy = startY - y;
      if (dy <= 0) return;
      if (event.cancelable) event.preventDefault();
      grow.set(base + Math.min(52, dy * 0.34));
    };
    const onTouchEnd = () => {
      if (!readBottom()) return;
      const next = grow.get() > 30 ? 16 : 11;
      void animate(grow, next, { type: "spring", stiffness: 210, damping: 16 });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    onScroll();
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [active, grow, sceneY, scrollMix]);

  const onBlank = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("[data-mobile-hotspot]")) return;
    if (activeId) clearItemHint();
  };

  return (
    <motion.div
      ref={scrollerRef}
      className={`relative w-full ${
        active
          ? "mobile-home-scroll h-full overflow-y-auto overscroll-y-contain"
          : "min-h-screen overflow-hidden"
      }`}
      style={{ backgroundColor: pageBg }}
      onClick={onBlank}
    >
      <header className="relative z-0 overflow-visible bg-white px-[6%] pb-5 pt-[18%]">
        <div className="flex flex-col items-center text-center">
          <p className="font-creato-black text-[clamp(6px,2vw,9px)] leading-[1] tracking-[0.02em] text-[#4a4a4a]">
            CARRIE YANG
            <br />
            DESIGNER/ART DIRECTOR
          </p>
          <div className="relative mt-[0.2em] w-max max-w-full overflow-visible">
            <h1
              className="relative cursor-pointer whitespace-nowrap font-creato-black text-[clamp(1.35rem,7.6vw,2.35rem)] leading-[0.92] tracking-[-0.032em] text-black"
              onClick={onTitleTap}
            >
              (CARRIE .IS .HERE)
              <AnimatePresence mode="wait">
                {titleText ? (
                  <TitleBubble key={titleText} text={titleText} />
                ) : null}
              </AnimatePresence>
            </h1>
            <div className="mt-[0.7em] w-full font-creato-black text-[clamp(6px,2vw,9px)] leading-[1.15] tracking-[0.02em] text-[#4a4a4a]">
              <JustifiedLine text="SOME THINGS I LIKE, SOME THINGS I MAKE, AND SOME THINGS" />
              <JustifiedLine text="THAT JUST HAPPENED TO END UP HERE. CONSIDER THIS A LITTLE" />
              <p className="text-center whitespace-nowrap">
                LOOK INTO MY OWN LITTLE WORLD.
              </p>
            </div>
          </div>
        </div>
      </header>

      <motion.div
        className="relative z-20 w-full overflow-visible"
        style={{ y: sceneY }}
      >
        <img
          src="/assets/mobile/mobile.webp"
          alt=""
          width={MOBILE_ART_WIDTH}
          height={MOBILE_ART_HEIGHT}
          draggable={false}
          className="block h-auto w-full select-none"
        />
        {MOBILE_HOTSPOTS.map((spot, index) => (
          <div
            key={spot.id}
            data-mobile-hotspot=""
            className={`absolute ${
              showHotspots
                ? `outline outline-2 outline-offset-[-1px] ${HOTSPOT_TINT[index % HOTSPOT_TINT.length]}`
                : ""
            }`}
            style={{
              left: spot.left,
              top: spot.top,
              width: spot.width,
              height: spot.height,
              zIndex: activeId === spot.id ? 40 : spot.z,
            }}
          >
            {showHotspots ? (
              <span className="pointer-events-none absolute left-0 top-0 z-50 bg-black/70 px-1 py-px text-[10px] leading-none text-white">
                {spot.label}
              </span>
            ) : null}
            <button
              type="button"
              aria-label={spot.label}
              className="absolute inset-0 cursor-pointer border-0 bg-transparent p-0"
              onClick={(event) => {
                event.stopPropagation();
                showItem(spot.id);
              }}
            />
            <AnimatePresence>
              {activeId === spot.id ? (
                <ItemBubble
                  key={spot.id}
                  text={MOBILE_ITEM_HINTS[spot.id]}
                  tail={spot.tail}
                  bx={spot.bx}
                  by={spot.by}
                  bw={spot.bw}
                />
              ) : null}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>

      <MobileContactFooter active={active} grow={grow} />
    </motion.div>
  );
}

function hapticTap() {
  try {
    navigator.vibrate?.(14);
  } catch {
    /* iOS Safari ignores vibrate */
  }
}

function MobileContactFooter({
  active,
  grow,
}: {
  active: boolean;
  grow: MotionValue<number>;
}) {
  const footerRef = useRef<HTMLElement>(null);
  const playingRef = useRef(false);
  const indexRef = useRef(0);
  const typedOnceRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<"off" | "typing" | "line">("off");
  const [lineIndex, setLineIndex] = useState(0);
  const [hint, setHint] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const padTop = useTransform(grow, (value) => 48 + value);
  const text = MOBILE_FOOTER_LINES[lineIndex] ?? MOBILE_FOOTER_LINES[0]!;

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    if (!active) {
      playingRef.current = false;
      typedOnceRef.current = false;
      indexRef.current = 0;
      setPlaying(false);
      setPhase("off");
      return;
    }
    const node = footerRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const on = (entry?.intersectionRatio ?? 0) >= 0.5;
        playingRef.current = on;
        setPlaying(on);
        if (!on) setPhase("off");
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [active]);

  useEffect(() => {
    if (!playing) return;
    let alive = true;
    const timers = new Set<number>();
    const wait = async (ms: number) => {
      await sleep(ms, timers);
      return alive && playingRef.current;
    };

    const run = async () => {
      while (alive && playingRef.current) {
        const index = indexRef.current;
        setLineIndex(index);
        if (!typedOnceRef.current) {
          setPhase("typing");
          const typing =
            MOBILE_FOOTER_TYPING_MIN_MS +
            Math.random() *
              (MOBILE_FOOTER_TYPING_MAX_MS - MOBILE_FOOTER_TYPING_MIN_MS);
          if (!(await wait(typing))) break;
          typedOnceRef.current = true;
        }
        setPhase("line");
        if (!(await wait(mobileFooterDwellMs(MOBILE_FOOTER_LINES[index]!)))) break;
        setPhase("off");
        if (!(await wait(MOBILE_FOOTER_EXIT_MS + MOBILE_FOOTER_GAP_MS))) break;
        indexRef.current = (index + 1) % MOBILE_FOOTER_LINES.length;
      }
    };

    void run();
    return () => {
      alive = false;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [playing]);

  const onContact = async () => {
    hapticTap();
    try {
      await navigator.clipboard.writeText(MOBILE_EMAIL);
    } catch {
      /* clipboard can fail in some browsers */
    }
    setHint(true);
    window.setTimeout(() => setHint(false), 1800);
    window.location.href = MOBILE_MAILTO;
  };

  return (
    <motion.footer
      ref={footerRef}
      className="relative z-20 overflow-visible bg-black px-5 pb-[max(4.5rem,env(safe-area-inset-bottom))] text-white"
      style={{ paddingTop: padTop }}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        aria-label="Email Carrie"
        className="relative mx-auto flex w-full max-w-[22rem] flex-col items-center bg-transparent p-0"
        onClick={() => void onContact()}
      >
        <div className="flex min-h-[5.4rem] w-full items-end justify-center pb-3">
          <AnimatePresence mode="wait">
            {phase === "typing" ? (
              <motion.div
                key="typing"
                className="flex origin-bottom justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0.25 : 0.12 }}
              >
                <Capsule
                  className="px-[0.9rem] py-[0.48rem]"
                  tail={MOBILE_FOOTER_BUBBLE.tail}
                >
                  <TypingDots />
                </Capsule>
              </motion.div>
            ) : null}
            {phase === "line" ? (
              <motion.div
                key={`line-${lineIndex}`}
                className="flex origin-bottom justify-center"
                initial={
                  reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.28 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  reduceMotion
                    ? { opacity: 0, transition: { duration: 0.3 } }
                    : {
                        opacity: 0,
                        y: -10,
                        scale: 1,
                        transition: {
                          duration: MOBILE_FOOTER_EXIT_MS / 1000,
                          ease: "easeOut",
                        },
                      }
                }
                transition={
                  reduceMotion
                    ? { duration: 0.3, ease: "easeInOut" }
                    : {
                        opacity: { duration: MOBILE_FOOTER_ENTER_S },
                        scale: {
                          type: "spring",
                          stiffness: 430,
                          damping: 16,
                          mass: 0.7,
                        },
                      }
                }
              >
                <Capsule
                  className="text-center"
                  tail={MOBILE_FOOTER_BUBBLE.tail}
                  bw={MOBILE_FOOTER_BUBBLE.bw}
                >
                  {text}
                </Capsule>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <span className="mobile-footer-dot" aria-hidden />
        <span
          className={`mt-3 font-creato-medium text-[0.72rem] tracking-wide text-white/70 ${
            hint ? "opacity-100" : "opacity-0"
          }`}
        >
          Email copied
        </span>
      </button>
      <a
        href={MOBILE_INSTAGRAM}
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram @carrieyhere"
        className="mobile-footer-marquee mt-6 block w-[calc(100%+2.5rem)] -mx-5"
      >
        <span className="mobile-footer-marquee-track font-creato-black">
          <span className="flex shrink-0">
            {Array.from({ length: 8 }, (_, index) => (
              <span key={`a-${index}`} className="whitespace-nowrap px-[0.28em]">
                @CARRIEYHERE
              </span>
            ))}
          </span>
          <span className="flex shrink-0" aria-hidden>
            {Array.from({ length: 8 }, (_, index) => (
              <span key={`b-${index}`} className="whitespace-nowrap px-[0.28em]">
                @CARRIEYHERE
              </span>
            ))}
          </span>
        </span>
      </a>
    </motion.footer>
  );
}
