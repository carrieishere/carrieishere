import type { CSSProperties } from "react";

export interface HomepageSecret {
  src: string;
  /** 相对该物品盒子的位置，素材是裁切字图而非整物件画幅。 */
  style: CSSProperties;
  /** 白字黑底时用来抠掉黑底；黑字透明底不要用。 */
  blend?: "screen";
}

export const HOMEPAGE_SECRETS: Record<string, HomepageSecret> = {
  laptop: {
    src: "/assets/items/secret/laptop-secret.webp",
    style: {
      top: "16%",
      left: "14%",
      width: "70%",
    },
  },
  notebook: {
    src: "/assets/items/secret/notebook-secret.webp",
    blend: "screen",
    style: {
      top: "48%",
      left: "18%",
      width: "30%",
    },
  },
  camera: {
    src: "/assets/items/secret/camera-secret.webp",
    blend: "screen",
    style: {
      top: "36%",
      left: "16%",
      width: "34%",
    },
  },
};
