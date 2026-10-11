"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CAMERA_PHOTO_COUNT } from "@/types";

const CAMERA_PHOTOS = Array.from(
  { length: CAMERA_PHOTO_COUNT },
  (_, index) => `/assets/items/camera/ccd/${index}.webp`,
);

const POV_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CAPTION_PHRASES = [
  "I went to the seaside this morning.",
  "Beaches, parks, the outskirts... those places can always make me feel calm.",
] as const;
const CAPTION_MS = 8000;
const CAPTION_GAP_MS = 400;
const CAPTION_DELAY_MS = 800;

interface CameraModalProps {
  photoIndex: number;
  onPhotoIndexChange: (index: number) => void;
  onClose: () => void;
}

export function CameraModal({
  photoIndex,
  onPhotoIndexChange,
  onClose,
}: CameraModalProps) {
  const count = CAMERA_PHOTO_COUNT;
  const index = ((photoIndex % count) + count) % count;
  const [caption, setCaption] = useState<string | null>(null);

  const step = useCallback(
    (dir: -1 | 1) => {
      const next =
        dir === -1
          ? (index - 1 + count) % count
          : (index + 1) % count;
      onPhotoIndexChange(next);
    },
    [count, index, onPhotoIndexChange],
  );

  useEffect(() => {
    const neighbors = [index - 1, index + 1].map(
      (value) => ((value % count) + count) % count,
    );
    const loaders = [...new Set(neighbors)].map((photo) => {
      const img = new window.Image();
      img.src = CAMERA_PHOTOS[photo];
      return img;
    });
    return () => {
      loaders.forEach((img) => {
        img.src = "";
      });
    };
  }, [count, index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    const steps: Array<{ delay: number; caption: string | null }> = [
      { delay: CAPTION_DELAY_MS, caption: CAPTION_PHRASES[0] },
      { delay: CAPTION_MS, caption: null },
      { delay: CAPTION_GAP_MS, caption: CAPTION_PHRASES[1] },
      { delay: CAPTION_MS, caption: null },
    ];
    let index = 0;

    const run = () => {
      if (cancelled || index >= steps.length) return;
      const step = steps[index];
      index += 1;
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setCaption(step.caption);
        run();
      }, step.delay);
    };

    setCaption(null);
    run();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <motion.div
      className="camera-modal-backdrop"
      data-cursor-ignore
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="camera-modal-stage">
        <motion.div
          className="camera-pov"
          initial={{ y: 300, rotateX: 15, scale: 0.8 }}
          animate={{ y: 0, rotateX: 0, scale: 0.8 }}
          exit={{ y: 220, rotateX: 12, scale: 0.86, opacity: 0 }}
          transition={{ duration: 0.8, ease: POV_EASE }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="camera-screen">
            <img
              key={CAMERA_PHOTOS[index]}
              src={CAMERA_PHOTOS[index]}
              alt=""
              draggable={false}
              decoding="async"
              className="camera-screen-photo"
            />
          </div>

          <img
            className="camera-body"
            src="/assets/items/camera/camera_body.webp"
            alt="Sony DSC-W830"
            width={1713}
            height={1270}
            draggable={false}
          />

          <AnimatePresence mode="wait">
            {caption ? (
              <motion.div
                key={caption}
                className="camera-caption font-creato-medium text-[17px] leading-snug text-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {caption}
                <span aria-hidden className="camera-caption-tail" />
              </motion.div>
            ) : null}
          </AnimatePresence>

          <button
            type="button"
            className="camera-hotspot camera-hotspot-up"
            aria-label="上"
          />
          <button
            type="button"
            className="camera-hotspot camera-hotspot-down"
            aria-label="下"
          />
          <button
            type="button"
            className="camera-hotspot camera-hotspot-left"
            aria-label="上一张"
            onClick={() => step(-1)}
          />
          <button
            type="button"
            className="camera-hotspot camera-hotspot-right"
            aria-label="下一张"
            onClick={() => step(1)}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
