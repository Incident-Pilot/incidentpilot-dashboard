"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { TimelineEntry } from "@/types";
import { formatAbsoluteTime } from "@/lib/format-time";

const COLLAPSED_ENTRY_COUNT = 6;

export function TimelineView({ entries }: { entries: TimelineEntry[] }) {
  const [expanded, setExpanded] = useState(false);

  if (entries.length === 0) {
    return <p className="text-sm text-text-secondary">No timeline entries yet.</p>;
  }

  const hasMore = entries.length > COLLAPSED_ENTRY_COUNT;
  const visible = expanded ? entries : entries.slice(0, COLLAPSED_ENTRY_COUNT);

  return (
    <div>
      <ol className="space-y-2.5 border-l-2 border-border pl-3.5">
        {visible.map((entry) => (
          <li key={`${entry.kind}-${entry.id}`} className="text-sm">
            <div className="text-xs text-text-muted">
              {formatAbsoluteTime(entry.timestamp)} · {entry.source}
            </div>
            <div className="text-text-primary">{entry.description}</div>
          </li>
        ))}
      </ol>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent-text hover:underline"
        >
          <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
          {expanded ? "Show less" : `Show ${entries.length - COLLAPSED_ENTRY_COUNT} more`}
        </button>
      )}
    </div>
  );
}
