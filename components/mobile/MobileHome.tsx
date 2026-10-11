"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SPEECH_CAPSULE_CLASS } from "@/components/SpeechCapsule";
import { useMobileIntroCarousel } from "@/components/mobile/useMobileIntroCarousel";
import {
  MOBILE_ART_HEIGHT,
  MOBILE_ART_WIDTH,
  MOBILE_FIXED_BUBBLE,
  MOBILE_FOOTER_CAROUSEL,
  MOBILE_FOOTER_FADE_MS,
  MOBILE_FOOTER_FIXED,
  MOBILE_FOOTER_HANDLE,
  MOBILE_FOOTER_SLOTS,
  MOBILE_HOTSPOTS,
  MOBILE_ITEM_HINTS,
  MOBILE_MAILTO,
  MOBILE_TOP_IDLE_BUBBLE,
  MOBILE_TOP_NUDGE_BUBBLE,
  MOBILE_TOP_TAP_BUBBLE,
  MOBILE_TOP_IDLE,
  MOBILE_TOP_NUDGE,
  MOBILE_TOP_NUDGE_MS,
  MOBILE_TOP_TAP,
  SHOW_MOBILE_HOTSPOTS,
  type MobileBubbleSlot,
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

const TAIL_CLASS: Record<MobileBubbleTail, string> = {
  left: "pointer-events-none absolute -bottom-[5px] left-[1.4rem] z-[1] h-[11px] w-[11px] rotate-[40deg] rounded-[0.5px] bg-[#e6e6e6]",
  center:
    "pointer-events-none absolute -bottom-[5px] left-1/2 z-[1] h-[11px] w-[11px] -translate-x-1/2 rotate-[40deg] rounded-[0.5px] bg-[#e6e6e6]",
  right:
    "pointer-events-none absolute -bottom-[5px] right-[1.4rem] z-[1] h-[11px] w-[11px] rotate-[40deg] rounded-[0.5px] bg-[#e6e6e6]",
  "top-left":
    "pointer-events-none absolute -top-[5px] left-[1.4rem] z-[1] h-[11px] w-[11px] rotate-[40deg] rounded-[0.5px] bg-[#e6e6e6]",
  "top-right":
    "pointer-events-none absolute -top-[5px] right-[1.4rem] z-[1] h-[11px] w-[11px] rotate-[40deg] rounded-[0.5px] bg-[#e6e6e6]",
};

function footerCarouselTail(slot: MobileBubbleSlot): MobileBubbleTail {
  if (slot === "bl") return "top-left";
  if (slot === "br") return "top-right";
  return "right";
}

function footerSlotStyle(slot: MobileBubbleSlot, bx: number, by: number) {
  if (slot === "tl") {
    return { left: bx, bottom: `calc(100% + 12px - ${by}px)` };
  }
  if (slot === "bl") {
    return { left: bx, top: `calc(100% + 12px + ${by}px)` };
  }
  return { right: -bx, top: `calc(100% + 12px + ${by}px)` };
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
  bh,
}: {
  children: string;
  className?: string;
  tail?: MobileBubbleTail;
  bw?: number;
  bh?: number;
}) {
  return (
    <div
      className={`relative overflow-visible ${SPEECH_CAPSULE_CLASS} !whitespace-normal !rounded-[1.25rem] text-left leading-snug ${className}`}
      style={{
        maxWidth: bw ?? 280,
        minHeight: bh ? bh : undefined,
      }}
    >
      {children}
      <span aria-hidden className={TAIL_CLASS[tail]} />
    </div>
  );
}

function ItemBubble({
  text,
  tail = "left",
  bx = 0,
  by = 0,
  bw,
  bh,
}: {
  text: string;
  tail?: MobileBubbleTail;
  bx?: number;
  by?: number;
  bw?: number;
  bh?: number;
}) {
  return (
    <div
      className="pointer-events-none absolute z-30 w-max"
      style={{ left: bx, top: by }}
    >
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.94 }}
        transition={{ duration: 0.2 }}
      >
        <Capsule tail={tail} bw={bw} bh={bh}>
          {text}
        </Capsule>
      </motion.div>
    </div>
  );
}

