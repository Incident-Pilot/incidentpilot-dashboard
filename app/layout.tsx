import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Incident Pilot Dashboard",
  description: "Read-only view over the Observation Gateway and Intelligence Plane.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface-1 text-text-primary antialiased">{children}</body>
    </html>
  );
}
