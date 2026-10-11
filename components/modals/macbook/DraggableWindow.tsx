"use client";

import { forwardRef, type ReactNode, type RefObject } from "react";
import {
  motion,
  useDragControls,
  useIsPresent,
  useReducedMotion,
} from "framer-motion";

interface DraggableWindowProps {
  title: string;
  heading: string;
  subtitle: string;
  thumbnail: string;
  width: string;
  height: string;
  offset: { x: string; y: string };
  zIndex: number;
  isActive: boolean;
  fillBody?: boolean;
  constraintsRef: RefObject<HTMLElement | null>;
  onFocus: () => void;
  onClose: () => void;
  children: ReactNode;
}

export const DraggableWindow = forwardRef<HTMLDivElement, DraggableWindowProps>(
  function DraggableWindow(
    {
      title,
      heading,
      subtitle,
      thumbnail,
      width,
      height,
      offset,
      zIndex,
      isActive,
      fillBody = false,
      constraintsRef,
      onFocus,
      onClose,
      children,
    },
    ref,
  ) {
  const dragControls = useDragControls();
  const isPresent = useIsPresent();
  const reduceMotion = useReducedMotion();
  const appearTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: "easeOut" as const };

  return (
    <motion.div
      ref={ref}
      drag={isPresent}
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={constraintsRef}
      onPointerDown={onFocus}
      className="absolute"
      style={{
        left: offset.x,
        top: offset.y,
        width,
        height,
        zIndex,
        pointerEvents: isPresent ? "auto" : "none",
      }}
    >
      <motion.div
        className={`flex h-full min-h-0 w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl ${
          isActive ? "ring-1 ring-black/10" : ""
        }`}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={
          reduceMotion
            ? undefined
            : { opacity: 0, scale: 0.95, pointerEvents: "none" }
        }
        transition={appearTransition}
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          <div
            className={`relative flex h-6 cursor-grab items-center px-4 active:cursor-grabbing ${
              fillBody
                ? "border-b border-black/[0.06] bg-[#e1e2e1]"
                : "border-b border-gray-200 bg-gray-100"
            }`}
            onPointerDown={(event) => dragControls.start(event)}
          >
            <div className="relative z-10 flex items-center gap-2">
              <button
                type="button"
                aria-label="关闭窗口"
                className="h-3 w-3 rounded-full bg-[#ff5f57]"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={onClose}
              />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </div>
            {title ? (
              <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-700">
                {title}
              </p>
            ) : null}
          </div>

          {fillBody ? null : (
            <div className="flex items-center gap-3 px-5 py-4">
              <img
                src={thumbnail}
                alt=""
                draggable={false}
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-gray-900">{heading}</p>
                <p className="truncate text-sm text-gray-500">{subtitle}</p>
              </div>
            </div>
          )}

          <div
            className={
              fillBody
                ? "min-h-0 flex-1 overflow-hidden"
                : "min-h-0 flex-1 overflow-y-auto px-5 pb-5"
            }
            style={fillBody ? undefined : { maxHeight: "60vh" }}
          >
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
  },
);
