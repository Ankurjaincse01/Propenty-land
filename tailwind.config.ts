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
        forest: {
          DEFAULT: "#0F291E",
          50: "#EDF5F0",
          100: "#D3E5DA",
          200: "#A7CBB5",
          300: "#7BB090",
          400: "#4F956B",
          500: "#2F7A4D",
          600: "#1E5B39",
          700: "#143628",
          800: "#0F291E",
          900: "#081711",
        },
        navy: {
          DEFAULT: "#0F172A",
          50: "#F1F5F9",
          100: "#E2E8F0",
          200: "#CBD5E1",
          300: "#94A3B8",
          400: "#64748B",
          500: "#475569",
          600: "#334155",
          700: "#1E293B",
          800: "#0F172A",
          900: "#080D18",
        },
        alabaster: "#FAF8F5",
        stone: "#F3F0EA",
        gold: {
          DEFAULT: "#C5A059",
          50: "#FBF7EF",
          100: "#F5EBD7",
          200: "#EAD6AF",
          300: "#DCC084",
          400: "#C5A059",
          500: "#B08A3E",
          600: "#8F6E2F",
          700: "#6E5424",
          800: "#4D3A19",
          900: "#2C210E",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        editorial: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.12)",
        card: "0 1px 3px rgba(15,23,42,0.06), 0 12px 32px -16px rgba(15,23,42,0.18)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
