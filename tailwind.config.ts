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
        // Sombras elegantes inspiradas no Shadcn-ui
        g4: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "g4-hover": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "g4-dark": "0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.1)",
        "g4-dark-hover": "0 4px 6px -1px rgba(0, 0, 0, 0.25), 0 2px 4px -1px rgba(0, 0, 0, 0.15)",
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
          bg: "#F5F5F5", // Fundo principal com contraste
          surface: "#FFFFFF", // Cards brancos para contraste
          border: "rgba(15, 23, 42, 0.04)", // Borda muito sutil
          text: "#0F172A", // Texto mais escuro e legível
          muted: "#64748B", // Cinza mais elegante
        },
        dark: {
          bg: "#0A0A0A", // Fundo mais neutro
          surface: "#1A1A1A", // Surface mais refinada
          border: "rgba(255, 255, 255, 0.05)", // Borda muito sutil no dark
          text: "#FAFAFA", // Texto mais claro
          muted: "#A1A1AA", // Cinza mais claro
        },
      },
      screens: {
        "ultra": "2560px", // opcional: regras específicas p/ ultrawide
      },
    },
  },
  plugins: [],
} satisfies Config;


