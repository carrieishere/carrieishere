"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NOTEBOOK_PAGE_COUNT } from "@/types";

interface NotebookModalProps {
  page: number;
  onPageChange: (page: number) => void;
  onClose: () => void;
}

const PAGE_ASPECT = 1403 / 1135;
const CAPTION_PHRASES = [
  "Still carry it everywhere. Mostly old thoughts, though.",
  "I also jot down philosophy quotes sometimes. You?",
] as const;
const CAPTION_MS = 8000;
const CAPTION_GAP_MS = 400;
const CAPTION_DELAY_MS = 800;

function pageSrc(page: number) {
  return `/assets/items/notebook/page${page}.webp`;
}

export function NotebookModal({ page, onPageChange, onClose }: NotebookModalProps) {
  const currentPage = Math.min(NOTEBOOK_PAGE_COUNT, Math.max(1, page));
  const canPrev = currentPage > 1;
  const canNext = currentPage < NOTEBOOK_PAGE_COUNT;
  const [caption, setCaption] = useState<string | null>(null);

  const goPrev = useCallback(() => {
    if (!canPrev) return;
    onPageChange(currentPage - 1);
  }, [canPrev, onPageChange, currentPage]);

  const goNext = useCallback(() => {
    if (!canNext) return;
    onPageChange(currentPage + 1);
  }, [canNext, onPageChange, currentPage]);

  useEffect(() => {
    const neighbors = [currentPage - 1, currentPage + 1].filter(
      (p) => p >= 1 && p <= NOTEBOOK_PAGE_COUNT,
    );
    const loaders = neighbors.map((p) => {
      const img = new window.Image();
      img.src = pageSrc(p);
      return img;
    });
    return () => {
      loaders.forEach((img) => {
        img.src = "";
      });
    };
  }, [currentPage]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, onClose]);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    const steps: Array<{ delay: number; caption: string | null }> = [
      { delay: CAPTION_DELAY_MS, caption: CAPTION_PHRASES[0] },
      { delay: CAPTION_MS, caption: null },
      { delay: CAPTION_GAP_MS, caption: CAPTION_PHRASES[1] },
      { delay: CAPTION_MS, caption: null },
    ];
    let index = 0;

    const run = () => {
      if (cancelled || index >= steps.length) return;
      const step = steps[index];
      index += 1;
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setCaption(step.caption);
        run();
      }, step.delay);
    };

    setCaption(null);
    run();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-white/40"
      data-cursor-ignore
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(15px)",
      }}
      onClick={onClose}
    >
      <motion.div
        className="relative"
        style={{
          width: `min(78vw, calc(82vh * ${PAGE_ASPECT}))`,
          aspectRatio: `${PAGE_ASPECT}`,
        }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={pageSrc(currentPage)}
          alt={`画册第 ${currentPage} 页`}
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-contain"
        />

        <AnimatePresence mode="wait">
          {caption ? (
            <motion.div
              key={caption}
              className="notebook-caption font-creato-medium text-[14px] leading-snug text-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {caption}
              <span aria-hidden className="notebook-caption-tail" />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {canPrev ? (
          <button
            type="button"
            aria-label="上一页"
            className="absolute inset-y-0 left-0 z-10 w-1/2"
            onClick={goPrev}
          />
        ) : null}

        {canNext ? (
          <button
            type="button"
            aria-label="下一页"
            className="absolute inset-y-0 right-0 z-10 w-1/2"
            onClick={goNext}
          />
        ) : null}
      </motion.div>
    </motion.div>
  );
}
