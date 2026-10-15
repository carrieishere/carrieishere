import type { ReactNode } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeRoot } from "@/components/ThemeRoot";
import "./globals.css";

const creatoBlack = localFont({
  src: "./fonts/CreatoDisplay-Black.otf",
  variable: "--font-creato-black",
  display: "swap",
  weight: "900",
});

const creatoBold = localFont({
  src: "./fonts/CreatoDisplay-Bold.otf",
  variable: "--font-creato-bold",
  display: "swap",
  weight: "700",
});

const creatoMedium = localFont({
  src: "./fonts/CreatoDisplay-Medium.otf",
  variable: "--font-creato-medium",
  display: "swap",
  weight: "500",
});

export const metadata: Metadata = {
  title: "carriey",
  description: "CARRIE YANG — Designer/Art Director",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${creatoBlack.variable} ${creatoBold.variable} ${creatoMedium.variable} antialiased bg-white text-black`}
      >
        <ThemeRoot>{children}</ThemeRoot>
      </body>
    </html>
  );
}
