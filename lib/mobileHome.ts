export const MOBILE_ART_WIDTH = 1536;
export const MOBILE_ART_HEIGHT = 2375;
export const MOBILE_MAILTO = "mailto:woshiyangjiali@gmail.com";

/** 设为 true 可看见热区色块，调完改回 false。网址加 &hotspots=1 也可以。 */
export const SHOW_MOBILE_HOTSPOTS = false;

export const MOBILE_TOP_IDLE = "Nice day, huh?";
export const MOBILE_TOP_NUDGE = "Go on, tap something.";
export const MOBILE_TOP_TAP = "There's more to find on a computer.";
/** 进入首页后，从第一句切到第二句的等待时间（毫秒）。 */
export const MOBILE_TOP_NUDGE_MS = 1600;
/** 相对主标题右上角。bx 正数往右，by 正数往下；bw / bh 同物品气泡。 */
const MOBILE_TITLE_BUBBLE_BASE = {
  bx: 60,
  by: -60,
  bw: 180,
  bh: 0,
  tail: "left" as const,
};

/** Nice day, huh? */
export const MOBILE_TOP_IDLE_BUBBLE = { ...MOBILE_TITLE_BUBBLE_BASE };
/** Go on, tap something. */
export const MOBILE_TOP_NUDGE_BUBBLE = { ...MOBILE_TITLE_BUBBLE_BASE };
/** 点击主标题后的那句。 */
export const MOBILE_TOP_TAP_BUBBLE = { ...MOBILE_TITLE_BUBBLE_BASE };

export const MOBILE_ITEM_HINTS = {
  laptop: "Most of my work lives in here. Best seen on a computer.",
  notebook: "Kinda personal. You can flip through it on a computer.",
  camera: "Photos from my wandering. See them on a computer.",
  perfume: "I've really been liking this perfume lately.",
  pick: "So that's where it was. I'm always losing these.",
  lipbalm: "Lip balm. I'm never without it.",
  earphones: "Usually listening to something.",
  flower1: "I like flowers, though.",
  shoes: "That's me, by the way. Standing right here.",
} as const;

export type MobileItemId = keyof typeof MOBILE_ITEM_HINTS;

export type MobileBubbleTail =
  | "left"
  | "center"
  | "right"
  | "top-left"
  | "top-right";

export const MOBILE_HOTSPOTS: Array<{
  id: MobileItemId;
  label: string;
  left: string;
  top: string;
  width: string;
  height: string;
  z: number;
  /** 相对热区左上角，单位 px。bx 正数往右，by 正数往下（负数往上）。 */
  bx: number;
  by: number;
  /** 气泡最大宽度 / 最小高度，单位 px。高度一般随文字，bh 留 0 即可。 */
  bw?: number;
  bh?: number;
  tail?: MobileBubbleTail;
}> = [
  { id: "earphones", label: "耳机", left: "17%", top: "36%", width: "24%", height: "19%", z: 9, bx: 0, by: -56, bw: 280, bh: 0 },
  { id: "camera", label: "相机", left: "57%", top: "34%", width: "18%", height: "8%", z: 8, tail: "right", bx: -120, by: -70, bw: 210, bh: 0 },
  { id: "perfume", label: "香水", left: "17%", top: "24%", width: "12%", height: "9%", z: 7, bx: 10, by: -50, bw: 200, bh: 0 },
  { id: "notebook", label: "笔记本", left: "69%", top: "21%", width: "25%", height: "20%", z: 6, tail: "right", bx: -120, by: -50, bw: 210, bh: 0 },
  { id: "laptop", label: "电脑", left: "18%", top: "13%", width: "68%", height: "22%", z: 5, tail: "center", bx: 0, by: -66, bw: 250, bh: 0 },
  { id: "pick", label: "拨片", left: "36%", top: "8%", width: "9%", height: "5%", z: 4, bx: 0, by: -65, bw: 220, bh: 0 },
  { id: "lipbalm", label: "润唇膏", left: "45%", top: "2.2%", width: "10%", height: "6%", z: 3, bx: -10, by: -50, bw: 260, bh: 0 },
  { id: "flower1", label: "花", left: "64%", top: "5%", width: "8%", height: "5%", z: 2, tail: "center", bx: -60, by: -50, bw: 280, bh: 0 },
  { id: "shoes", label: "鞋", left: "28%", top: "73%", width: "44%", height: "28%", z: 1, tail: "center", bx: -20, by: -70, bw: 180, bh: 0 },
];

export const MOBILE_FIXED_BUBBLE =
  "Wanna make something fun? Tap below to email me.";

/** 固定邀请气泡，相对 @CARRIEYHERE 右上。bx 正数往右，by 正数往下。 */
export const MOBILE_FOOTER_FIXED = {
  bx: 0,
  by: 80,
  bw: 210,
  bh: 0,
  tail: "left" as const,
};

