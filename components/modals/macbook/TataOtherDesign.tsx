"use client";

const TATA_DIR = "/assets/items/laptop/project/tata-other-design";
const TATA_ICON = "/assets/items/laptop/desktopIcons/tata-celebrity-collab.webp";

const TATA_BIO =
  "Packaging for a celebrity collaboration gift, turning the celebrity's concept into something that still feels true to TATA. Designed to be both fun to collect and easy to actually use.";

const STATIC_BOARDS = ["board1.webp", "board2.webp", "board3.webp"] as const;

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
      className="mb-0 block h-auto w-full"
    />
  );
}

export default function TataOtherDesign() {
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
                Celebrity Collab
              </p>
            </div>
          </div>
          <p>
            {TATA_BIO}
          </p>
          <span>2024-2026</span>
          <span>Packaging Design</span>
        </header>

        <div className="mt-2 flex flex-col gap-0 gap-y-0">
          {STATIC_BOARDS.map((file) => (
            <BoardImage key={file} file={file} />
          ))}
        </div>
      </div>
    </div>
  );
}
