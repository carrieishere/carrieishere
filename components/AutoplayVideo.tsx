"use client";

import { useEffect, useRef, useState } from "react";

interface AutoplayVideoProps {
  src: string;
  className?: string;
  poster?: string;
}

/**
 * 静音自动播放；被策略拦截时回退到 poster，避免停在黑帧。
 */
export function AutoplayVideo({ src, className, poster }: AutoplayVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setFailed(false);
    el.setAttribute("webkit-playsinline", "true");

    const tryPlay = () => {
      const result = el.play();
      if (result !== undefined) {
        result.catch(() => setFailed(true));
      }
    };

    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      tryPlay();
    } else {
      el.addEventListener("loadeddata", tryPlay, { once: true });
    }

    return () => {
      el.removeEventListener("loadeddata", tryPlay);
      el.pause();
    };
  }, [src]);

  if (failed && poster) {
    return (
      <img
        src={poster}
        alt=""
        draggable={false}
        className={className}
      />
    );
  }

  return (
    <video
      ref={ref}
      src={src}
      className={`autoplay-video ${className ?? ""}`.trim()}
      muted
      loop
      autoPlay
      playsInline
      controls={false}
      disablePictureInPicture
      controlsList="nodownload nofullscreen noremoteplayback"
      preload="metadata"
      poster={poster}
    />
  );
}
