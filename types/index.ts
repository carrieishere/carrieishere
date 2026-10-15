/** 全局弹窗状态机：同一时间只允许一个弹窗激活 */
export type ModalType = "NONE" | "MACBOOK" | "NOTEBOOK" | "CAMERA";

/** 弹窗从点击处放大时使用的变换原点（0~1，相对视口宽高） */
export interface ModalOrigin {
  x: number;
  y: number;
}

export const NOTEBOOK_PAGE_COUNT = 6;
export const CAMERA_PHOTO_COUNT = 25;
