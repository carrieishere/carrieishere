"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import type { ModalOrigin } from "@/types";
import "@/lib/photoboothSession";
import { DesktopStickyNotes } from "@/components/modals/macbook/DesktopStickyNotes";
import { DraggableWindow } from "@/components/modals/macbook/DraggableWindow";
import {
  ProjectWindowBody,
  SimpleWindowBody,
} from "@/components/modals/macbook/windowBodies";

const WindowChunkFallback = () => (
  <div className="h-full min-h-[8rem] w-full bg-neutral-100" aria-hidden />
);

const PhotosWindowBody = dynamic(
  () => import("@/components/modals/macbook/PhotosWindowBody"),
  { ssr: false, loading: WindowChunkFallback },
);

const MessagesWindowBody = dynamic(
  () =>
    import("@/components/modals/macbook/MessagesWindowBody").then((mod) => ({
      default: mod.MessagesWindowBody,
    })),
  { ssr: false, loading: WindowChunkFallback },
);

const NotesWindowBody = dynamic(
  () => import("@/components/modals/macbook/NotesWindowBody"),
  { ssr: false, loading: WindowChunkFallback },
);

const PhotoBoothWindowBody = dynamic(
  () => import("@/components/modals/macbook/PhotoBoothWindowBody"),
  { ssr: false, loading: WindowChunkFallback },
);

const KilalaWindowBody = dynamic(
  () => import("@/components/modals/macbook/KilalaWindowBody"),
  { ssr: false, loading: WindowChunkFallback },
);

const LohoWindowBody = dynamic(
  () => import("@/components/modals/macbook/LohoWindowBody"),
  { ssr: false, loading: WindowChunkFallback },
);

const ChxxxlWindowBody = dynamic(
  () => import("@/components/modals/macbook/ChxxxlWindowBody"),
  { ssr: false, loading: WindowChunkFallback },
);

const LilymlleWindowBody = dynamic(
  () => import("@/components/modals/macbook/LilymlleWindowBody"),
  { ssr: false, loading: WindowChunkFallback },
);

const MadebymeWindowBody = dynamic(
  () => import("@/components/modals/macbook/MadebymeWindowBody"),
  { ssr: false, loading: WindowChunkFallback },
);

const LilyMlleBrandImageWindowBody = dynamic(
  () => import("@/components/modals/macbook/LilyMlleBrandImageWindowBody"),
  { ssr: false, loading: WindowChunkFallback },
);

const PosterWindowBody = dynamic(
  () => import("@/components/modals/macbook/PosterWindowBody"),
  { ssr: false, loading: WindowChunkFallback },
);

const TataButterbearCollection = dynamic(
  () => import("@/components/modals/macbook/TataButterbearCollection"),
  { ssr: false, loading: WindowChunkFallback },
);

const TataButterbearCollection1 = dynamic(
  () => import("@/components/modals/macbook/TataButterbearCollection1"),
  { ssr: false, loading: WindowChunkFallback },
);

const TataTomAndJerry = dynamic(
  () => import("@/components/modals/macbook/TataTomAndJerry"),
  { ssr: false, loading: WindowChunkFallback },
);

const TataOtherShoots = dynamic(
  () => import("@/components/modals/macbook/TataOtherShoots"),
  { ssr: false, loading: WindowChunkFallback },
);

const TataOtherDesign = dynamic(
  () => import("@/components/modals/macbook/TataOtherDesign"),
  { ssr: false, loading: WindowChunkFallback },
);

const TataCny = dynamic(
  () => import("@/components/modals/macbook/TataCny"),
  { ssr: false, loading: WindowChunkFallback },
);

const ICON_DIR = "/assets/items/laptop/desktopIcons";
const DOCK_DIR = "/assets/items/laptop/mac-icons";
const WALLPAPER_DEFAULT = "/assets/items/laptop/new_wallpaper.webp";
const WALLPAPER_REVEALED = "/assets/items/laptop/wallpaper-revealed.webp";

