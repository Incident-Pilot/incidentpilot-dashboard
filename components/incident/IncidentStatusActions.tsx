"use client";

import { useState } from "react";
import type { IncidentDetail } from "@/types";
import { updateIncidentStatus } from "@/lib/api-client";

// Only ever shown for "open" incidents -- once resolved/closed there is no
// path back to open via this UI (matches the Gateway's own restriction),
// so the buttons simply stop rendering rather than becoming disabled.
export function IncidentStatusActions({
  detail,
  onStatusChanged,
}: {
  detail: IncidentDetail;
  onStatusChanged: (updated: IncidentDetail) => void;
}) {
  const [pending, setPending] = useState<"resolved" | "closed" | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (detail.status !== "open") {
    return null;
  }

  async function handleChange(status: "resolved" | "closed", confirmMessage: string) {
    // window.confirm blocks synchronously -- the write below never runs
    // unless the operator explicitly accepts.
    if (!window.confirm(confirmMessage)) {
      return;
    }
    setError(null);
    setPending(status);
    try {
      const updated = await updateIncidentStatus(detail.incident_id, status);
      onStatusChanged(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {error && <span className="text-xs text-danger-text">{error}</span>}
      <button
        type="button"
        disabled={pending !== null}
        onClick={() =>
          handleChange("resolved", "Are you sure you want to mark this incident as resolved?")
        }
        className="rounded-md border border-success-bg bg-success-bg px-3 py-1.5 text-sm font-medium text-success-text hover:opacity-90 disabled:opacity-50"
      >
        {pending === "resolved" ? "Resolving…" : "Resolve"}
      </button>
      <button
        type="button"
        disabled={pending !== null}
        onClick={() =>
          handleChange(
            "closed",
            "Are you sure you want to cancel this incident? It will be marked as closed.",
          )
        }
        className="rounded-md border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-surface-1 disabled:opacity-50"
      >
        {pending === "closed" ? "Cancelling…" : "Cancel"}
      </button>
    </div>
  );
}
