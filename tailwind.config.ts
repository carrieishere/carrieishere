import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["selector", ".dark"],
  theme: {
    extend: {
      fontFamily: {
        "creato-black": ["var(--font-creato-black)", "sans-serif"],
        "creato-bold": ["var(--font-creato-bold)", "sans-serif"],
        "creato-medium": ["var(--font-creato-medium)", "sans-serif"],
        "creato-regular": ["var(--font-creato-medium)", "sans-serif"],
      },
    },
  },
  plugins: [],
  safelist: [
    "hover-item",
    "contain-paint",
    "isolation-auto",
    "transform-gpu",
    "translate-z-0",
    "will-change-transform",
  ],
};
export default config;
