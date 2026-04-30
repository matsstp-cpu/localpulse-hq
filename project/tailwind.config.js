import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#020609",
        surface: "#0a0f14",
        surfaceHover: "#111820",
        border: "rgba(255, 255, 255, 0.05)",
        accent: {
          DEFAULT: "#22d3ee",
          hover: "#06b6d4",
          glow: "rgba(34, 211, 238, 0.15)",
        },
        muted: "#64748b",
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.0) 100%)',
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(34, 211, 238, 0.15)",
        card: "0 4px 24px -1px rgba(0, 0, 0, 0.2)",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
export default config;
