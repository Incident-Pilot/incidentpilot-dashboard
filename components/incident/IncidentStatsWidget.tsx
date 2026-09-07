import { Gauge } from "lucide-react";
import type { Investigation } from "@/types";
import { SidebarCard } from "@/components/layout/SidebarCard";

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className="font-medium text-text-primary">{value}</span>
    </div>
  );
}

// At-a-glance numbers for the incident, independent of whichever phase the
// investigation is in -- lets you tell "how big is this" without reading
// the full Root Cause card first.
export function IncidentStatsWidget({
  investigation,
  evidenceCount,
  affectedServiceCount,
}: {
  investigation: Investigation | null;
  evidenceCount: number;
  affectedServiceCount: number;
}) {
  return (
    <SidebarCard title="At a glance" icon={Gauge}>
      <div className="divide-y divide-border">
        <StatRow
          label="Confidence"
          value={investigation?.hypothesis ? `${Math.round(investigation.hypothesis.confidence * 100)}%` : "—"}
        />
        <StatRow label="Iterations" value={investigation?.iteration ?? "—"} />
        <StatRow label="Evidence items" value={evidenceCount} />
        <StatRow label="Affected services" value={affectedServiceCount} />
        <StatRow label="Rejected hypotheses" value={investigation?.rejected_hypotheses_count ?? "—"} />
      </div>
    </SidebarCard>
  );
}
