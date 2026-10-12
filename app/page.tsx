"use client";

import dynamic from "next/dynamic";
import { useDeviceMode, useMobileFramePreview } from "@/hooks/useDeviceMode";

const DesktopWorkspace = dynamic(
  () =>
    import("@/components/desktop/DesktopWorkspace").then((mod) => ({
      default: mod.DesktopWorkspace,
    })),
  { ssr: false },
);

const MobilePortfolio = dynamic(
  () =>
    import("@/components/mobile/MobilePortfolio").then((mod) => ({
      default: mod.MobilePortfolio,
    })),
  { ssr: false },
);

const MobilePreviewFrame = dynamic(
  () =>
    import("@/components/mobile/MobilePreviewFrame").then((mod) => ({
      default: mod.MobilePreviewFrame,
    })),
  { ssr: false },
);

export default function HomePage() {
  const mode = useDeviceMode();
  const framePreview = useMobileFramePreview();

  if (mode === null || framePreview === null) {
    return <main className="h-screen w-full bg-white" aria-hidden />;
  }

  if (framePreview) {
    return <MobilePreviewFrame />;
  }

  return mode === "mobile" ? <MobilePortfolio /> : <DesktopWorkspace />;
}