/** 底部大字 @CARRIEYHERE。bx 正数往右，by 正数往下。 */
export const MOBILE_FOOTER_HANDLE = {
  bx: 0,
  by: 30,
};

/** 底部轮播气泡的宽高；位置用下面三个槽的 bx / by。 */
export const MOBILE_FOOTER_CAROUSEL = {
  bw: 260,
  bh: 0,
  tail: "right" as const,
};

/** 每句轮播气泡停留多久（毫秒）。越大出现越久。 */
export const MOBILE_FOOTER_SHOW_MS = 4900;
/** 一句消失后，到下一句出现的空白（毫秒）。越小接得越紧。 */
export const MOBILE_FOOTER_GAP_MS = 400;
/** 三个槽开始时间互相错开（毫秒）。越大切换越不同步。 */
export const MOBILE_FOOTER_STAGGER_MS = 1700;
/** 轮播气泡淡入 / 淡出时长（毫秒）。越大越慢。 */
export const MOBILE_FOOTER_FADE_MS = 900;

export type MobileBubbleSlot = "tl" | "bl" | "br";

/** 三个轮播槽：左上、左下、右下。bx / by 相对默认位置，单位 px。 */
export const MOBILE_FOOTER_SLOTS: Record<
  MobileBubbleSlot,
  { bx: number; by: number }
> = {
  tl: { bx: 20, by: 9 },
  bl: { bx: 50, by: -30 },
  br: { bx: -50, by: 40 },
};

/** 三个槽各自轮播的文案，只在对应位置出现。 */
export const MOBILE_FOOTER_LINES: Record<MobileBubbleSlot, readonly string[]> = {
  tl: [
    "Hi, I'm Carrie Yang.",
    "I love stories, in any form.",
    "I'm from China, based in Shenzhen.",
  ],
  bl: [
    "I'm into technology and philosophy too.",
    "I'm a graphic designer and art director.",
    "Five years of brand work, mostly in-house.",
    "I love film, music, and anything creative.",
    "Open to remote projects, wherever you are.",
  ],
  br: [
    "I'm drawn to brands that do things a little differently.",
    "I designed this site myself and built it with vibe coding.",
    "My MBTI keeps changing, but I'm pretty sure I'm an existentialist.",
    "Fashion, jewelry, contact lenses, footwear. That's my usual territory.",
  ],
};

export const MOBILE_INTRO_BUBBLES = [
  ...MOBILE_FOOTER_LINES.tl,
  ...MOBILE_FOOTER_LINES.bl,
  ...MOBILE_FOOTER_LINES.br,
] as const;

export const MOBILE_INTRO_SPECIAL_INDEX = MOBILE_INTRO_BUBBLES.length - 1;

export const MOBILE_BUBBLE_SLOTS: MobileBubbleSlot[] = ["tl", "bl", "br"];

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j]!, next[i]!];
  }
  return next;
}

export function createIntroLinePicker() {
  const others = Array.from(
    { length: MOBILE_INTRO_SPECIAL_INDEX },
    (_, index) => index,
  );
  let phase: "first" | "second" | "rest" | "loop" = "first";
  let rest = shuffle(others.slice(2));
  let pool: number[] = [];
  let last = -1;
  let othersSinceSpecial = 0;
  let untilSpecial = 4 + Math.floor(Math.random() * 2);

  const take = (list: number[]) => {
    if (!list.length) return 0;
    const preferred = list.findIndex((index) => index !== last);
    const pickAt = preferred === -1 ? 0 : preferred;
    const [picked] = list.splice(pickAt, 1);
    return picked ?? 0;
  };

  const refill = () => {
    pool = shuffle(others);
    if (pool[0] === last && pool.length > 1) {
      const swap = pool.findIndex((index) => index !== last);
      if (swap > 0) [pool[0], pool[swap]] = [pool[swap]!, pool[0]!];
    }
  };

  return function nextLine() {
    if (othersSinceSpecial >= untilSpecial) {
      othersSinceSpecial = 0;
      untilSpecial = 4 + Math.floor(Math.random() * 2);
      last = MOBILE_INTRO_SPECIAL_INDEX;
      return MOBILE_INTRO_BUBBLES[MOBILE_INTRO_SPECIAL_INDEX];
    }

    let index = 0;
    if (phase === "first") {
      index = 0;
      phase = "second";
    } else if (phase === "second") {
      index = 1;
      phase = "rest";
    } else if (phase === "rest") {
      if (!rest.length) {
        phase = "loop";
        refill();
        index = take(pool);
      } else {
        index = take(rest);
      }
    } else {
      if (!pool.length) refill();
      index = take(pool);
    }

    last = index;
    othersSinceSpecial += 1;
    return MOBILE_INTRO_BUBBLES[index]!;
  };
}