function TitleBubble({ text }: { text: string }) {
  const layout =
    text === MOBILE_TOP_IDLE
      ? MOBILE_TOP_IDLE_BUBBLE
      : text === MOBILE_TOP_NUDGE
        ? MOBILE_TOP_NUDGE_BUBBLE
        : MOBILE_TOP_TAP_BUBBLE;
  const { bx, by, bw, bh, tail } = layout;
  return (
    <motion.div
      className="pointer-events-none absolute z-30 w-max"
      style={{ right: -bx, top: by }}
      initial={{ opacity: 0, y: 6, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.94 }}
      transition={{ duration: 0.2 }}
    >
      <Capsule tail={tail} bw={bw} bh={bh}>
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
  };

  const onBlank = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("[data-mobile-hotspot]")) return;
    if (activeId) clearItemHint();
  };

  return (
    <div
      className={`relative w-full bg-white ${
        active
          ? "h-full overflow-y-auto overscroll-y-contain snap-y snap-proximity"
          : "min-h-screen overflow-hidden"
      }`}
      onClick={onBlank}
    >
      <header className="relative z-0 snap-start overflow-visible bg-white px-[6%] pb-5 pt-[18%]">
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

      <div className="relative z-20 w-full overflow-visible bg-white">
        <div className="relative overflow-visible w-full">
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
                    bh={spot.bh}
                  />
                ) : null}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <MobileContactFooter active={active} />
    </div>
  );
}

function MobileContactFooter({ active }: { active: boolean }) {
  const footerRef = useRef<HTMLElement>(null);
  const [arrived, setArrived] = useState(false);
  const [talk, setTalk] = useState(false);
  const bubbles = useMobileIntroCarousel(active && talk);

  useEffect(() => {
    if (!active) {
      setArrived(false);
      setTalk(false);
      return;
    }
    const node = footerRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setArrived(true);
      },
      { threshold: 0.22 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [active]);

  useEffect(() => {
    if (!arrived) return;
    const timer = window.setTimeout(() => setTalk(true), 520);
    return () => window.clearTimeout(timer);
  }, [arrived]);

  return (
    <footer
      ref={footerRef}
      className="relative z-20 snap-end overflow-visible bg-black px-5 pb-[max(8.5rem,env(safe-area-inset-bottom))] pt-16 text-white"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="relative mx-auto flex min-h-[9.5rem] max-w-[22rem] items-center justify-center">
        <motion.div
          className="pointer-events-none absolute bottom-[calc(100%+10px)] right-0 z-20"
          initial={false}
          animate={{
            opacity: arrived ? 1 : 0,
            x: MOBILE_FOOTER_FIXED.bx,
            y: arrived ? MOBILE_FOOTER_FIXED.by : MOBILE_FOOTER_FIXED.by + 12,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Capsule
            tail={MOBILE_FOOTER_FIXED.tail}
            bw={MOBILE_FOOTER_FIXED.bw}
            bh={MOBILE_FOOTER_FIXED.bh}
          >
            {MOBILE_FIXED_BUBBLE}
          </Capsule>
        </motion.div>

        <AnimatePresence>
          {bubbles.map((bubble) => {
            const shift = MOBILE_FOOTER_SLOTS[bubble.slot];
            return (
              <motion.div
                key={bubble.key}
                className="pointer-events-none absolute z-10"
                style={footerSlotStyle(bubble.slot, shift.bx, shift.by)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{
                  duration: MOBILE_FOOTER_FADE_MS / 1000,
                  ease: "easeInOut",
                }}
              >
                <Capsule
                  tail={footerCarouselTail(bubble.slot)}
                  bw={MOBILE_FOOTER_CAROUSEL.bw}
                  bh={MOBILE_FOOTER_CAROUSEL.bh}
                >
                  {bubble.text}
                </Capsule>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <motion.a
          href={MOBILE_MAILTO}
          className="relative z-30 whitespace-nowrap font-creato-black text-[clamp(1.7rem,8.4vw,2.75rem)] leading-none tracking-tight text-white"
          initial={false}
          animate={{
            opacity: arrived ? 1 : 0,
            x: MOBILE_FOOTER_HANDLE.bx,
            y: arrived ? MOBILE_FOOTER_HANDLE.by : MOBILE_FOOTER_HANDLE.by + 12,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ pointerEvents: arrived ? "auto" : "none" }}
        >
          @CARRIEYHERE
        </motion.a>
      </div>
    </footer>
  );
}
