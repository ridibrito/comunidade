import type { Config } from "tailwindcss";

export default {
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
          accent: "#FF3D00",
          subtle: "#F5F7FA",
        },
      },
      screens: {
        "ultra": "2560px", // opcional: regras específicas p/ ultrawide
      },
    },
  },
  plugins: [],
} satisfies Config;


