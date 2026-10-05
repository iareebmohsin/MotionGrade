import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: "#0a0a0a",
        frame: "#0f0f0f",
        surface: "#151515",
        raised: "#1c1c1c",
        accent: {
          DEFAULT: "#e5f75a",
          hover: "#eefc86",
        },
        cream: "#e9dcb5",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      keyframes: {
        "score-reveal": {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(229,247,90,0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(229,247,90,0.35)" },
        },
        "border-pulse": {
          "0%, 100%": { borderColor: "rgba(255,255,255,0.12)" },
          "50%": { borderColor: "rgba(229,247,90,0.35)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "error-overlay": {
          "0%": { opacity: "0" },
          "12%": { opacity: "1" },
          "75%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "slide-down-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(12px)" },
        },
        scan: {
          "0%": { top: "4%" },
          "100%": { top: "96%" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.15" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "score-reveal": "score-reveal 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "slide-up": "slide-up 0.6s ease-out both",
        "slide-down": "slide-down 0.55s ease-out both",
        "fade-in": "fade-in 0.65s ease-out both",
        "fade-out": "fade-out 0.25s ease-in both",
        "slide-down-out": "slide-down-out 0.28s ease-in both",
        "error-overlay": "error-overlay 2s ease-in-out both",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "border-pulse": "border-pulse 2.5s ease-in-out infinite",
        scan: "scan 2.8s ease-in-out infinite alternate",
        twinkle: "twinkle 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
