export const GREETING_GIF = "/assets/items/webp/hi.webp";
export const GREETING_PHRASE = "Oh,you found me.";

export const IDLE_GIF = "/assets/items/webp/idle.webp";
export const IDLE_GIF_FALLBACK = "/assets/items/webp/idle.webp";
export const IDLE_POSE_PHRASE = "Take your time. I'm not going anywhere.";
export const THINK_GIF = "/assets/items/webp/think.webp";
export const THINK_POSE_PHRASE = "Have I been here long? Never mind.";
export const REFUSE_GIF = "/assets/items/webp/refuse.webp";
export const REFUSE_POSE_PHRASE = "I'd rather not talk about that.";

export const POSE_PHRASES: Record<string, string> = {
  [GREETING_GIF]: GREETING_PHRASE,
  [IDLE_GIF]: IDLE_POSE_PHRASE,
  [THINK_GIF]: THINK_POSE_PHRASE,
  [REFUSE_GIF]: REFUSE_POSE_PHRASE,
};

export const IDLE_POSES = [
  "/assets/items/webp/idle.webp",
  "/assets/items/webp/refuse.webp",
  "/assets/items/webp/think.webp",
] as const;

/** idle 为静帧；how / who / why / refuse / think 素材约 5.02s，略短于循环以免重播开头。 */
export const POSE_DURATION_MS: Record<string, number> = {
  "/assets/items/webp/hi.webp": 5000,
  "/assets/items/webp/idle.webp": 4000,
  "/assets/items/webp/refuse.webp": 5000,
  "/assets/items/webp/think.webp": 5000,
  "/assets/items/webp/who.webp": 5000,
  "/assets/items/webp/why.webp": 5000,
  "/assets/items/webp/how.webp": 5000,
};

export function poseDurationMs(src: string) {
  return POSE_DURATION_MS[src] ?? 5000;
}

export type QuestionId = "who" | "why" | "how";

export const QUESTIONS: {
  id: QuestionId;
  label: string;
  gif: string;
  answer: string;
  tone: "mid" | "light" | "white";
}[] = [
  {
    id: "who",
    label: "WHO ARE YOU?",
    gif: "/assets/items/webp/who.webp",
    answer: "Hi, I'm Carrie, a graphic designer and art director based in ShenZhen.",
    tone: "mid",
  },
  {
    id: "why",
    label: "WHY ARE YOU HERE?",
    gif: "/assets/items/webp/why.webp",
    answer: "What do you mean? I've always been here.",
    tone: "light",
  },
  {
    id: "how",
    label: "HOW CAN I GET YOU OUT OF HERE?",
    gif: "/assets/items/webp/how.webp",
    answer:
      "You can always reach out by email, I'd love to hear from you!",
    tone: "white",
  },
];
