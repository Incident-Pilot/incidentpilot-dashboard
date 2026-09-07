import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        accent: {
          bg: "var(--color-accent-bg)",
          border: "var(--color-accent-border)",
          text: "var(--color-accent-text)",
          muted: "var(--color-accent-muted)",
          // The one saturated "brand" color in the palette -- everything
          // else here is a pale tint meant for badges/backgrounds. Reserved
          // for primary actions and the one or two moments per page that
          // should read as genuinely emphasized, not just tinted.
          solid: "var(--color-accent-solid)",
          "solid-hover": "var(--color-accent-solid-hover)",
        },
        danger: {
          bg: "var(--color-danger-bg)",
          text: "var(--color-danger-text)",
        },
        warning: {
          bg: "var(--color-warning-bg)",
          text: "var(--color-warning-text)",
        },
        success: {
          bg: "var(--color-success-bg)",
          text: "var(--color-success-text)",
        },
        surface: {
          1: "var(--color-surface-1)",
          2: "var(--color-surface-2)",
        },
        border: "var(--color-border)",
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
        },
      },
      boxShadow: {
        // A single shared elevation token (tuned per-theme in globals.css)
        // instead of every component picking its own ad hoc shadow.
        card: "var(--shadow-card)",
      },
    },
  },
  plugins: [],
};

export default config;
