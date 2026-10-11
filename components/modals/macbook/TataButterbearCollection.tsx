"use client";

import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TATA_DIR = "/assets/items/laptop/project/tata-butterbear-collection-2";
const TATA_ICON =
  "/assets/items/laptop/desktopIcons/tata-butterbear-collaction-2.webp";

const TATA_BIO =
  'TATA\'s 99 collaboration with the popular Thai IP Butterbear featured a pop-up store in Beijing and themed displays across hundreds of TATA stores nationwide. The project blended the original IP with TATA\'s visual language, built around "idol, energy, and sparkle."';

const STATIC_BOARDS = [
  "board1.webp",
  "board2.webp",
  "board3.webp",
  "board4.webp",
  "board5.webp",
  "board6.webp",
  "board7.webp",
  "board8.webp",
  "board9.webp",
] as const;

const CAROUSEL_BOARDS = [
  "board10-1.webp",
  "board10-2.webp",
  "board10-3.webp",
  "board10-4.webp",
] as const;

function boardSrc(file: string) {
  return `${TATA_DIR}/${file}`;
}

function BoardImage({ file }: { file: string }) {
  return (
    <img
      src={boardSrc(file)}
      alt=""
      draggable={false}
      loading="lazy"
      className="block h-auto w-full"
    />
  );
}

function BoardCarousel({
  files,
  aspectClass,
  label,
}: {
  files: readonly string[];
  aspectClass: string;
  label: string;
}) {
  const [index, setIndex] = useState(0);
  const last = files.length - 1;

  const goPrev = useCallback(() => {
    setIndex((current) => (current === 0 ? last : current - 1));
  }, [last]);

  const goNext = useCallback(() => {
    setIndex((current) => (current === last ? 0 : current + 1));
  }, [last]);

  return (
    <div className={`relative w-full overflow-hidden ${aspectClass}`}>
      {files.map((file, itemIndex) => (
        <img
          key={file}
          src={boardSrc(file)}
          alt=""
          draggable={false}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
            itemIndex === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
      ))}

      <button
        type="button"
        aria-label={`${label} previous`}
        className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black shadow-sm"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={goPrev}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        aria-label={`${label} next`}
        className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black shadow-sm"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={goNext}
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {files.map((file, itemIndex) => (
          <button
            key={file}
            type="button"
            aria-label={`${label} slide ${itemIndex + 1}`}
            className={`h-1.5 rounded-full ${
              itemIndex === index ? "w-4 bg-black" : "w-1.5 bg-black/30"
            }`}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => setIndex(itemIndex)}
          />
        ))}
      </div>
    </div>
  );
}

export default function TataButterbearCollection() {
  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-auto bg-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-col px-6 pb-8 pt-5">
        <header className="grid grid-cols-[minmax(0,1fr)_minmax(0,280px)] items-start gap-x-2 gap-y-4 text-[10px] leading-[10px] text-gray-500">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={TATA_ICON}
              alt=""
              draggable={false}
              loading="lazy"
              className="h-11 w-11 shrink-0 rounded-md object-cover"
            />
            <div className="min-w-0">
              <p className="font-creato-bold text-[16px] leading-tight text-black">
                TATA
              </p>
              <p className="mt-0.5 text-[10.5px] leading-tight text-gray-500">
                Butterbear Collection-2
              </p>
            </div>
          </div>
          <p>
            {TATA_BIO}
          </p>
          <span>2024-2026</span>
          <span>
            Key Visual Design
          </span>
        </header>

        <div className="mt-2 flex flex-col gap-6">
          {STATIC_BOARDS.map((file) => (
            <BoardImage key={file} file={file} />
          ))}
          <BoardCarousel
            label="tata-butterbear-collection-2 board 10"
            aspectClass="aspect-[1620/2278]"
            files={CAROUSEL_BOARDS}
          />
          <footer className="flex justify-between gap-6 text-[10px] leading-[10px] text-gray-500">
            <p>
              Key Visual: Carrie Yang
              <br />
              IP Exploration: Carrie Yang
              <br />
              Photography: TATA & Sixsix Studio
            </p>
            <p>
              Illustration: Sixsix Studio
              <br />
              Visual Extension: TATA In-house
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
