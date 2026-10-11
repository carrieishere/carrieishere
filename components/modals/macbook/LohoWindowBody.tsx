"use client";

import { AutoplayVideo } from "@/components/AutoplayVideo";

const LOHO_DIR = "/assets/items/laptop/project/loho";
const LOHO_ICON = "/assets/items/laptop/desktopIcons/Loho.webp";

const LOHO_BIO =
  "Designed the key visuals for LOHO's 2023 roadshow, covering retail displays and materials rolled out across 200+ cities in China. The visuals were adapted for different store formats based on on-site research, and remained in use through 2024.";

const LOHO_FOOTNOTE =
  "Some of the work shown here comes from early-stage concepts and proposal work, while others were developed and produced for real-world use.";

const LOHO_BOARDS = [
  "board1.webp",
  "board2.webp",
  "board3.webp",
  "board4.webp",
  "board5.webp",
  "board6.webp",
  "board7.webp",
  "board8.webp",
  "board9.webp",
  "board10.mp4",
  "board11.webp",
] as const;

function boardSrc(file: string) {
  return `${LOHO_DIR}/${file}`;
}

function BoardImage({ file }: { file: string }) {
  const src = boardSrc(file);

  if (file.endsWith(".mp4")) {
    return (
      <AutoplayVideo
        src={src}
        className="block h-auto w-full"
      />
    );
  }

  return (
    <img
      src={src}
      alt=""
      draggable={false}
      loading="lazy"
      className="block h-auto w-full"
    />
  );
}

export default function LohoWindowBody() {
  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-auto bg-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-col px-6 pb-8 pt-5">
        <header className="grid grid-cols-[minmax(0,1fr)_minmax(0,280px)] items-start gap-x-2 gap-y-4 text-[10px] leading-[10px] text-gray-500">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={LOHO_ICON}
              alt=""
              draggable={false}
              loading="lazy"
              className="h-11 w-11 shrink-0 rounded-md object-cover"
            />
            <div className="min-w-0">
              <p className="font-creato-bold text-[16px] leading-tight text-black">
                Loho
              </p>
              <p className="mt-0.5 text-[10.5px] leading-tight text-gray-500">
                Eyewear&Optical
              </p>
            </div>
          </div>
          <p>
            {LOHO_BIO}
          </p>
          <span>2023-2024</span>
          <span>
            Senior Designer
          </span>
        </header>

        <div className="mt-2 flex flex-col gap-6">
          {LOHO_BOARDS.map((file) => (
            <BoardImage key={file} file={file} />
          ))}

          <p className="text-left text-[10px] leading-[10px] text-gray-500">
            {LOHO_FOOTNOTE}
          </p>
        </div>
      </div>
    </div>
  );
}
