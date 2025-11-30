import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        background: {
          default: "#0D0D0D",
          surface: "#141414",
          card: "#1A1A1A",
        },
        brand: {
          primary: "#FE3C00",
          "primary-hover": "#D93200",
          "accent-glow": "rgba(254, 60, 0, 0.15)",
        },
        text: {
          primary: "#F5F3EC",
          secondary: "#606060",
          tertiary: "#333333",
          inverse: "#0D0D0D",
        },
        utility: {
          "border-subtle": "#333333",
          "border-strong": "#606060",
          "grid-lines": "rgba(255, 255, 255, 0.05)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-inter-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "0.9", letterSpacing: "-0.04em", fontWeight: "700" }],
        "heading-lg": ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        "heading-md": ["1.5rem", { lineHeight: "1.2", letterSpacing: "0em", fontWeight: "500" }],
        "body-base": ["1rem", { lineHeight: "1.5", letterSpacing: "0em", fontWeight: "400" }],
        "mono-sm": ["0.875rem", { lineHeight: "1.4", letterSpacing: "0.02em", fontWeight: "400" }],
        "mono-xs": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "500" }],
      },
      borderRadius: {
        sm: "2px",
        md: "4px",
        lg: "8px",
        pill: "999px",
      },
      boxShadow: {
        "glow-brand": "0px 0px 40px -10px rgba(254, 60, 0, 0.3)",
        "card-hover": "0px 8px 24px -8px rgba(0, 0, 0, 0.8)",
        "inner-panel": "inset 0px 0px 20px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "grain": "url('/assets/noise-overlay.png')",
        "halftone-grid": "radial-gradient(#333 1px, transparent 1px)",
      },
      spacing: {
        "section": "160px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
