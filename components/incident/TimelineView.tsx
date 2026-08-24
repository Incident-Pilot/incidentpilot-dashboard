import type { TimelineEntry } from "@/types";

export function TimelineView({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-accent-muted">
        Timeline ({entries.length})
      </h3>
      {entries.length === 0 ? (
        <p className="mt-2 text-sm text-text-secondary">No timeline entries yet.</p>
      ) : (
        <ol className="mt-2 space-y-2 border-l-2 border-border pl-3">
          {entries.map((entry) => (
            <li key={`${entry.kind}-${entry.id}`} className="text-sm">
              <div className="text-xs text-text-muted">
                {new Date(entry.timestamp).toLocaleString()} · {entry.source}
              </div>
              <div className="text-text-primary">{entry.description}</div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
