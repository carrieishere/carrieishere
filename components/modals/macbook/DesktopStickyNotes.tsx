"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { motion } from "framer-motion";

const STICKY_WIDTH = "23%";
const STICKY_LEFT = "1.2%";

const STICKY_INK = "#222222";
const STICKY_INK_DONE = "#555555";
const STICKY_INK_BC = "#000000";
const STICKY_URGENT = "#E84B94";
const STICKY_A_BG = "#F4F19C";
const STICKY_B_BG = "rgba(122, 154, 166, 0.6)";
const STICKY_C_BG = "rgba(176, 164, 92, 0.6)";

type StickyLine = {
  text: string;
  struck?: boolean;
};

type StickyBlock =
  | { kind: "heading"; text: string; color?: string; underline?: boolean }
  | { kind: "list"; items: readonly StickyLine[] };

type StickyNoteId = "a" | "b" | "c";

type StickyNote = {
  id: StickyNoteId;
  top: string;
  height: string;
  background: string;
  ink: string;
  date: string;
  blocks: readonly StickyBlock[];
};

const STICKY_NOTES: readonly StickyNote[] = [
  {
    id: "a",
    top: "8%",
    height: "28.4%",
    background: STICKY_A_BG,
    ink: STICKY_INK,
    date: "OCT.20",
    blocks: [
      { kind: "heading", text: "Urgent", color: STICKY_URGENT, underline: true },
      {
        kind: "list",
        items: [
          { text: "1. Revise the proposal" },
          { text: "2. Send to the boss by 6 PM" },
        ],
      },
      { kind: "heading", text: "Others", underline: true },
      {
        kind: "list",
        items: [
          { text: "1. Back up all my files" },
          { text: "2. Share poster with Lucas" },
          { text: "3. Copy the file for Jenifer" },
          { text: "4. Draft next month's brief" },
        ],
      },
    ],
  },
  {
    id: "b",
    top: "36%",
    height: "25%",
    background: STICKY_B_BG,
    ink: STICKY_INK_BC,
    date: "OCT.19",
    blocks: [
      {
        kind: "list",
        items: [
          { text: "1. Revise proposal (3rd draft)" },
          { text: "2. Send key visuals to Lucy", struck: true },
          { text: "3. Submit shoot expense form", struck: true },
          { text: "4. Finalize the poster layout", struck: true },
          { text: "5. Send Jessy the file", struck: true },
          { text: "6. Look in layout version 2", struck: true },
        ],
      },
    ],
  },
  {
    id: "c",
    top: "61%",
    height: "22%",
    background: STICKY_C_BG,
    ink: STICKY_INK_BC,
    date: "OCT.18",
    blocks: [
      {
        kind: "list",
        items: [
          { text: "1. Review the campaign draft", struck: true },
          { text: "2. Export poster files", struck: true },
          { text: "3. Ask Lucy about overtime", struck: true },
          { text: "4. Tidy up project folders", struck: true },
          { text: "5. Sync layout with Dustin", struck: true },
        ],
      },
    ],
  },
];

const INITIAL_ORDER: StickyNoteId[] = ["a", "b", "c"];

const REST_SHADOW = "0 6px 16px rgba(0, 0, 0, 0.22)";
const DRAG_SHADOW = "0 16px 32px rgba(0, 0, 0, 0.38)";

function canDragOnThisDevice() {
  return !window.matchMedia("(pointer: coarse)").matches;
}

function StickyNoteCard({
  note,
  zIndex,
  desktopRef,
  canDrag,
  onFront,
}: {
  note: StickyNote;
  zIndex: number;
  desktopRef: RefObject<HTMLDivElement | null>;
  canDrag: boolean;
  onFront: () => void;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });
  const [dragging, setDragging] = useState(false);

  const updateConstraints = useCallback(() => {
    const parent = desktopRef.current;
    const node = nodeRef.current;
    if (!parent || !node) return;

    setConstraints({
      left: -node.offsetLeft,
      right: parent.clientWidth - node.offsetLeft - node.offsetWidth,
      top: -node.offsetTop,
      bottom: parent.clientHeight - node.offsetTop - node.offsetHeight,
    });
  }, [desktopRef]);

  useLayoutEffect(() => {
    updateConstraints();
    const parent = desktopRef.current;
    if (!parent) return;
    const observer = new ResizeObserver(updateConstraints);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [updateConstraints]);

  const cardStyle: CSSProperties = {
    left: STICKY_LEFT,
    top: note.top,
    width: STICKY_WIDTH,
    height: note.height,
    zIndex,
    backgroundColor: note.background,
    boxShadow: dragging ? DRAG_SHADOW : REST_SHADOW,
    containerType: "size",
    fontSize: "1cqi",
  };

  return (
    <motion.div
      ref={nodeRef}
      drag={canDrag}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={constraints}
      whileDrag={canDrag ? { scale: 1.02 } : undefined}
      onPointerDown={onFront}
      onDragStart={() => {
        if (canDrag) setDragging(true);
      }}
      onDragEnd={() => setDragging(false)}
      className={`absolute overflow-hidden px-[3%] py-[3%] leading-[1.32] ${
        canDrag
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-default"
      } select-none`}
      style={cardStyle}
    >
      <p className="font-creato-bold text-[1.12em]" style={{ color: note.ink }}>
        {note.date}
      </p>
      {note.blocks.map((block, index) =>
        block.kind === "heading" ? (
          <p
            key={`${note.id}-h-${index}`}
            className={`font-creato-bold ${block.underline ? "underline" : ""}`}
            style={{ color: block.color ?? note.ink }}
          >
            {block.text}
          </p>
        ) : (
          <div key={`${note.id}-l-${index}`} className="font-creato-regular">
            {block.items.map((item) => (
              <p
                key={item.text}
                className={item.struck ? "line-through" : undefined}
                style={{
                  color:
                    item.struck && note.id === "a"
                      ? STICKY_INK_DONE
                      : note.ink,
                }}
              >
                {item.text}
              </p>
            ))}
          </div>
        ),
      )}
    </motion.div>
  );
}

export function DesktopStickyNotes({
  desktopRef,
}: {
  desktopRef: RefObject<HTMLDivElement | null>;
}) {
  const [order, setOrder] = useState<StickyNoteId[]>(INITIAL_ORDER);
  const [canDrag] = useState(canDragOnThisDevice);

  const bringToFront = useCallback((id: StickyNoteId) => {
    setOrder((prev) => {
      if (prev[prev.length - 1] === id) return prev;
      return [...prev.filter((item) => item !== id), id];
    });
  }, []);

  return (
    <>
      {STICKY_NOTES.map((note) => (
        <StickyNoteCard
          key={note.id}
          note={note}
          zIndex={1 + order.indexOf(note.id)}
          desktopRef={desktopRef}
          canDrag={canDrag}
          onFront={() => bringToFront(note.id)}
        />
      ))}
    </>
  );
}
