"use client";

import { memo, useCallback, useState } from "react";

type NoteTab = "about" | "notes";

const NOTE_TABS: readonly { id: NoteTab; label: string; count: string }[] = [
  { id: "about", label: "About me", count: "1" },
  { id: "notes", label: "Notes", count: "1" },
];

const SKILLS = [
  "Brand Design & Visual Identity",
  "Creative Direction",
  "Campaign & Event Key Visuals",
  "Packaging Design",
  "Logotypes",
  "Type Design",
  "Illustration",
  "Graphic/Motion Poster",
  "Social Media Content",
  "Event Materials",
  "Website Design",
  "Vibe Coding",
] as const;

const FIGURING_OUT = ["English", "Social Media", "Promotion"] as const;

function CheckBadge() {
  return (
    <span className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-[#3b81f7]">
      <svg viewBox="0 0 12 12" className="h-[10px] w-[10px]" aria-hidden>
        <path
          d="M2.1 6.2 4.8 8.8 9.9 3.3"
          fill="none"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function EmptyCircle() {
  return (
    <span
      className="box-border h-[18px] w-[18px] shrink-0 rounded-full border-[1.8px] border-[#3b81f7]"
      aria-hidden
    />
  );
}

function Highlight({ children }: { children: string }) {
  return (
    <mark className="bg-[#fffe9a] text-inherit" style={{ color: "inherit" }}>
      {children}
    </mark>
  );
}

const AboutMeBody = memo(function AboutMeBody() {
  return (
    <div
      className="font-creato-medium text-[15px] leading-[1.48] text-black"
      style={{ fontFamily: "var(--font-creato-medium), sans-serif" }}
    >
      <p className="mb-3 text-[12px] text-[#8e8e93]">October 20, 2026</p>
      <div className="space-y-[1.05em]">
      <p>
        Hi, this is Carrie Yang, a <Highlight>Graphic Designer and Art Director</Highlight>,
        mostly working in-house on brand design, visual identity, and creative
        projects.
      </p>
      <p>
        I&apos;ve been doing this for <Highlight>five years now</Highlight> — 60
        months, to be exact. Somewhere along the way, I started thinking
        differently about the usual way of working and where I want to take my
        own path next. I still love the work, the ideas, and the process of
        turning thoughts into something people can actually see.
      </p>
      <p>
        I&apos;m writing this on October 20, 2026 — also my birthday, which
        feels like a fitting day to start this new chapter, even if it means
        leaving a part of it behind. For now, I&apos;m taking some time to
        figure things out, while working independently. If you have
        a project in mind, feel free to get in touch.
      </p>
      <div className="pt-2">
        <p className="mb-3">Things I can do</p>
        <ul className="space-y-[7px]">
          {SKILLS.map((skill) => (
            <li key={skill} className="flex items-center gap-2.5">
              <CheckBadge />
              <span>{skill}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mb-3">Currently figuring out</p>
        <ul className="space-y-[7px]">
          {FIGURING_OUT.map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <EmptyCircle />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </div>
  );
});

const NotesBody = memo(function NotesBody() {
  return (
    <div
      className="font-creato-medium text-[15px] leading-[1.48] text-black"
      style={{ fontFamily: "var(--font-creato-medium), sans-serif" }}
    >
      <p className="mb-3 text-[12px] text-[#8e8e93]">October 20, 2026</p>
      <div className="space-y-[1.05em]">
        <p>
          I&apos;m from China and currently{" "}
          based in Shenzhen<Highlight>(open to remote collaborations)</Highlight>. Most of my work so far has
          been with brands across women&apos;s fashion, jewelry, contact lenses,
          and footwear. I&apos;m also drawn to technology and unconventional
          creative brands. To me, visual design is a way of communicating what a
          brand values, how it wants to be seen, and what it has to say.
        </p>
        <p>
          Over the past year, I&apos;ve also spent some time exploring a
          women&apos;s care brand with a friend. It was still in the early
          stages, but it gave me a chance to think about a brand from a
          different starting point.
        </p>
        <p>
          <Highlight>One More Thing:</Highlight> I built this website
          independently using vibe coding, from the initial concept and design
          to the interactions and final implementation. All projects featured
          here are based on my actual work and experience. If you&apos;d like to
          use or reference anything here, I&apos;d really appreciate you getting
          in touch first. Thanks, and have a lovely day~
        </p>
      </div>
    </div>
  );
});

export const NotesWindowBody = memo(function NotesWindowBody() {
  const [activeTab, setActiveTab] = useState<NoteTab>("about");

  const onSelect = useCallback((id: NoteTab) => {
    setActiveTab(id);
  }, []);

  return (
    <div className="flex h-full min-h-0">
      <aside className="flex w-[180px] shrink-0 flex-col bg-[#e8e8ed]">
        {NOTE_TABS.map((tab) => {
          const selected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelect(tab.id)}
              className={`flex w-full items-center justify-between px-4 py-[9px] text-left ${
                selected
                  ? "bg-[#3b81f7] text-white"
                  : "bg-transparent text-black hover:bg-black/[0.05]"
              }`}
            >
              <span
                className="font-creato-bold truncate text-[13px]"
                style={{ fontFamily: "var(--font-creato-bold), sans-serif" }}
              >
                {tab.label}
              </span>
              <span
                className={`font-creato-bold shrink-0 text-[13px] ${
                  selected ? "text-white/70" : "text-[#8e8e93]"
                }`}
                style={{ fontFamily: "var(--font-creato-bold), sans-serif" }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
        <div className="mx-3 border-b border-black/15" />
      </aside>

      <section
        className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-white px-7 py-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {activeTab === "about" ? <AboutMeBody /> : <NotesBody />}
      </section>
    </div>
  );
});

export default NotesWindowBody;
