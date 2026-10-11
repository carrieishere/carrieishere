"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import {
  INTEREST_PHOTOS,
  PHOTO_ALBUMS,
  PHOTOS,
  WORKING_PHOTOS,
  type Photo,
} from "@/lib/photos";

function albumTitle(albumId: Photo["album"]) {
  return PHOTO_ALBUMS.find((album) => album.id === albumId)?.label ?? "";
}

function ThumbGrid({
  items,
  onSelect,
}: {
  items: Photo[];
  onSelect: (item: Photo) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {items.map((item) => (
        <button
          key={item.index}
          type="button"
          aria-label={`Photo ${item.index + 1}`}
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

export default function PhotosWindowBody() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const last = PHOTOS.length - 1;

  const openItem = useCallback((item: Photo) => {
    setSelectedIndex(item.index);
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
    const item = PHOTOS[selectedIndex];

    return (
      <div className="flex h-full min-w-[480px] w-full flex-col overflow-hidden bg-white">
        <div className="relative flex h-11 shrink-0 items-center px-4">
          <button
            type="button"
            aria-label="Back to photo grid"
            className="relative z-10 flex h-8 w-8 items-center justify-center text-gray-500"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => setSelectedIndex(null)}
          >
            <ChevronLeft size={18} />
          </button>
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10px] leading-[10px] text-gray-500">
            {albumTitle(item.album)}
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
            <img
              key={item.original}
              src={item.original}
              alt=""
              draggable={false}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <button
            type="button"
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black shadow-sm"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={goPrev}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next photo"
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
            {albumTitle("interests")}
          </h2>
          <ThumbGrid items={INTEREST_PHOTOS} onSelect={openItem} />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-creato-bold text-[22px] leading-tight text-black">
            {albumTitle("working")}
          </h2>
          <ThumbGrid items={WORKING_PHOTOS} onSelect={openItem} />
        </section>
      </div>
    </div>
  );
}