const DESKTOP_ICONS = [
  { file: "Chxxxl.webp", label: "Chxxxl", left: "80%", top: "10%" },
  { file: "MadeByMe.webp", label: "MadeByMe", left: "87%", top: "60%" },
  { file: "tata-seasonal-campaigns.webp", label: "SeasonalCampaigns", left: "87%", top: "48%" },
  { file: "Loho.webp", label: "Loho", left: "87%", top: "23%" },
  { file: "LilyMlle-brand-image.webp", label: "LilyMlle-BrandImage", left: "87%", top: "73%" },
  { file: "Lily-Mlle.webp", label: "LilyMlle", left: "80%", top: "48%" },
  { file: "tata-tomandjerry.webp", label: "tata-tomandjerry", left: "80%", top: "75%" },
  {
    file: "tata-butterbear-collaction-1.webp",
    label: "tata-butterbear-collaction-1",
    left: "80%",
    top: "23%",
  },
  {
    file: "tata-butterbear-collaction-2.webp",
    label: "tata-butterbear-collaction-2",
    left: "80%",
    top: "60%",
  },
  { file: "Kilala.webp", label: "Kilala", left: "80%", top: "36%" },
  { file: "tata-cny.webp", label: "tata-cny", left: "87%", top: "10%" },
  { file: "tata-celebrity-collab.webp", label: "CelebrityCollab", left: "87%", top: "36%" },
  {
    file: "poster.webp",
    label: "Poster",
    left: "72%",
    top: "12%",
    iconSrc: "/assets/items/laptop/mac-icons/poster.webp",
  },
] as const;

const DOCK_ICONS = [
  { file: "message.webp", label: "Messages", kind: "messages" },
  { file: "photobooth.webp", label: "Photo Booth", kind: "photobooth" },
  { file: "instagram.webp", label: "Instagram", kind: "instagram", href: "https://www.instagram.com/carrieyhere/" },
  { file: "notes.webp", label: "Notes", kind: "notes" },
  { file: "photos.webp", label: "Photos", kind: "photos" },
  {
    file: "email.webp",
    label: "Mail",
    kind: "email",
    href: "mailto:woshiyangjiali@gmail.com",
  },
] as const;

type WindowKind = "project" | "kilala" | "loho" | "chxxxl" | "lilymlle" | "lilymlleBrandImage" | "madebyme" | "poster" | "tataButterbearCollection" | "tataButterbearCollection1" | "tataTomAndJerry" | "tataOtherShoots" | "tataOtherDesign" | "tataCny" | "notes" | "photos" | "messages" | "photobooth";

interface DesktopWindow {
  id: string;
  kind: WindowKind;
  title: string;
  heading: string;
  subtitle: string;
  thumbnail: string;
  width: string;
  height: string;
  offset: { x: string; y: string };
  zIndex: number;
  fillBody?: boolean;
}

interface MacbookModalProps {
  origin: ModalOrigin;
  onClose: () => void;
}

function cascadeOffset(index: number) {
  return {
    x: `${10 + (index % 5) * 3.5}%`,
    y: `${12 + (index % 5) * 4}%`,
  };
}

const DesktopWindowPane = memo(function DesktopWindowPane({
  window: pane,
  isActive,
  constraintsRef,
  onFocus,
  onClose,
}: {
  window: DesktopWindow;
  isActive: boolean;
  constraintsRef: RefObject<HTMLElement | null>;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
}) {
  return (
    <DraggableWindow
      title={pane.title}
      heading={pane.heading}
      subtitle={pane.subtitle}
      thumbnail={pane.thumbnail}
      width={pane.width}
      height={pane.height}
      offset={pane.offset}
      zIndex={pane.zIndex}
      isActive={isActive}
      fillBody={pane.fillBody}
      constraintsRef={constraintsRef}
      onFocus={() => onFocus(pane.id)}
      onClose={() => onClose(pane.id)}
    >
      {windowBody(pane.kind, pane.heading)}
    </DraggableWindow>
  );
});

