"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { MobileHome } from "@/components/mobile/MobileHome";
import { MobileIntro } from "@/components/mobile/MobileIntro";
import { useMobileIntro } from "@/components/mobile/useMobileIntro";

export function MobilePortfolio() {
  const intro = useMobileIntro();
  const sceneReady = intro.phase === "ready";

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = sceneReady ? "" : "hidden";
    body.style.overflow = sceneReady ? "" : "hidden";
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [sceneReady]);

  return (
    <main
      data-mobile-intro={intro.phase}
      className={`relative min-h-screen w-full ${
        sceneReady ? "bg-white" : "h-screen overflow-hidden bg-black"
      }`}
    >
      <motion.div
        className="absolute inset-0 bg-white"
        style={{
          clipPath: intro.clipActive ? intro.clipPath : "none",
          willChange: intro.masking ? "clip-path" : undefined,
          pointerEvents: sceneReady ? "auto" : "none",
        }}
      >
        <motion.div
          className="h-full min-h-screen w-full"
          style={{
            filter: intro.isFiltering ? intro.filter : undefined,
            transform: intro.isFiltering ? "translateZ(0)" : undefined,
            willChange: intro.isFiltering ? "filter" : undefined,
          }}
        >
          <MobileHome />
        </motion.div>
      </motion.div>

      <MobileIntro
        phase={intro.phase}
        origin={intro.origin}
        hasOrigin={intro.hasOrigin}
        onTypingComplete={intro.markIdle}
        onOrigin={intro.setOrigin}
        onReveal={intro.reveal}
      />
    </main>
  );
}
