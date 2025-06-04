import type { Config } from "tailwindcss";
import scrollbarHide from 'tailwind-scrollbar-hide'

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000F89",
        secondary: "#190482",
        accent: "#7752FE",
        highlight: "#8E8FFA",
        soft: "#C2D9FF",
        danger: "#e00202",
        white: "#ffffff",
        black: "#000000"
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [scrollbarHide],
} satisfies Config;
