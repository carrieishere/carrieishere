"use client";

import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TATA_DIR = "/assets/items/laptop/project/tata-other-shoots";
const TATA_ICON = "/assets/items/laptop/desktopIcons/tata-seasonal-campaigns.webp";

const TATA_BIO =
  "Seasonal campaign shoots for TATA's 2025 FW / 2026 SS collections, produced in collaboration with BlackXlab and TATA's in-house team. The resulting visuals were adapted for in-store displays nationwide.";

function boardSrc(file: string) {
  return `${TATA_DIR}/${file}`;
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

export default function TataOtherShoots() {
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
                Seasonal Campaigns
              </p>
            </div>
          </div>
          <p>
            {TATA_BIO}
          </p>
          <span>2024-2026</span>
          <span>
            Visual Planning & Design Support
          </span>
        </header>

        <div className="mt-2 flex flex-col gap-6">
          <BoardCarousel
            label="tata-other-shoots board 1"
            aspectClass="aspect-[1620/1087]"
            files={["board1-1.webp", "board1-2.webp"]}
          />
          <BoardCarousel
            label="tata-other-shoots board 2"
            aspectClass="aspect-[1620/1974]"
            files={["board2-1.webp", "board2-2.webp", "board2-3.webp", "board2-4.webp"]}
          />
          <BoardCarousel
            label="tata-other-shoots board 3"
            aspectClass="aspect-[1620/1076]"
            files={["board3-1.webp", "board3-2.webp"]}
          />
          <BoardCarousel
            label="tata-other-shoots board 4"
            aspectClass="aspect-[1620/1974]"
            files={["board4-1.webp", "board4-2.webp", "board4-3.webp"]}
          />
        </div>
      </div>
    </div>
  );
}
