import type { SourceStatusEntry } from "@/types";
import { SourceStatusDot } from "@/components/badges/SourceStatusDot";

const KNOWN_SOURCES = [
  "prometheus",
  "loki",
  "tempo",
  "kubernetes",
  "deployment",
  "alertmanager",
] as const;

export function SourceStatusRow({ entries }: { entries: SourceStatusEntry[] }) {
  const bySource = new Map(entries.map((e) => [e.source, e]));

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-accent-muted">
        Source status
      </h3>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {KNOWN_SOURCES.map((source) => {
          const entry = bySource.get(source);
          return (
            <SourceStatusDot
              key={source}
              source={source}
              status={entry ? entry.status : "unavailable"}
            />
          );
        })}
      </div>
    </div>
  );
}
