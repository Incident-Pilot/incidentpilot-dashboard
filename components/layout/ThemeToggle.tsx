"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  // Starts null (not yet known client-side) rather than guessing light --
  // avoids briefly rendering the wrong label before the useEffect below
  // catches up to whatever app/layout.tsx's blocking script already
  // applied to the DOM.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // One-time read of an external system (localStorage/matchMedia) on
    // mount, not a cascading re-render source -- same exemption reasoning
    // as app/page.tsx's own fetch-on-mount effect.
    const stored = localStorage.getItem("theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(stored === "light" || stored === "dark" ? stored : getSystemTheme());
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={theme === null}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-1 disabled:opacity-50"
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
