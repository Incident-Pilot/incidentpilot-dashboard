import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Incident Pilot Dashboard",
  description: "Dashboard over the Observation Gateway and Intelligence Plane.",
};

// Runs before paint (a React effect would run after, causing a visible
// flash of the wrong theme) -- applies a stored explicit light/dark choice
// as data-theme on <html>. No stored choice means "follow the OS setting,"
// which globals.css's @media query already handles on its own; this script
// only needs to act when the user has overridden that via ThemeToggle.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var theme = localStorage.getItem("theme");
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-surface-1 text-text-primary antialiased">{children}</body>
    </html>
  );
}
