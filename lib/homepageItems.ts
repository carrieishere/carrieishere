import type { CSSProperties } from "react";
import type { ModalType } from "@/types";

export interface HomepageItem {
  id: string;
  src: string;
  alt: string;
  nativeWidth: number;
  nativeHeight: number;
  className: string;
  style: CSSProperties;
  modal?: Extract<ModalType, "MACBOOK" | "NOTEBOOK" | "CAMERA">;
}

/** 设计稿画幅 3840×2400（16:10）。坐标与宽度都相对这块舞台。 */
export const DESIGN_WIDTH = 3840;
export const DESIGN_HEIGHT = 2400;
export const SCENE_ASPECT = DESIGN_WIDTH / DESIGN_HEIGHT;

function widthFromNative(nativeWidth: number) {
  return `${((nativeWidth / DESIGN_WIDTH) * 100).toFixed(3)}%`;
}

function itemStyle({
  top,
  left,
  bottom,
  nativeWidth,
  widthPercent,
  rotate = 0,
  zIndex,
}: {
  top?: string;
  left?: string;
  bottom?: string | number;
  nativeWidth: number;
  widthPercent?: number;
  rotate?: number;
  zIndex: number;
}): CSSProperties {
  const width =
    widthPercent !== undefined ? `${widthPercent}%` : widthFromNative(nativeWidth);

  return {
    top,
    left,
    bottom,
    width,
    height: "auto",
    zIndex,
    transform: rotate ? `rotate(${rotate}deg)` : undefined,
  };
}

/**
 * 位置按 3840×2400 效果图对齐。
 * width 默认 = 素材像素宽 / 3840，保证 Retina 上按 2x 显示、不拉伸发糊。
 * 多数素材已带透视旋转，CSS rotate 只做构图微调。
 */
export const homepageItems: HomepageItem[] = [
  {
    id: "laptop",
    src: "/assets/items/laptop.webp",
    alt: "笔记本电脑",
    nativeWidth: 1498,
    nativeHeight: 1147,
    className: "absolute hover-item pointer-events-auto h-fit w-fit",
    style: itemStyle({
      top: "30%",
      left: "21%",
      nativeWidth: 1570,
      rotate: 0,
      zIndex: 10,
    }),
    modal: "MACBOOK",
  },
  {
    id: "bag",
    src: "/assets/items/bag.webp",
    alt: "包",
    nativeWidth: 1698,
    nativeHeight: 776,
    className: "absolute pointer-events-none h-fit w-fit",
    style: itemStyle({
      bottom: 0,
      left: "27.6%",
      nativeWidth: 1760,
      zIndex: 40,
    }),
  },
  {
    id: "notebook",
    src: "/assets/items/notebook.webp",
    alt: "画册笔记本",
    nativeWidth: 548,
    nativeHeight: 612,
    className: "absolute hover-item pointer-events-auto h-fit w-fit",
    style: itemStyle({
      top: "37%",
      left: "54%",
      nativeWidth: 279,
      widthPercent: 15,
      zIndex: 22,
    }),
    modal: "NOTEBOOK",
  },
  {
    id: "perfume",
    src: "/assets/items/perfume.webp",
    alt: "香水",
    nativeWidth: 333,
    nativeHeight: 445,
    className: "absolute hover-item pointer-events-auto h-fit w-fit",
    style: itemStyle({
      top: "63%",
      left: "46%",
      nativeWidth: 333,
      zIndex: 28,
    }),
  },
  {
    id: "camera",
    src: "/assets/items/camera.webp",
    alt: "数码相机",
    nativeWidth: 498,
    nativeHeight: 402,
    className: "absolute hover-item pointer-events-auto h-fit w-fit",
    style: itemStyle({
      top: "64%",
      left: "61%",
      nativeWidth: 500,
      zIndex: 24,
    }),
    modal: "CAMERA",
  },
  {
    id: "lipbalm",
    src: "/assets/items/lipbalm.webp",
    alt: "护唇膏",
    nativeWidth: 146,
    nativeHeight: 207,
    className: "absolute hover-item pointer-events-auto h-fit w-fit",
    style: itemStyle({
      top: "55%",
      left: "71%",
      nativeWidth: 146,
      zIndex: 16,
    }),
  },
  {
    id: "pick",
    src: "/assets/items/pick.webp",
    alt: "吉他拨片",
    nativeWidth: 122,
    nativeHeight: 214,
    className: "absolute hover-item pointer-events-auto h-fit w-fit",
    style: itemStyle({
      top: "53%",
      left: "68%",
      nativeWidth: 122,
      zIndex: 16,
    }),
  },
  {
    id: "flower1",
    src: "/assets/items/flower1.webp",
    alt: "蓝色小花",
    nativeWidth: 156,
    nativeHeight: 152,
    className: "absolute hover-item pointer-events-auto h-fit w-fit",
    style: itemStyle({
      top: "30%",
      left: "22%",
      nativeWidth: 156,
      rotate: -8,
      zIndex: 45,
    }),
  },
  {
    id: "flower2",
    src: "/assets/items/flower2.webp",
    alt: "蓝色小花",
    nativeWidth: 134,
    nativeHeight: 134,
    className: "absolute hover-item pointer-events-auto h-fit w-fit",
    style: itemStyle({
      top: "42%",
      left: "16.6%",
      nativeWidth: 134,
      rotate: 10,
      zIndex: 12,
    }),
  },
];
