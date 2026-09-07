import Link from "next/link";
import { Zap } from "lucide-react";
import type { Incident } from "@/types";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { SeverityBadge } from "@/components/badges/SeverityBadge";
import { formatRelativeTime } from "@/lib/format-time";

export function IncidentList({
  incidents,
  actionableIds,
}: {
  incidents: Incident[];
  actionableIds?: Set<string>;
}) {
  if (incidents.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface-2 px-4 py-10 text-center text-sm text-text-secondary shadow-card">
        No incidents match the current filters.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface-2 shadow-card">
      {incidents.map((incident) => (
        <li key={incident.incident_id}>
          <Link
            href={`/incidents/${encodeURIComponent(incident.incident_id)}`}
            className="block w-full px-4 py-3.5 text-left transition-colors hover:bg-surface-1"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-mono text-text-muted">{incident.incident_id}</span>
              <div className="flex items-center gap-1.5">
                {incident.status === "open" && actionableIds?.has(incident.incident_id) && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-warning-bg bg-warning-bg px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-warning-text">
                    <Zap className="h-2.5 w-2.5" aria-hidden />
                    Actionable
                  </span>
                )}
                <StatusBadge status={incident.status} />
              </div>
            </div>
            <div className="mt-1 truncate text-sm font-medium text-text-primary">{incident.title}</div>
            <div className="mt-0.5 text-xs text-text-muted">{formatRelativeTime(incident.created_at)}</div>
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <span className="truncate text-xs text-text-secondary">
                {incident.affected_services.length > 0
                  ? incident.affected_services.join(", ")
                  : "No affected services recorded"}
              </span>
              <SeverityBadge severity={incident.severity} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
