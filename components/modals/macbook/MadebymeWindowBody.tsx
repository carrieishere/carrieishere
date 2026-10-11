"use client";

const MADEBYME_DIR = "/assets/items/laptop/project/madebyme";
const MADEBYME_ICON = "/assets/items/laptop/desktopIcons/MadeByMe.webp";

const MADEBYME_BIO =
  "MadeByMe is an online multi-brand store, featuring CHXXXL, IAMNOT, HXXXXS, LILY MLLE, and other brands. The interface follows a clean, minimal style, while the logo design carries forward the brand's signature simplicity and strong recognizability.";

const MADEBYME_BOARDS = [
  "board1.webp",
  "board2.webp",
  "board3.webp",
  "board4.webp",
  "board5.webp",
] as const;

function boardSrc(file: string) {
  return `${MADEBYME_DIR}/${file}`;
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

export default function MadebymeWindowBody() {
  return (
    <div className="h-full w-full min-w-[480px] overflow-x-hidden overflow-y-auto bg-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-col px-6 pb-8 pt-5">
        <header className="relative z-10 grid grid-cols-[minmax(0,1fr)_minmax(0,280px)] items-start gap-x-2 gap-y-4 bg-white text-[10px] leading-[10px] text-gray-500">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={MADEBYME_ICON}
              alt=""
              draggable={false}
              loading="lazy"
              className="h-11 w-11 shrink-0 rounded-md object-cover"
            />
            <div className="min-w-0">
              <p className="font-creato-bold text-[16px] leading-tight text-black">
                MadeByMe
              </p>
              <p className="mt-0.5 text-[10.5px] leading-tight text-gray-500">
                Online Multi-Brand Store
              </p>
            </div>
          </div>
          <p>
            {MADEBYME_BIO}
          </p>
          <span>2021-2022</span>
          <span className="whitespace-nowrap">
            Art Director/Design Lead
          </span>
        </header>

        <div className="mt-2 flex w-full flex-col gap-6">
          {MADEBYME_BOARDS.map((file) => (
            <BoardImage key={file} file={file} />
          ))}
        </div>
      </div>
    </div>
  );
}
