"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { useTheme } from "next-themes";
import {
  GREETING_GIF,
  IDLE_GIF,
  IDLE_GIF_FALLBACK,
  IDLE_POSES,
  POSE_PHRASES,
  QUESTIONS,
  poseDurationMs,
  type QuestionId,
} from "@/components/chat/chatData";

const IDLE_BUBBLE_DELAY_MS = 800;

interface InteractiveChatModalProps {
  closeButtonRef: RefObject<HTMLButtonElement>;
  onClose: () => void;
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span aria-hidden className="h-4 w-4 rounded-full border border-white" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "切换为浅色模式" : "切换为深色模式"}
      className="relative h-4 w-4 overflow-hidden rounded-full border border-white"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span
        className={`absolute inset-y-0 left-0 w-1/2 ${isDark ? "bg-black" : "bg-white"}`}
      />
      <span
        className={`absolute inset-y-0 right-0 w-1/2 ${isDark ? "bg-white" : "bg-black"}`}
      />
    </button>
  );
}

const CHARACTER_LAYER_CLASS =
  "absolute bottom-0 left-1/2 h-full w-auto max-h-full max-w-full -translate-x-1/2 object-contain object-bottom transform-gpu translate-z-0 will-change-transform";

function layerClass(visible: boolean) {
  return visible
    ? `${CHARACTER_LAYER_CLASS} z-10 mix-blend-multiply`
    : `${CHARACTER_LAYER_CLASS} pointer-events-none z-0 opacity-0 mix-blend-normal`;
}

function CharacterGif({ src, fallback }: { src: string; fallback: string }) {
  const [layerA, setLayerA] = useState(src);
  const [layerB, setLayerB] = useState<string | null>(null);
  const [useA, setUseA] = useState(true);
  const aRef = useRef<HTMLImageElement>(null);
  const bRef = useRef<HTMLImageElement>(null);
  const visibleSrc = useA ? layerA : layerB;

  useEffect(() => {
    if (src === visibleSrc) return;
    if (useA) {
      if (layerB === src) setUseA(false);
      else setLayerB(src);
      return;
    }
    if (layerA === src) setUseA(true);
    else setLayerA(src);
  }, [src, useA, layerA, layerB, visibleSrc]);

  useLayoutEffect(() => {
    const hidden = useA ? bRef.current : aRef.current;
    const hiddenSrc = useA ? layerB : layerA;
    if (!hidden || hiddenSrc !== src) return;

    let cancelled = false;
    const flip = () => {
      if (!cancelled) setUseA(!useA);
    };

    if (hidden.complete && hidden.naturalWidth > 0) {
      flip();
      return;
    }

    hidden.addEventListener("load", flip);
    return () => {
      cancelled = true;
      hidden.removeEventListener("load", flip);
    };
  }, [src, useA, layerA, layerB]);

  return (
    <span className="relative flex h-full w-full items-end justify-center contain-paint isolation-auto">
      <img
        ref={aRef}
        src={layerA}
        alt=""
        draggable={false}
        className={layerClass(useA)}
        onError={() => {
          setLayerA(fallback);
          setUseA(true);
        }}
      />
      {layerB ? (
        <img
          ref={bRef}
          src={layerB}
          alt=""
          draggable={false}
          className={layerClass(!useA)}
          onError={() => {
            setLayerB(fallback);
            setUseA(false);
          }}
        />
      ) : null}
    </span>
  );
}

function pickIdlePose(exclude?: string | null) {
  const pool = IDLE_POSES.filter((pose) => pose !== exclude);
  const source = pool.length > 0 ? pool : [...IDLE_POSES];
  return source[Math.floor(Math.random() * source.length)]!;
}

