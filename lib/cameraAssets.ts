import { CAMERA_PHOTO_COUNT } from "@/types";

export const CAMERA_BODY_SRC = "/assets/items/camera/camera_body.webp";

export const CAMERA_PHOTOS = Array.from(
  { length: CAMERA_PHOTO_COUNT },
  (_, index) => `/assets/items/camera/ccd/${index}.webp`,
);

export function preloadCameraAssets() {
  const urls = [CAMERA_BODY_SRC, ...CAMERA_PHOTOS];
  urls.forEach((src) => {
    const img = new window.Image();
    img.decoding = "async";
    img.src = src;
  });
}

export function waitForImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new window.Image();
    const done = () => resolve();
    img.onload = done;
    img.onerror = done;
    img.src = src;
    if (img.complete && img.naturalWidth > 0) {
      if (typeof img.decode === "function") {
        void img.decode().then(done).catch(done);
        return;
      }
      done();
    }
  });
}
