import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Incident Pilot Dashboard",
  description: "Dashboard over the Observation Gateway and Intelligence Plane.",
};

// Runs before paint (a React effect would run after, causing a visible
// flash of the wrong theme) -- resolves the active theme (a stored explicit
// choice, falling back to the OS preference) and always sets data-theme
// explicitly, so globals.css only needs one dark block, not one for the
// stored-choice case and a separate @media one for the OS-preference case.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-surface-1 font-sans text-text-primary antialiased">{children}</body>
    </html>
  );
}
