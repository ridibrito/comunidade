import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "clamp(24px,3vw,64px)",
      screens: { "2xl": "1600px" }, // trava container em telas ultrawide
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,.08)",
        subtle: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
        "subtle-dark": "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)",
        // Sombras suaves com blur (sem borda forte)
        g4: "0px 2px 8px rgba(0, 0, 0, 0.04), 0px 1px 3px rgba(0, 0, 0, 0.08)",
        "g4-hover": "0px 4px 12px rgba(0, 0, 0, 0.06), 0px 2px 6px rgba(0, 0, 0, 0.12)",
        "g4-dark": "0px 2px 8px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.25)",
        "g4-dark-hover": "0px 4px 12px rgba(0, 0, 0, 0.2), 0px 2px 6px rgba(0, 0, 0, 0.3)",
      },
      spacing: {
        xs: "8px",
        sm: "16px",
        md: "24px",
        lg: "32px",
        xl: "48px",
        "2xl": "64px",
        "3xl": "96px",
      },
      colors: {
        brand: {
          DEFAULT: "#0A2540",
          accent: "#43085E", // Roxo de acento
          subtle: "#F5F7FA",
        },
        light: {
          bg: "#FAFAFA", // Cor clean para light mode
          surface: "#FFFFFF",
          border: "rgba(0, 0, 0, 0.05)", // Borda sutil
          text: "#111827",
          muted: "#6B7280",
        },
        dark: {
          bg: "#0A000A", // Cor personalizada para dark mode
          surface: "#1F2937",
          border: "rgba(255, 255, 255, 0.08)", // Borda sutil
          text: "#F9FAFB",
          muted: "#9CA3AF",
        },
      },
      screens: {
        "ultra": "2560px", // opcional: regras específicas p/ ultrawide
      },
    },
  },
  plugins: [],
} satisfies Config;


