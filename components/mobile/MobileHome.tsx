"use client";

const MOBILE_ART_WIDTH = 1536;
const MOBILE_ART_HEIGHT = 2736;
const MOBILE_ASPECT = MOBILE_ART_WIDTH / MOBILE_ART_HEIGHT;

/** 手机端首页。素材在 `public/assets/mobile/`。 */
export function MobileHome() {
  return (
    <div className="relative h-full min-h-screen w-full overflow-hidden bg-white">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `min(100vw, calc(100vh * ${MOBILE_ASPECT}))`,
          height: `min(100vh, calc(100vw / ${MOBILE_ASPECT}))`,
        }}
      >
        <img
          src="/assets/mobile/mobile.webp"
          alt=""
          width={MOBILE_ART_WIDTH}
          height={MOBILE_ART_HEIGHT}
          draggable={false}
          className="block h-full w-full select-none object-contain"
        />
      </div>
    </div>
  );
}
