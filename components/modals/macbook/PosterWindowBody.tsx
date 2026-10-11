"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { AutoplayVideo } from "@/components/AutoplayVideo";
import {
  MOTION_SECTION_ITEMS,
  POSTER_ITEMS,
  POSTER_SECTION_ITEMS,
  type PosterItem,
} from "@/lib/posterItems";

function ThumbGrid({
  items,
  onSelect,
}: {
  items: PosterItem[];
  onSelect: (item: PosterItem) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-label={item.id}
          className="cursor-pointer overflow-hidden transition-transform duration-200 hover:scale-[1.04]"
          onClick={() => onSelect(item)}
        >
          <img
            src={item.thumb}
            alt=""
            draggable={false}
            loading="lazy"
            className="block h-auto w-full"
          />
        </button>
      ))}
    </div>
  );
}

function DetailMedia({ item }: { item: PosterItem }) {
  if (item.type === "video") {
    return (
      <AutoplayVideo
        src={item.src}
        poster={item.thumb}
        className="max-h-full max-w-full object-contain"
      />
    );
  }

  return (
    <img
      key={item.src}
      src={item.src}
      alt=""
      draggable={false}
      className="max-h-full max-w-full object-contain"
    />
  );
}

export default function PosterWindowBody() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const last = POSTER_ITEMS.length - 1;

  const openItem = useCallback((item: PosterItem) => {
    setSelectedIndex(POSTER_ITEMS.findIndex((entry) => entry.id === item.id));
  }, []);

  const goPrev = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null) return current;
      return current === 0 ? last : current - 1;
    });
  }, [last]);

  const goNext = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null) return current;
      return current === last ? 0 : current + 1;
    });
  }, [last]);

  const isDetail = selectedIndex !== null;

  useEffect(() => {
    if (!isDetail) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      if (event.key === "ArrowLeft") goPrev();
      else goNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDetail, goPrev, goNext]);

  if (selectedIndex !== null) {
    const item = POSTER_ITEMS[selectedIndex];

    return (
      <div className="flex h-full min-w-[480px] w-full flex-col overflow-hidden bg-white">
        <div className="relative flex h-11 shrink-0 items-center px-4">
          <button
            type="button"
            aria-label="Back to poster grid"
            className="relative z-10 flex h-8 w-8 items-center justify-center text-gray-500"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => setSelectedIndex(null)}
          >
            <ChevronLeft size={18} />
          </button>
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10px] leading-[10px] text-gray-500">
            2021-2026 Selected Poster Designs
          </p>
          <span
            className="relative z-10 ml-auto flex h-8 w-8 items-center justify-center text-gray-400"
            aria-hidden
          >
            <Info size={16} strokeWidth={1.6} />
          </span>
        </div>

        <div className="relative min-h-0 flex-1 px-10 pb-6">
          <div className="flex h-full w-full items-center justify-center">
            <DetailMedia item={item} />
          </div>

          <button
            type="button"
            aria-label="Previous poster"
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black shadow-sm"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={goPrev}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next poster"
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black shadow-sm"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={goNext}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-w-[480px] w-full overflow-x-hidden overflow-y-auto bg-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-col gap-8 px-6 pb-8 pt-5">
        <section className="flex flex-col gap-4">
          <h2 className="font-creato-bold text-[22px] leading-tight text-black">
            Poster
          </h2>
          <ThumbGrid items={POSTER_SECTION_ITEMS} onSelect={openItem} />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-creato-bold text-[22px] leading-tight text-black">
            Motion Graphics
          </h2>
          <ThumbGrid items={MOTION_SECTION_ITEMS} onSelect={openItem} />
        </section>
      </div>
    </div>
  );
}
