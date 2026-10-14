"use client";

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Camera, Grid2X2, User } from "lucide-react";
import {
  bumpThumbnailClickCount,
  isVideoLocked,
  lockPhotoBoothVideo,
  thumbnailClickCount,
} from "@/lib/photoboothSession";

const PHOTOBOOTH_DIR = "/assets/items/laptop/photobooth";
const PHOTOBOOTH_ICON = "/assets/items/laptop/mac-icons/photobooth.webp";
const PHOTOBOOTH_VIDEO = `${PHOTOBOOTH_DIR}/original1.mp4`;

const THUMB_IDS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

const LOCKED_VIDEO_ALERT = {
  message: "This video isn’t available anymore.",
  button: "OK",
} as const;

const THUMBNAIL_ALERT_MESSAGES = [
  "Sorry, you don’t have permission.",
  "Please don’t try to open this again.",
  "I said you don’t have permission.",
  "There’s nothing here. Look at something else.",
  "Why do you keep clicking this?",
  "You weren’t supposed to see that.",
  "Stop. Please. Just stop.",
  "NO. I’m fine. I’M CARRIE! I DON’T NEED HER!!",
] as const;

const THUMBNAIL_ALERT_BUTTONS = [
  "OK",
  "OK",
  "Fine",
  "Fine",
  "Sorry",
  "Forget it",
  "why",
  "...",
] as const;

type PhotoBoothAlertCopy = {
  message: string;
  button: string;
};

const PhotoBoothVideo = memo(function PhotoBoothVideo({
  onEnded,
}: {
  onEnded: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [buffering, setBuffering] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.setAttribute("webkit-playsinline", "true");
    el.load();
    el.play().catch((err: unknown) => {
      const name = err instanceof Error ? err.name : "";
      const revealIfStillPaused = () => {
        if (el.paused && !el.ended) setNeedsGesture(true);
      };
      if (name === "AbortError") {
        window.setTimeout(revealIfStillPaused, 0);
        return;
      }
      revealIfStillPaused();
    });
    return () => {
      el.pause();
    };
  }, []);

  const playWithSound = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    el.play()
      .then(() => setNeedsGesture(false))
      .catch(() => {});
  }, []);

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        className="autoplay-video h-full w-full object-cover object-center"
        playsInline
        webkit-playsinline="true"
        crossOrigin="anonymous"
        controls={false}
        preload="auto"
        onLoadedData={() => setBuffering(false)}
        onPlaying={() => setBuffering(false)}
        onWaiting={() => setBuffering(true)}
        onError={() => setBuffering(false)}
        onEnded={onEnded}
      >
        <source src={PHOTOBOOTH_VIDEO} type="video/mp4" />
      </video>
      {buffering && !needsGesture ? (
        <div
          className="absolute inset-0 z-[1] flex items-center justify-center bg-white"
          role="status"
          aria-label="Loading video"
        >
          <span
            aria-hidden
            className="h-7 w-7 animate-spin rounded-full border-2 border-black/10 border-t-black/70"
          />
        </div>
      ) : null}
      {needsGesture ? (
        <button
          type="button"
          aria-label="Click to play"
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/25"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={playWithSound}
        >
          <span className="flex items-center gap-2 rounded-full border border-black/10 bg-white/85 px-4 py-[7px] text-[13px] font-medium text-black shadow-[0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur-md">
            <span
              aria-hidden
              className="ml-0.5 block h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-black"
            />
            Click to play
          </span>
        </button>
      ) : null}
    </div>
  );
});