function windowBody(kind: WindowKind, heading: string) {
  if (kind === "messages") return <MessagesWindowBody />;
  if (kind === "photos") return <PhotosWindowBody />;
  if (kind === "kilala") return <KilalaWindowBody />;
  if (kind === "loho") return <LohoWindowBody />;
  if (kind === "chxxxl") return <ChxxxlWindowBody />;
  if (kind === "lilymlle") return <LilymlleWindowBody />;
  if (kind === "lilymlleBrandImage") return <LilyMlleBrandImageWindowBody />;
  if (kind === "madebyme") return <MadebymeWindowBody />;
  if (kind === "poster") return <PosterWindowBody />;
  if (kind === "tataButterbearCollection") return <TataButterbearCollection />;
  if (kind === "tataButterbearCollection1") return <TataButterbearCollection1 />;
  if (kind === "tataTomAndJerry") return <TataTomAndJerry />;
  if (kind === "tataOtherShoots") return <TataOtherShoots />;
  if (kind === "tataOtherDesign") return <TataOtherDesign />;
  if (kind === "tataCny") return <TataCny />;
  if (kind === "project") return <ProjectWindowBody />;
  if (kind === "notes") return <NotesWindowBody />;
  if (kind === "photobooth") return <PhotoBoothWindowBody />;
  return <SimpleWindowBody label={heading} />;
}

