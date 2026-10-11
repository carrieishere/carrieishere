/** 随桌面常驻；关 Photobooth 窗口不重置。整页 F5 才会归零。 */
export let isVideoLocked = false;
export let thumbnailClickCount = 0;

export function lockPhotoBoothVideo() {
  isVideoLocked = true;
}

export function bumpThumbnailClickCount(lastIndex: number) {
  if (thumbnailClickCount < lastIndex) thumbnailClickCount += 1;
}
