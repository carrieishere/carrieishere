export type PosterItemType = "image" | "video";
export type PosterCategory = "poster" | "motion";

export interface PosterItem {
  id: string;
  type: PosterItemType;
  category: PosterCategory;
  thumb: string;
  src: string;
}

const POSTER_ROOT = "/assets/items/laptop/project/poster";

function posterRange(start: number, end: number): PosterItem[] {
  return Array.from({ length: end - start + 1 }, (_, offset) => {
    const n = start + offset;
    return {
      id: `poster-${n}`,
      type: "image" as const,
      category: "poster" as const,
      thumb: `${POSTER_ROOT}/small/poster/small${n}.webp`,
      src: `${POSTER_ROOT}/original/poster/board${n}.webp`,
    };
  });
}

function motionRange(start: number, end: number): PosterItem[] {
  return Array.from({ length: end - start + 1 }, (_, offset) => {
    const n = start + offset;
    return {
      id: `motion-${n}`,
      type: "video" as const,
      category: "motion" as const,
      thumb: `${POSTER_ROOT}/small/motion/small${n}.webp`,
      src: `${POSTER_ROOT}/original/motion/board${n}.mp4`,
    };
  });
}

export const POSTER_ITEMS: PosterItem[] = [
  ...posterRange(1, 36),
  ...motionRange(39, 53),
];

export const POSTER_SECTION_ITEMS = POSTER_ITEMS.filter(
  (item) => item.category === "poster",
);

export const MOTION_SECTION_ITEMS = POSTER_ITEMS.filter(
  (item) => item.category === "motion",
);
