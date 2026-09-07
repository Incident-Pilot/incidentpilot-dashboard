import type { SourceStatusEntry } from "@/types";
import { SourceStatusDot } from "@/components/badges/SourceStatusDot";

const KNOWN_SOURCES = ["prometheus", "loki", "tempo", "kubernetes", "deployment", "alertmanager"] as const;

// Fixed 2-column: this now only ever renders inside the ~320px sidebar
// (see app/incidents/[id]/page.tsx), where 3 columns of dots would be
// cramped regardless of viewport width.
export function SourceStatusRow({ entries }: { entries: SourceStatusEntry[] }) {
  const bySource = new Map(entries.map((e) => [e.source, e]));

  return (
    <div className="grid grid-cols-2 gap-2">
      {KNOWN_SOURCES.map((source) => {
        const entry = bySource.get(source);
        return <SourceStatusDot key={source} source={source} status={entry ? entry.status : "unavailable"} />;
      })}
    </div>
  );
}