function DesktopIcon({
  icon,
  desktopRef,
  onOpen,
}: {
  icon: (typeof DESKTOP_ICONS)[number];
  desktopRef: RefObject<HTMLDivElement | null>;
  onOpen: () => void;
}) {
  const iconRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  const updateConstraints = useCallback(() => {
    const parent = desktopRef.current;
    const node = iconRef.current;
    if (!parent || !node) return;

    setConstraints({
      left: -node.offsetLeft,
      right: parent.clientWidth - node.offsetLeft - node.offsetWidth,
      top: -node.offsetTop,
      bottom: parent.clientHeight - node.offsetTop - node.offsetHeight,
    });
  }, [desktopRef]);

  useLayoutEffect(() => {
    updateConstraints();
    const parent = desktopRef.current;
    if (!parent) return;

    const observer = new ResizeObserver(updateConstraints);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [updateConstraints]);

  return (
    <motion.div
      ref={iconRef}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={constraints}
      whileDrag={{ zIndex: 50 }}
      onTap={onOpen}
      className="group absolute z-10 w-24 max-w-[100px] cursor-grab active:cursor-grabbing"
      style={{ left: icon.left, top: icon.top }}
    >
      <div className="flex w-full origin-top flex-col items-center gap-1 transition-transform duration-200 group-hover:scale-125">
        <div className="h-14 w-14 shrink-0">
          <img
            src={"iconSrc" in icon ? icon.iconSrc : `${ICON_DIR}/${icon.file}`}
            alt={icon.label}
            draggable={false}
            className="pointer-events-none h-full w-full rounded-lg object-cover shadow-md"
          />
        </div>
        <p className="w-full break-words break-all text-center text-xs leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {icon.label}
        </p>
      </div>
    </motion.div>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 18 22" className="h-4 w-4 fill-white" aria-hidden>
      <path d="M14.7 11.6c0-2.5 2.1-3.7 2.2-3.8-1.2-1.8-3.1-2-3.8-2-1.6-.2-3.1 1-3.9 1s-2.1-1-3.5-1C3.7 5.9 1.8 7.1 1 9.1c-1.7 3-0.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2-.1 1.6-.8 3.1-.8s1.8.8 3.1.7c1.3 0 2.1-1.2 2.9-2.4.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.6-1-2.6-4.5zM12.2 4.2c.6-.8 1.1-1.9.9-3-0.9.1-2 .6-2.6 1.4-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.6-1.3z" />
    </svg>
  );
}

export function MacbookModal({ origin, onClose }: MacbookModalProps) {
  const desktopRef = useRef<HTMLDivElement>(null);
  const wallpaperRef = useRef<HTMLDivElement>(null);
  const zCounter = useRef(40);
  const [openWindows, setOpenWindows] = useState<DesktopWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [wallpaperRevealed, setWallpaperRevealed] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("native-cursor");
    const preload = new Image();
    preload.src = WALLPAPER_REVEALED;
    return () => document.documentElement.classList.remove("native-cursor");
  }, []);

  const openWindow = useCallback(
    (draft: Omit<DesktopWindow, "zIndex" | "offset"> & { offset?: DesktopWindow["offset"] }) => {
      zCounter.current += 1;
      setActiveWindowId(draft.id);
      setOpenWindows((prev) => {
        const existing = prev.find((window) => window.id === draft.id);
        if (existing) {
          return prev.map((window) =>
            window.id === draft.id ? { ...window, zIndex: zCounter.current } : window,
          );
        }
        return [
          ...prev,
          {
            ...draft,
            zIndex: zCounter.current,
            offset: draft.offset ?? cascadeOffset(prev.length),
          },
        ];
      });
    },
    [],
  );

  const focusWindow = useCallback((id: string) => {
    zCounter.current += 1;
    setActiveWindowId(id);
    setOpenWindows((prev) =>
      prev.map((window) =>
        window.id === id ? { ...window, zIndex: zCounter.current } : window,
      ),
    );
  }, []);

  const closeWindow = useCallback((id: string) => {
    if (id === "dock-photobooth") setWallpaperRevealed(true);
    setOpenWindows((prev) => prev.filter((window) => window.id !== id));
    setActiveWindowId((current) => (current === id ? null : current));
  }, []);

  const openProject = useCallback(
    (icon: (typeof DESKTOP_ICONS)[number]) => {
      const file = String(icon.file);
      const label = String(icon.label);
      const isKilala = file === "Kilala.webp";
      const isLoho = file === "Loho.webp";
      const isChxxxl = file === "Chxxxl.webp";
      const isLilymlle = file === "Lily-Mlle.webp";
      const isLilyMlleBrandImage = file === "LilyMlle-brand-image.webp";
      const isMadebyme = file === "MadeByMe.webp";
      const isPoster = label === "Poster";
      const isTataButterbearCollection =
        file === "tata-butterbear-collaction-2.webp";
      const isTataButterbearCollection1 =
        file === "tata-butterbear-collaction-1.webp";
      const isTataTomAndJerry = file === "tata-tomandjerry.webp";
      const isTataOtherShoots = file === "tata-seasonal-campaigns.webp";
      const isTataOtherDesign = file === "tata-celebrity-collab.webp";
      const isTataCny = file === "tata-cny.webp";
      const fillBody =
        isKilala ||
        isLoho ||
        isChxxxl ||
        isLilymlle ||
        isLilyMlleBrandImage ||
        isMadebyme ||
        isPoster ||
        isTataButterbearCollection ||
        isTataButterbearCollection1 ||
        isTataTomAndJerry ||
        isTataOtherShoots ||
        isTataOtherDesign ||
        isTataCny;
      const kind: WindowKind = isKilala
        ? "kilala"
        : isLoho
          ? "loho"
          : isChxxxl
            ? "chxxxl"
            : isLilymlle
              ? "lilymlle"
              : isLilyMlleBrandImage
                ? "lilymlleBrandImage"
                : isMadebyme
                  ? "madebyme"
                  : isPoster
                    ? "poster"
                    : isTataButterbearCollection
                      ? "tataButterbearCollection"
                      : isTataButterbearCollection1
                        ? "tataButterbearCollection1"
                        : isTataTomAndJerry
                          ? "tataTomAndJerry"
                          : isTataOtherShoots
                            ? "tataOtherShoots"
                            : isTataOtherDesign
                              ? "tataOtherDesign"
                              : isTataCny
                                ? "tataCny"
                                : "project";
      openWindow({
        id: `project-${file}`,
        kind,
        title: fillBody ? "" : `Information about: ${label}`,
        heading: label,
        subtitle: "Project",
        thumbnail: `${ICON_DIR}/${file}`,
        width: isPoster ? "36%" : "42%",
        height: isPoster ? "84%" : "74%",
        fillBody,
        offset: isPoster ? { x: "32%", y: "7%" } : undefined,
      });
    },
    [openWindow],
  );

  const openDockApp = useCallback(
    (icon: (typeof DOCK_ICONS)[number]) => {
      if (icon.kind === "email" || icon.kind === "instagram") return;
      const kind = icon.kind;
      const label = String(icon.label);
      const file = String(icon.file);
      const isNotes = kind === "notes";
      const isPhotos = kind === "photos";
      const isMessages = kind === "messages";
      const isPhotobooth = kind === "photobooth";
      openWindow({
        id: `dock-${kind}`,
        kind,
        title: "",
        heading: label,
        subtitle: isNotes ? "Personal" : "Application",
        thumbnail: `${DOCK_DIR}/${file}`,
        width: isPhotobooth
          ? "54%"
          : isNotes
            ? "54%"
            : isPhotos
              ? "40%"
              : isMessages
                ? "52%"
                : "38%",
        height: isPhotobooth
          ? "64%"
          : isNotes
            ? "72%"
            : isPhotos
              ? "60%"
              : isMessages
                ? "70%"
                : "62%",
        fillBody: true,
        offset: isPhotobooth
          ? { x: "13%", y: "7%" }
          : isPhotos
            ? { x: "13%", y: "7%" }
            : isMessages
              ? { x: "18%", y: "11%" }
              : isNotes
                ? { x: "20%", y: "10%" }
                : undefined,
      });
    },
    [openWindow],
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/35"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={wallpaperRef}
        className="relative h-full w-full"
        style={{ originX: origin.x, originY: origin.y }}
        initial={{ opacity: 0, scale: 0.18 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.4 }}
        transition={{ type: "spring", stiffness: 140, damping: 22 }}
        onClick={(event) => event.stopPropagation()}
      >
        <img
          key={wallpaperRevealed ? "revealed" : "default"}
          src={wallpaperRevealed ? WALLPAPER_REVEALED : WALLPAPER_DEFAULT}
          alt=""
          draggable={false}
          className="pointer-events-none absolute inset-0 z-0 h-full min-h-screen w-full object-cover object-center"
        />

        <div className="absolute inset-x-0 top-0 z-[90] flex h-8 items-center gap-3 bg-black/25 px-3 text-xs text-white/90 backdrop-blur-md">
          <button
            type="button"
            aria-label="关闭 MacBook 回到主页"
            className="grid h-6 w-6 place-items-center rounded hover:bg-white/10"
            onClick={onClose}
          >
            <AppleMark />
          </button>
          <span className="font-medium">Finder</span>
          <span className="text-white/60">File</span>
          <span className="text-white/60">Edit</span>
        </div>

        <div
          ref={desktopRef}
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "min(1920px, 100vw, calc(100vh * 16 / 10))",
            height: "min(1200px, 100vh, calc(100vw * 10 / 16))",
          }}
        >
          <div className="relative h-full w-full">
            {DESKTOP_ICONS.map((icon) => (
              <DesktopIcon
                key={icon.file}
                icon={icon}
                desktopRef={desktopRef}
                onOpen={() => openProject(icon)}
              />
            ))}
            <DesktopStickyNotes desktopRef={desktopRef} />
          </div>

          {openWindows.map((pane) => (
            <DesktopWindowPane
              key={pane.id}
              window={pane}
              isActive={pane.id === activeWindowId}
              constraintsRef={wallpaperRef}
              onFocus={focusWindow}
              onClose={closeWindow}
            />
          ))}
        </div>

        <div
          data-mac-dock
          className="absolute bottom-16 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/30 bg-white/20 p-2 shadow-2xl backdrop-blur-xl"
        >
          {DOCK_ICONS.map((icon) => {
            const isMail = icon.kind === "email";
            const isInstagram = icon.kind === "instagram";
            const isPhotobooth = icon.kind === "photobooth";
            const image = (
              <img
                src={`${DOCK_DIR}/${icon.file}`}
                alt={icon.label}
                draggable={false}
                className={`object-contain ${
                  isMail || isPhotobooth ? "h-[51px] w-[51px]" : "h-[60px] w-[60px]"
                }`}
              />
            );
            const className = `relative flex h-[60px] w-[60px] cursor-pointer items-center justify-center transition-transform duration-200 hover:scale-125`;

            if (isMail || isInstagram) {
              return (
                <a
                  key={icon.file}
                  href={icon.href}
                  title={icon.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {image}
                </a>
              );
            }

            return (
              <button
                key={icon.file}
                type="button"
                title={icon.label}
                className={className}
                onClick={() => openDockApp(icon)}
              >
                {image}
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default MacbookModal;
