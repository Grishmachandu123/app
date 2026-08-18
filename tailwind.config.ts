import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fffdf9",
          100: "#fdf8f0",
          200: "#f8efe1",
          300: "#f0e2cd",
        },
        gold: {
          50: "#fbf6ea",
          100: "#f3e7c8",
          200: "#e6d09a",
          300: "#d4b66a",
          400: "#c39c43",
          500: "#a97f2b",
          600: "#8a6520",
        },
        ink: {
          700: "#4a4038",
          800: "#332c26",
          900: "#1f1a16",
        },
        maroon: {
          600: "#8c2f39",
          700: "#6f2530",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(51, 44, 38, 0.18)",
        card: "0 2px 14px -8px rgba(51, 44, 38, 0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
