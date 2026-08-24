import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          bg: "var(--color-accent-bg)",
          border: "var(--color-accent-border)",
          text: "var(--color-accent-text)",
          muted: "var(--color-accent-muted)",
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
    },
  },
  plugins: [],
};

export default config;
