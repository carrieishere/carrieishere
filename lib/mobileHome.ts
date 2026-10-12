export const MOBILE_ART_WIDTH = 1536;
export const MOBILE_ART_HEIGHT = 2375;
export const MOBILE_EMAIL = "woshiyangjiali@gmail.com";
export const MOBILE_MAILTO = `mailto:${MOBILE_EMAIL}`;
export const MOBILE_INSTAGRAM = "https://www.instagram.com/carrieyhere/";

/** 设为 true 可看见热区色块，调完改回 false。网址加 &hotspots=1 也可以。 */
export const SHOW_MOBILE_HOTSPOTS = false;

export const MOBILE_TOP_IDLE = "Nice day, huh?";
export const MOBILE_TOP_NUDGE = "Go on, tap something.";
export const MOBILE_TOP_TAP = "There's more to find on a computer.";
/** 进入首页后，从第一句切到第二句的等待时间（毫秒）。 */
export const MOBILE_TOP_NUDGE_MS = 1600;
/** 相对主标题右上角。bx 正数往右，by 正数往下；bw 同物品气泡。 */
export const MOBILE_TITLE_BUBBLE = {
  bx: 60,
  by: -60,
  bw: 180,
  tail: "left" as const,
};

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

export type MobileBubbleTail = "left" | "center" | "right";

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
  /** 气泡最大宽度，单位 px。高度随文字。 */
  bw?: number;
  tail?: MobileBubbleTail;
}> = [
  { id: "earphones", label: "耳机", left: "17%", top: "36%", width: "24%", height: "19%", z: 9, bx: 0, by: -56, bw: 280 },
  { id: "camera", label: "相机", left: "57%", top: "34%", width: "18%", height: "8%", z: 8, tail: "right", bx: -120, by: -70, bw: 210 },
  { id: "perfume", label: "香水", left: "17%", top: "24%", width: "12%", height: "9%", z: 7, bx: 10, by: -50, bw: 200 },
  { id: "notebook", label: "笔记本", left: "69%", top: "21%", width: "25%", height: "20%", z: 6, tail: "right", bx: -120, by: -50, bw: 210 },
  { id: "laptop", label: "电脑", left: "18%", top: "13%", width: "68%", height: "22%", z: 5, tail: "center", bx: 0, by: -66, bw: 250 },
  { id: "pick", label: "拨片", left: "36%", top: "8%", width: "9%", height: "5%", z: 4, bx: 0, by: -65, bw: 220 },
  { id: "lipbalm", label: "润唇膏", left: "45%", top: "2.2%", width: "10%", height: "6%", z: 3, bx: -10, by: -50, bw: 260 },
  { id: "flower1", label: "花", left: "64%", top: "5%", width: "8%", height: "5%", z: 2, tail: "center", bx: -60, by: -50, bw: 280 },
  { id: "shoes", label: "鞋", left: "28%", top: "73%", width: "44%", height: "28%", z: 1, tail: "center", bx: -20, by: -70, bw: 180 },
];

/** 底部唯一气泡的轮播文案。 */
export const MOBILE_FOOTER_LINES = [
  "Wanna make something fun? Tap below to email me.",
  "Hi, I'm Carrie Yang.",
  "I love stories, in any form.",
  "I'm from China, based in Shenzhen.",
  "I'm into technology and philosophy too.",
  "I'm a graphic designer and art director.",
  "Five years of brand work, mostly in-house.",
  "I love film, music, and anything creative.",
  "Open to remote projects, wherever you are.",
  "I'm drawn to brands that do things a little differently.",
  "I designed this site myself and built it with vibe coding.",
  "My MBTI keeps changing, but I'm pretty sure I'm an existentialist.",
  "Fashion, jewelry, contact lenses, footwear. That's my usual territory.",
] as const;

export const MOBILE_FOOTER_BUBBLE = {
  bw: 280,
  tail: "center" as const,
};

export const MOBILE_FOOTER_CHAR_MS = 60;
export const MOBILE_FOOTER_MIN_MS = 2500;
export const MOBILE_FOOTER_MAX_MS = 5000;
export const MOBILE_FOOTER_TYPING_MIN_MS = 600;
export const MOBILE_FOOTER_TYPING_MAX_MS = 1000;
export const MOBILE_FOOTER_ENTER_S = 0.35;
export const MOBILE_FOOTER_EXIT_MS = 300;
export const MOBILE_FOOTER_GAP_MS = 400;

export function mobileFooterDwellMs(text: string) {
  return Math.min(
    MOBILE_FOOTER_MAX_MS,
    Math.max(MOBILE_FOOTER_MIN_MS, text.length * MOBILE_FOOTER_CHAR_MS),
  );
}
