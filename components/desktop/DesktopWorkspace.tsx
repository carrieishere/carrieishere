"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { CanvasItems } from "@/components/CanvasItems";
import { CustomCursor } from "@/components/CustomCursor";
import { CinematicIntro } from "@/components/intro/CinematicIntro";
import { ChatEasterEggProvider, useChatEasterEgg } from "@/components/chat/ChatEasterEggProvider";
import { useCinematicIntro } from "@/hooks/useCinematicIntro";
import { CAMERA_BODY_SRC, CAMERA_PHOTOS, preloadCameraAssets } from "@/lib/cameraAssets";
import type { ModalOrigin, ModalType } from "@/types";

const ModalChunkFallback = () => (
  <div className="pointer-events-none fixed inset-0 z-[70] bg-white/25" aria-hidden />
);

const MacbookModal = dynamic(() => import("@/components/modals/MacbookModal"), {
  ssr: false,
  loading: ModalChunkFallback,
});

const NotebookModal = dynamic(
  () =>
    import("@/components/modals/NotebookModal").then((mod) => ({
      default: mod.NotebookModal,
    })),
  { ssr: false, loading: ModalChunkFallback },
);

const CameraModal = dynamic(
  () =>
    import("@/components/modals/CameraModal").then((mod) => ({
      default: mod.CameraModal,
    })),
  { ssr: false, loading: ModalChunkFallback },
);

function DesktopScene() {
  const chat = useChatEasterEgg();
  const closeChat = chat?.closeChat;
  const setChatUnlocked = chat?.setChatUnlocked;
  const [activeModal, setActiveModal] = useState<ModalType>("NONE");
  const [notebookPage, setNotebookPage] = useState(1);
  const [cameraPhotoIndex, setCameraPhotoIndex] = useState(0);
  const [modalOrigin, setModalOrigin] = useState<ModalOrigin>({ x: 0.5, y: 0.5 });
  const intro = useCinematicIntro(activeModal !== "NONE");

  const closeModal = useCallback(() => setActiveModal("NONE"), []);

  const openModal = useCallback((type: ModalType, event?: React.MouseEvent) => {
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setModalOrigin({
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      });
    }
    closeChat?.();
    setActiveModal(type);
  }, [closeChat]);

  useEffect(() => {
    const links = [CAMERA_BODY_SRC, CAMERA_PHOTOS[0]!].map((href) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = href;
      document.head.appendChild(link);
      return link;
    });
    const timeout = window.setTimeout(() => preloadCameraAssets(), 400);
    return () => {
      links.forEach((link) => link.remove());
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  useLayoutEffect(() => {
    const html = document.documentElement;
    if (intro.phase === "ready") {
      html.classList.remove("native-cursor");
      setChatUnlocked?.(true);
      return () => setChatUnlocked?.(false);
    }
    html.classList.add("native-cursor");
    setChatUnlocked?.(false);
    return () => html.classList.remove("native-cursor");
  }, [intro.phase, setChatUnlocked]);

  const sceneReady = intro.phase === "ready";

  return (
    <main
      data-intro-phase={intro.phase}
      className={`home-page relative h-screen w-full overflow-hidden ${
        sceneReady ? "is-ready bg-white" : "bg-black"
      }`}
    >
      <motion.div
        className={`absolute inset-0 bg-white ${sceneReady ? "home-scene" : ""}`}
        style={{
          clipPath: intro.clipActive ? intro.clipPath : "none",
          willChange: intro.masking ? "clip-path" : undefined,
          pointerEvents: sceneReady ? "auto" : "none",
        }}
      >
        <motion.div
          className="h-full w-full"
          style={{
            filter: intro.isFiltering ? intro.filter : undefined,
            transform: intro.isFiltering ? "translateZ(0)" : undefined,
            willChange: intro.isFiltering ? "filter" : undefined,
          }}
        >
          <CanvasItems
            onOpenModal={openModal}
            sceneReady={sceneReady}
            activeModal={activeModal}
          />
        </motion.div>
      </motion.div>

      <CinematicIntro
        phase={intro.phase}
        origin={intro.origin}
        hasOrigin={intro.hasOrigin}
        onTypingComplete={intro.markIdle}
        onOrigin={intro.setOrigin}
      />

      {activeModal === "MACBOOK" ? (
        <MacbookModal origin={modalOrigin} onClose={closeModal} />
      ) : null}
      {activeModal === "NOTEBOOK" ? (
        <NotebookModal
          page={notebookPage}
          onPageChange={setNotebookPage}
          onClose={closeModal}
        />
      ) : null}
      {activeModal === "CAMERA" ? (
        <CameraModal
          photoIndex={cameraPhotoIndex}
          onPhotoIndexChange={setCameraPhotoIndex}
          onClose={closeModal}
        />
      ) : null}
      <CustomCursor />
    </main>
  );
}

export function DesktopWorkspace() {
  return (
    <ChatEasterEggProvider>
      <DesktopScene />
    </ChatEasterEggProvider>
  );
}
