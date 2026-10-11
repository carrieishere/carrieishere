"use client";

import { useEffect, useRef, useState } from "react";
import { useChatEasterEgg } from "@/components/chat/ChatEasterEggProvider";
import { TitleHoverBubble } from "@/components/ItemHoverHint";
import { useScrambleText } from "@/hooks/useScrambleText";

const IDLE_TITLE = "(CARRIE .IS .HERE)";
const IDLE_TITLE_BEFORE_DOT = "(CARRIE ";
const IDLE_TITLE_AFTER_DOT = "IS .HERE)";
const HOVER_TITLE = "(CAN .YOU .FIND .ME?)";
const IDLE_LOCATION = "( 22.5431° N, 114.0579° E";
const HOVER_LOCATION = "BASED IN SHENZHEN CHINA";
const SCRAMBLE_IN_MS = 100;
const SCRAMBLE_OUT_MS = 100;

function JustifiedLine({ text }: { text: string }) {
  return (
    <p className="flex w-full justify-between whitespace-nowrap">
      {text.split(" ").map((word, index) => (
        <span key={index}>{word}</span>
      ))}
    </p>
  );
}

function formatChinaClock(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const hour = get("hour").padStart(2, "0");
  const minute = get("minute").padStart(2, "0");
  const second = get("second").padStart(2, "0");
  return `${get("year")} ${hour}:${minute}:${second}`;
}

function ChinaClock() {
  const [clock, setClock] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setClock(formatChinaClock(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p
      className="home-meta justify-self-end whitespace-nowrap font-creato-black text-[0.9cqw] leading-none tabular-nums tracking-tight text-[#4a4a4a]"
      suppressHydrationWarning
    >
      {clock ? ` : ${clock} )` : "( : ——— ——:——:—— )"}
    </p>
  );
}

function LocationScramble() {
  const { text, playScramble } = useScrambleText(IDLE_LOCATION);

  return (
    <p
      className="home-meta pointer-events-auto justify-self-start cursor-default font-creato-black text-[0.9cqw] leading-none tracking-tight text-[#4a4a4a]"
      onPointerEnter={() => playScramble(HOVER_LOCATION, SCRAMBLE_IN_MS)}
      onPointerLeave={() => playScramble(IDLE_LOCATION, SCRAMBLE_OUT_MS)}
    >
      <span className="relative inline-grid justify-items-start">
        <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden>
          {IDLE_LOCATION}
        </span>
        <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden>
          {HOVER_LOCATION}
        </span>
        <span className="col-start-1 row-start-1 whitespace-nowrap tabular-nums">
          {text}
        </span>
      </span>
    </p>
  );
}

/**
 * 16:10 舞台顶栏：左驻地、中主标题、右中国时区时钟。
 */
export function Header() {
  const { text: title, playScramble } = useScrambleText(IDLE_TITLE);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const skipHoverRef = useRef(false);
  const chat = useChatEasterEgg();
  const toggleChat = chat?.toggleChat;

  useEffect(() => {
    const onEnter = () => {
      if (skipHoverRef.current) return;
      playScramble(HOVER_TITLE, SCRAMBLE_IN_MS);
    };

    const onLeave = () => {
      skipHoverRef.current = false;
      playScramble(IDLE_TITLE, SCRAMBLE_OUT_MS);
    };

    const onClick = () => {
      skipHoverRef.current = true;
      playScramble(IDLE_TITLE, SCRAMBLE_OUT_MS);
      toggleChat?.();
    };

    const node = headingRef.current;
    if (!node) return;

    node.addEventListener("pointerenter", onEnter);
    node.addEventListener("pointerleave", onLeave);
    node.addEventListener("click", onClick);

    return () => {
      node.removeEventListener("pointerenter", onEnter);
      node.removeEventListener("pointerleave", onLeave);
      node.removeEventListener("click", onClick);
    };
  }, [playScramble, toggleChat]);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-[3.4%] pt-[3.6%] text-black">
      <LocationScramble />

      <div className="flex flex-col items-center text-center">
        <p className="home-kicker font-creato-black text-[0.7cqw] leading-[1] tracking-[0.02em] text-[#4a4a4a]">
          CARRIE YANG
          <br />
          DESIGNER/ART DIRECTOR
        </p>
        <div className="mt-[0.35cqw] flex w-max flex-col items-center">
          <h1
            ref={headingRef}
            className="home-title relative pointer-events-auto cursor-pointer whitespace-nowrap font-creato-black text-[3cqw] leading-[0.92] tracking-[-0.032em] text-black"
          >
            <span className="invisible" aria-hidden>
              {IDLE_TITLE_BEFORE_DOT}
              <span ref={chat?.anchorRef} className="inline-block">
                .
              </span>
              {IDLE_TITLE_AFTER_DOT}
            </span>
            <span className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap">
              {title}
            </span>
            <TitleHoverBubble />
          </h1>
          <div className="home-blurb mt-[0.6cqw] w-[96%] font-creato-black text-[0.7cqw] leading-[1] tracking-[0.02em] text-[#4a4a4a]">
            <JustifiedLine text="SOME THINGS I LIKE, SOME THINGS I MAKE, AND SOME THINGS" />
            <JustifiedLine text="THAT JUST HAPPENED TO END UP HERE. CONSIDER THIS A LITTLE" />
            <p className="text-center whitespace-nowrap">LOOK INTO MY OWN LITTLE WORLD.</p>
          </div>
        </div>
      </div>

      <ChinaClock />
    </header>
  );
}
