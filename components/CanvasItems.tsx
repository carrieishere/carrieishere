"use client";

import { Fragment, memo, useCallback } from "react";
import { Header } from "@/components/Header";
import { ItemHoverHintProvider, useShowItemHint } from "@/components/ItemHoverHint";
import { homepageItems, SCENE_ASPECT } from "@/lib/homepageItems";
import { HOMEPAGE_SECRETS } from "@/lib/homepageSecrets";
import { SecretInk } from "@/components/SecretInk";
import {
  HOMEPAGE_ITEM_HINT_KEY,
  type ItemHoverHintId,
} from "@/lib/itemHoverHints";
import type { ModalType } from "@/types";

interface CanvasItemsProps {
  onOpenModal: (type: ModalType, event: React.MouseEvent) => void;
  sceneReady: boolean;
  activeModal: ModalType;
}

export function CanvasItems({
  onOpenModal,
  sceneReady,
  activeModal,
}: CanvasItemsProps) {
  return (
    <ItemHoverHintProvider sceneReady={sceneReady} activeModal={activeModal}>
      <CanvasItemsScene onOpenModal={onOpenModal} />
    </ItemHoverHintProvider>
  );
}

interface SceneProps {
  onOpenModal: (type: ModalType, event: React.MouseEvent) => void;
}

const CanvasItemsScene = memo(function CanvasItemsScene({
  onOpenModal,
}: SceneProps) {
  const { showHint, hideHint } = useShowItemHint();

  const onItemEnter = useCallback(
    (key: ItemHoverHintId) => {
      showHint(key);
    },
    [showHint],
  );

  const onHomepageItemEnter = useCallback(
    (id: string) => {
      const key = HOMEPAGE_ITEM_HINT_KEY[id];
      if (!key) return;
      onItemEnter(key);
    },
    [onItemEnter],
  );

  return (
    <div className="pointer-events-none relative h-full w-full overflow-hidden">
      <div
        className="scene-stage absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: `min(100vw, calc(100vh * ${SCENE_ASPECT}))`,
          height: `min(100vh, calc(100vw / ${SCENE_ASPECT}))`,
        }}
      >
        <Header />
        {homepageItems.map((item) => {
          const secret = HOMEPAGE_SECRETS[item.id];
          const secretLayer = secret ? (
            <SecretInk
              src={secret.src}
              blend={secret.blend}
              style={secret.style}
            />
          ) : null;
          const { transform, zIndex, ...layoutStyle } = item.style;
          const boxStyle = {
            ...layoutStyle,
            transform,
            zIndex,
          };
          const image = (
            <img
              src={item.src}
              alt={item.alt}
              width={item.nativeWidth}
              height={item.nativeHeight}
              draggable={false}
              decoding="async"
              fetchPriority={
                item.id === "laptop" || item.id === "bag" ? "high" : "auto"
              }
              className="block h-auto w-full max-w-none select-none object-contain"
            />
          );
          const framed = (
            <div className="relative h-fit w-full">
              {image}
              {secretLayer}
            </div>
          );

          if (item.id === "bag") {
            return (
              <div key={item.id} className={item.className} style={boxStyle}>
                <div className="relative h-fit w-full">
                  {image}
                  <div
                    className="hover-item pointer-events-auto absolute left-[6%] top-[8%] z-10 h-[72%] w-[30%] cursor-pointer rounded-full bg-transparent"
                    onMouseEnter={() => onItemEnter("earphones")}
                    onMouseLeave={hideHint}
                    aria-label="耳机"
                  />
                </div>
              </div>
            );
          }

          if (item.id === "camera" && item.modal) {
            return (
              <Fragment key={item.id}>
                <div className="absolute h-fit w-fit" style={boxStyle}>
                  {framed}
                </div>
                <button
                  type="button"
                  aria-label={item.alt}
                  className="absolute hover-item pointer-events-auto h-fit w-fit border-0 bg-transparent p-0"
                  style={{
                    ...boxStyle,
                    zIndex: 41,
                  }}
                  onMouseEnter={() => onHomepageItemEnter(item.id)}
                  onMouseLeave={hideHint}
                  onClick={(event) => onOpenModal(item.modal!, event)}
                >
                  <img
                    src={item.src}
                    alt=""
                    width={item.nativeWidth}
                    height={item.nativeHeight}
                    draggable={false}
                    aria-hidden
                    className="block h-auto w-full max-w-none select-none object-contain opacity-0"
                  />
                </button>
              </Fragment>
            );
          }

          return (
            <div
              key={item.id}
              className={item.className}
              style={boxStyle}
              onMouseEnter={() => onHomepageItemEnter(item.id)}
              onMouseLeave={hideHint}
              onClick={
                item.modal ? (event) => onOpenModal(item.modal!, event) : undefined
              }
            >
              {framed}
            </div>
          );
        })}
      </div>
    </div>
  );
});
