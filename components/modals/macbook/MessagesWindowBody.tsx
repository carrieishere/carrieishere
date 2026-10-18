"use client";

import { useEffect, useRef, useState } from "react";
import { IMESSAGE_THREADS, type ChatThread } from "@/lib/imessageThreads";

function PersonAvatar({ emoji }: { emoji?: string }) {
  return (
    <div
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#969ba5]"
    >
      {emoji ? (
        <span className="text-[22px] leading-none" aria-hidden>
          {emoji}
        </span>
      ) : (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden>
        <circle cx="12" cy="8.2" r="3.4" />
        <path d="M5.2 19.2c.6-3.6 3.4-5.4 6.8-5.4s6.2 1.8 6.8 5.4c.1.5-.3 1-1 1H6.2c-.7 0-1.1-.5-1-1z" />
      </svg>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-[#8e8e93]" aria-hidden>
      <circle cx="7" cy="7" r="4.2" strokeWidth="1.4" />
      <path d="M10.2 10.2L13.2 13.2" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 18 18" className="h-4 w-4 fill-none stroke-[#c7c7cc]" aria-hidden>
      <circle cx="9" cy="9" r="7" strokeWidth="1.5" />
      <path d="M9 8.2v4.2" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="5.6" r=".8" fill="#c7c7cc" stroke="none" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 16 18" className="h-4 w-3.5 fill-none stroke-[#8e8e93]" aria-hidden>
      <rect x="5" y="1.4" width="6" height="9.2" rx="3" strokeWidth="1.4" />
      <path d="M3.2 8.6a4.8 4.8 0 0 0 9.6 0M8 13.4v3" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function EmojiIcon() {
  return (
    <svg viewBox="0 0 18 18" className="h-4 w-4 fill-none stroke-[#8e8e93]" aria-hidden>
      <circle cx="9" cy="9" r="7" strokeWidth="1.4" />
      <path d="M6.2 11c.8 1.2 1.8 1.8 2.8 1.8s2-.6 2.8-1.8" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="6.6" cy="7.4" r=".9" fill="#8e8e93" stroke="none" />
      <circle cx="11.4" cy="7.4" r=".9" fill="#8e8e93" stroke="none" />
    </svg>
  );
}

function PhotoPlaceholder() {
  return (
    <div className="flex h-[118px] w-[168px] items-center justify-center rounded-[18px] bg-[#d8d8dc]">
      <svg viewBox="0 0 28 22" className="h-8 w-10 fill-[#a1a1a6]" aria-hidden>
        <rect x="1" y="3" width="26" height="18" rx="3" />
        <circle cx="9" cy="10" r="2.4" className="fill-[#d8d8dc]" />
        <path d="M4 19l7.2-7.4 4.2 4.2L19.6 11 24 19H4z" className="fill-[#d8d8dc]" />
      </svg>
    </div>
  );
}

/** 文件名带 -sm 的图更窄，例如 penny1-sm.webp；不带则保持现在的 50%。 */
function imageMaxWidthClass(src: string) {
  return /-sm\.(webp|png|jpe?g|gif)$/i.test(src) ? "max-w-[32%]" : "max-w-[50%]";
}

function bubbleRadius(from: "me" | "them", stacked: boolean) {
  if (from === "me") {
    return stacked ? "rounded-[18px] rounded-br-[4px]" : "rounded-[18px]";
  }
  return stacked ? "rounded-[18px] rounded-bl-[4px]" : "rounded-[18px]";
}

function ThreadMessages({ thread }: { thread: ChatThread }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [thread.id]);

  return (
    <div
      ref={scrollerRef}
      className="min-h-0 flex-1 overflow-y-auto px-5 pt-6 pb-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex flex-col gap-[3px]">
        {thread.messages.map((item, index) => {
          if (item.type === "timestamp") {
            return (
              <p
                key={item.id}
                className="font-creato-regular py-3 text-center text-[11px] tracking-wide text-[#8e8e93]"
                style={{ fontFamily: "var(--font-creato-medium), sans-serif" }}
              >
                {item.text}
              </p>
            );
          }

          const prev = thread.messages[index - 1];
          const next = thread.messages[index + 1];
          const stackedWithPrev =
            prev && prev.type !== "timestamp" && prev.from === item.from;
          const stackedWithNext =
            next && next.type !== "timestamp" && next.from === item.from;
          const isMe = item.from === "me";

          return (
            <div
              key={item.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"} ${
                stackedWithPrev ? "mt-0" : "mt-1.5"
              }`}
            >
              {item.type === "image" ? (
                item.src ? (
                  <img
                    src={item.src}
                    alt=""
                    draggable={false}
                    className={`pointer-events-none block h-auto ${imageMaxWidthClass(
                      item.src,
                    )} select-none ${bubbleRadius(
                      item.from,
                      stackedWithNext,
                    )}`}
                  />
                ) : (
                  <PhotoPlaceholder />
                )
              ) : (
                <p
                  className={`font-creato-medium max-w-[68%] px-[13px] py-[7px] text-[14px] leading-[1.28] ${bubbleRadius(
                    item.from,
                    stackedWithNext,
                  )} ${
                    isMe ? "bg-[#007aff] text-white" : "bg-[#e9e9eb] text-black"
                  }`}
                  style={{ fontFamily: "var(--font-creato-medium), sans-serif" }}
                >
                  {item.text}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MessagesWindowBody() {
  const [activeId, setActiveId] = useState(IMESSAGE_THREADS[0].id);
  const active = IMESSAGE_THREADS.find((thread) => thread.id === activeId) ?? IMESSAGE_THREADS[0];

  return (
    <div className="flex h-full min-h-0">
      <aside className="flex w-[30%] min-w-[220px] flex-col border-r border-black/10 bg-[#e1e2e1]">
        <div className="flex items-center gap-2 px-3 pb-2 pt-3">
          <div className="flex h-7 flex-1 items-center gap-1.5 rounded-md bg-black/[0.06] px-2">
            <SearchIcon />
            <span
              className="font-creato-regular text-[12px] text-[#8e8e93]"
              style={{ fontFamily: "var(--font-creato-medium), sans-serif" }}
            >
              Search
            </span>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {IMESSAGE_THREADS.map((thread) => {
            const selected = thread.id === active.id;

            return (
              <button
                key={thread.id}
                type="button"
                onClick={() => setActiveId(thread.id)}
                className={`flex w-full items-center gap-2.5 border-b border-black/[0.06] px-3 py-2.5 text-left ${
                  selected ? "bg-[#0a84ff]" : "hover:bg-black/[0.04]"
                }`}
              >
                <PersonAvatar emoji={thread.avatar} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span
                      className={`font-creato-bold truncate text-[13px] ${
                        selected ? "text-white" : "text-black"
                      }`}
                      style={{ fontFamily: "var(--font-creato-bold), sans-serif" }}
                    >
                      {thread.name}
                    </span>
                    <span
                      className={`font-creato-regular shrink-0 text-[11px] ${
                        selected ? "text-white/80" : "text-[#8e8e93]"
                      }`}
                      style={{ fontFamily: "var(--font-creato-medium), sans-serif" }}
                    >
                      {thread.time}
                    </span>
                  </span>
                  <span
                    className={`font-creato-regular mt-0.5 block truncate text-[12px] ${
                      selected ? "text-white/85" : "text-[#6d6d72]"
                    }`}
                    style={{ fontFamily: "var(--font-creato-medium), sans-serif" }}
                  >
                    {thread.preview}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col bg-white">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-black/[0.06] px-4">
          <p
            className="font-creato-regular text-[13px] text-[#3a3a3c]"
            style={{ fontFamily: "var(--font-creato-medium), sans-serif" }}
          >
            To: <span className="font-creato-medium text-black">{active.name}</span>
          </p>
          <InfoIcon />
        </header>

        <ThreadMessages key={active.id} thread={active} />

        <div className="shrink-0 px-4 pb-3 pt-1">
          <div className="flex h-9 items-center rounded-full border border-[#d2d2d7] bg-white px-3">
            <input
              disabled
              readOnly
              placeholder="Sorry, you do not have permission."
              className="font-creato-regular min-w-0 flex-1 bg-transparent text-[13px] text-[#8e8e93] outline-none placeholder:text-[#8e8e93] disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-creato-medium), sans-serif" }}
            />
            <span className="ml-2 flex items-center gap-2">
              <MicIcon />
              <EmojiIcon />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