export function InteractiveChatModal({
  closeButtonRef,
  onClose,
}: InteractiveChatModalProps) {
  const [activeQuestion, setActiveQuestion] = useState<QuestionId | null>(null);
  const [greetingDone, setGreetingDone] = useState(false);
  const [idlePose, setIdlePose] = useState(GREETING_GIF);
  const [bubblePose, setBubblePose] = useState<string | null>(null);
  const [origin] = useState(() => ({
    x: typeof window === "undefined" ? 420 : Math.round(window.innerWidth * 0.48),
    y: typeof window === "undefined" ? 140 : Math.round(window.innerHeight * 0.18),
  }));
  const x = useMotionValue(origin.x);
  const y = useMotionValue(origin.y);

  useEffect(() => {
    const srcs = [
      GREETING_GIF,
      IDLE_GIF_FALLBACK,
      ...IDLE_POSES,
      ...QUESTIONS.map((item) => item.gif),
    ];
    srcs.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (activeQuestion === null) return;

    const poseSrc =
      QUESTIONS.find((item) => item.id === activeQuestion)?.gif ?? IDLE_GIF;
    const id = window.setTimeout(() => {
      setActiveQuestion(null);
      setIdlePose(pickIdlePose());
    }, poseDurationMs(poseSrc));

    return () => window.clearTimeout(id);
  }, [activeQuestion]);

  useEffect(() => {
    if (activeQuestion !== null) return;

    if (greetingDone && idlePose === GREETING_GIF) {
      setIdlePose(pickIdlePose());
      return;
    }

    const id = window.setTimeout(() => {
      setGreetingDone(true);
      setIdlePose(pickIdlePose(idlePose === GREETING_GIF ? null : idlePose));
    }, poseDurationMs(idlePose));

    return () => window.clearTimeout(id);
  }, [activeQuestion, greetingDone, idlePose]);

  const question = QUESTIONS.find((item) => item.id === activeQuestion);
  const greetingLocked = !greetingDone && activeQuestion === null;
  const gifSrc = question?.gif ?? (greetingLocked ? GREETING_GIF : idlePose);

  useEffect(() => {
    if (activeQuestion !== null) {
      setBubblePose(null);
      return;
    }

    const pose = greetingLocked ? GREETING_GIF : idlePose;
    setBubblePose(null);
    const id = window.setTimeout(() => {
      setBubblePose(pose);
    }, IDLE_BUBBLE_DELAY_MS);

    return () => window.clearTimeout(id);
  }, [activeQuestion, greetingLocked, idlePose]);

  const bubbleText =
    question?.answer ??
    (bubblePose === gifSrc ? (POSE_PHRASES[gifSrc] ?? null) : null);
  const gifFallback = IDLE_GIF_FALLBACK;

  const bubbleKey = useMemo(() => gifSrc, [gifSrc]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      data-cursor-idle
      className="chat-easter-modal fixed left-0 top-0 z-[100] flex h-[300px] w-[500px] select-none flex-col overflow-hidden border border-black bg-white shadow-none"
    >
      <div className="relative flex h-8 shrink-0 items-center bg-black px-2.5">
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="关闭聊天"
          className="relative z-10 h-3.5 w-3.5 shrink-0 rounded-full bg-white shadow-none"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={onClose}
        />
        <p className="pointer-events-nonen absolute -translate-x-[66px] inset-0 flex items-center justify-center font-creato-black text-[11px] tracking-[0.03em] text-white">
          CARRIE YANG
        </p>
        <div className="relative z-10 ml-auto flex items-center gap-24">
          <ThemeToggle />
          <a
            href="mailto:woshiyangjiali@gmail.com"
            className="font-creato-black text-[11px] tracking-[0.03em] text-white"
            onPointerDown={(event) => event.stopPropagation()}
          >
            EMAIL ME
          </a>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="relative flex min-h-0 min-w-0 flex-[2] items-end bg-white px-3 pb-2 pt-3">
          <div className="relative flex h-[170px] w-[70%] translate-x-[10px] translate-y-[-20px] flex-col items-center justify-end contain-paint isolation-auto">
            <CharacterGif src={gifSrc} fallback={gifFallback} />
          </div>
          <AnimatePresence>
            {bubbleText ? (
              <motion.div
                key={bubbleKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0 } }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-[10rem] leading-[13px] left-[25px] z-10 max-w-[40%] translate-x-[150px] translate-y-[0px] rounded-md bg-[#e8e8e8] px-3 py-2 font-creato-medium text-[12px] leading-snug text-black"
              >
                {bubbleText}
                <span className="absolute -left-1.5 bottom-3 h-3 w-3 rotate-45 bg-[#e8e8e8]" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="flex w-[32%] shrink-0 flex-col border-l border-black">
          {QUESTIONS.map((item) => {
            const tone =
              item.tone === "mid"
                ? "bg-[#8d8d8d] text-black hover:bg-[#7c7c7c]"
                : item.tone === "light"
                  ? "bg-[#cfcfcf] text-black hover:bg-[#c0c0c0]"
                  : "bg-white text-black hover:bg-[#f2f2f2]";
            const active = activeQuestion === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => {
                  setGreetingDone(true);
                  setActiveQuestion(item.id);
                }}
                className={`flex flex-1 items-center justify-center border-t border-black px-2 text-center font-creato-black text-[10px] leading-tight tracking-[0.04em] shadow-none first:border-t-0 ${tone} ${
                  active ? "underline" : ""
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
