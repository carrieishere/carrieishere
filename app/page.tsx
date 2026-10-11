"use client";

import dynamic from "next/dynamic";
import { useDeviceMode } from "@/hooks/useDeviceMode";

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

export default function HomePage() {
  const mode = useDeviceMode();

  if (mode === null) {
    return <main className="h-screen w-full bg-black" aria-hidden />;
  }

  return mode === "mobile" ? <MobilePortfolio /> : <DesktopWorkspace />;
}
