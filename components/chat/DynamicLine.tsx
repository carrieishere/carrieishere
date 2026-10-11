"use client";

import { motion } from "framer-motion";
import type { DynamicLinePoints } from "@/hooks/useDynamicLine";

export function DynamicLine({ x1, y1, x2, y2 }: DynamicLinePoints) {
  return (
    <svg
      className="chat-tether pointer-events-none fixed inset-0 z-[110] h-screen w-screen overflow-visible"
      aria-hidden
    >
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