const PhotoBoothStage = memo(function PhotoBoothStage({
  locked,
  onVideoEnded,
  onLockedVideoClick,
  onThumbClick,
}: {
  locked: boolean;
  onVideoEnded: () => void;
  onLockedVideoClick: () => void;
  onThumbClick: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#ececec]">
      <div className="relative min-h-0 flex-1 bg-white">
        <div
          data-photobooth-stage
          className="absolute inset-0"
        >
          {locked ? (
            <button
              type="button"
              aria-label="Locked Photo Booth video"
              className="absolute inset-0 z-10 cursor-pointer bg-transparent"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={onLockedVideoClick}
            />
          ) : (
            <PhotoBoothVideo onEnded={onVideoEnded} />
          )}
        </div>
      </div>

      <div className="shrink-0 bg-[#f2f2f2]">
        <div className="flex w-full flex-row-reverse gap-1 px-2 py-1.5">
          {THUMB_IDS.map((id) => {
            const selected = id === 1;
            const src = `${PHOTOBOOTH_DIR}/small${id}.webp`;
            const frameClass =
              "relative h-[62px] min-w-0 flex-1 overflow-hidden";

            return (
              <button
                key={id}
                type="button"
                aria-current={selected ? "true" : undefined}
                aria-label="Photo Booth clip"
                className={selected ? `${frameClass} ring-2 ring-white` : frameClass}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={onThumbClick}
              >
                <img
                  src={src}
                  alt=""
                  draggable={false}
                  className="pointer-events-none h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>

        <div className="relative flex h-11 items-center border-t border-black/5 px-4">
          <div className="flex items-center gap-2 text-[#4a4a4a]">
            <Grid2X2 size={15} strokeWidth={1.75} />
            <User size={15} strokeWidth={1.75} />
            <Camera size={15} strokeWidth={1.75} />
          </div>
          <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#e02525] text-white shadow-sm">
            <Camera size={14} strokeWidth={2} />
          </div>
          <span className="ml-auto rounded-md bg-[#d8d8d8] px-3 py-1 text-[11px] leading-none text-[#3a3a3a]">
            Effect
          </span>
        </div>
      </div>
    </div>
  );
});

const PhotoBoothAlert = memo(function PhotoBoothAlert({
  message,
  button,
  onClose,
}: PhotoBoothAlertCopy & {
  onClose: () => void;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="photobooth-warning-title"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="pointer-events-auto flex min-h-[120px] w-[min(92%,380px)] flex-col overflow-hidden rounded-lg border border-black/20 bg-[#e8e8e8] shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
        <div className="relative flex h-6 shrink-0 items-center bg-[#e8e8e8] px-3">
          <div className="relative z-10 flex items-center gap-1.5">
            <button
              type="button"
              aria-label="关闭弹窗"
              className="h-3 w-3 rounded-full bg-[#ff5f57]"
              onClick={onClose}
            />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <p
            id="photobooth-warning-title"
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-[11px] font-black tracking-[0.04em] text-black"
          >
            WARNING
          </p>
        </div>

        <div className="flex flex-1 flex-col bg-[#3a3a3a] px-16 pb-4 pt-4">
          <div className="flex items-center justify-center gap-2">
            <img
              src={PHOTOBOOTH_ICON}
              alt=""
              draggable={false}
              className="h-9 w-9 shrink-0 object-contain"
            />
            <p className="text-[10px] leading-snug text-white">{message}</p>
          </div>
          <div className="mt-2 flex items-center justify-center">
            <button
              type="button"
              className="rounded-[4px] bg-[#0a84ff] px-2 py-0.4 text-[10px] font-medium text-white"
              onClick={onClose}
            >
              {button}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default function PhotoBoothWindowBody() {
  const [locked, setLocked] = useState(() => isVideoLocked);
  const [activeAlert, setActiveAlert] = useState<PhotoBoothAlertCopy | null>(
    null,
  );

  useEffect(() => {
    setLocked(isVideoLocked);
  }, []);

  const closeAlert = useCallback(() => {
    setActiveAlert(null);
  }, []);

  const onLockedVideoClick = useCallback(() => {
    if (!isVideoLocked) return;
    setActiveAlert({
      message: LOCKED_VIDEO_ALERT.message,
      button: LOCKED_VIDEO_ALERT.button,
    });
  }, []);

  const onThumbClick = useCallback(() => {
    const last = THUMBNAIL_ALERT_MESSAGES.length - 1;
    const index = Math.min(thumbnailClickCount, last);
    setActiveAlert({
      message: THUMBNAIL_ALERT_MESSAGES[index],
      button: THUMBNAIL_ALERT_BUTTONS[index],
    });
    bumpThumbnailClickCount(last);
  }, []);

  const onVideoEnded = useCallback(() => {
    lockPhotoBoothVideo();
    setLocked(true);
    setActiveAlert({
      message: LOCKED_VIDEO_ALERT.message,
      button: LOCKED_VIDEO_ALERT.button,
    });
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      <PhotoBoothStage
        locked={locked}
        onVideoEnded={onVideoEnded}
        onLockedVideoClick={onLockedVideoClick}
        onThumbClick={onThumbClick}
      />
      {activeAlert ? (
        <PhotoBoothAlert
          key={activeAlert.message}
          message={activeAlert.message}
          button={activeAlert.button}
          onClose={closeAlert}
        />
      ) : null}
    </div>
  );
}
