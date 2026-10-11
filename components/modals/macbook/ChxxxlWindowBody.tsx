"use client";

import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CHXXXL_DIR = "/assets/items/laptop/project/chxxxl";
const CHXXXL_ICON = "/assets/items/laptop/desktopIcons/Chxxxl.webp";

const CHXXXL_BIO =
  "Visual identity upgrade for Chxxxl, a fashion brand built around remodeling and deconstruction, destruction and rebirth. The work covers brand identity, packaging, lookbooks, and spatial graphics, using a high-contrast black-and-white system with graphic marks.";

function boardSrc(file: string) {
  return `${CHXXXL_DIR}/${file}`;
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
  files: string[];
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

export default function ChxxxlWindowBody() {
  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-auto bg-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-col px-6 pb-8 pt-5">
        <header className="grid grid-cols-[minmax(0,1fr)_minmax(0,280px)] items-start gap-x-2 gap-y-4 text-[10px] leading-[10px] text-gray-500">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={CHXXXL_ICON}
              alt=""
              draggable={false}
              loading="lazy"
              className="h-11 w-11 shrink-0 rounded-md object-cover"
            />
            <div className="min-w-0">
              <p className="font-creato-bold text-[16px] leading-tight text-black">
                Chxxxl
              </p>
              <p className="mt-0.5 text-[10.5px] leading-tight text-gray-500">
                Clothing E-Commerce
              </p>
            </div>
          </div>
          <p>
            {CHXXXL_BIO}
          </p>
          <span>2022-2023</span>
          <span>
            Art Director/Design Lead
          </span>
        </header>

        <div className="mt-2 flex flex-col gap-6">
          <BoardImage file="board1.webp" />
          <BoardImage file="board2.webp" />
          <BoardImage file="board3.webp" />
          <BoardImage file="board4.webp" />
          <BoardImage file="board5.webp" />
          <BoardImage file="board6.webp" />
          <BoardImage file="board7.webp" />
          <BoardImage file="board8.webp" />
          <BoardImage file="board9.webp" />
          <BoardImage file="board10.webp" />
          <BoardImage file="board11.webp" />
          <BoardCarousel
            label="Chxxxl board 12"
            aspectClass="aspect-[2000/1198]"
            files={["board12-1.webp", "board12-2.webp"]}
          />
          <BoardImage file="board13.webp" />
          <BoardCarousel
            label="Chxxxl board 14"
            aspectClass="aspect-[1626/1005]"
            files={["board14-1.webp", "board14-2.webp"]}
          />
        </div>
      </div>
    </div>
  );
}
