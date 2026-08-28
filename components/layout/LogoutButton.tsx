"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loggingOut}
      className="rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-1 disabled:opacity-50"
    >
      {loggingOut ? "Signing out…" : "Sign out"}
    </button>
  );
}
