import type { IncidentDetail, Severity } from "@/types";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { SeverityBadge } from "@/components/badges/SeverityBadge";
import { IncidentStatusActions } from "@/components/incident/IncidentStatusActions";
import { formatAbsoluteTime } from "@/lib/format-time";

// A quiet visual cue for how urgent this incident is, echoing the same
// colored-left-border language RootCauseCard uses for its confirmed state
// -- ties the two most prominent elements on the page together.
const SEVERITY_ACCENT: Record<Severity, string> = {
  critical: "border-l-danger-text",
  warning: "border-l-warning-text",
  info: "border-l-border",
  unknown: "border-l-border",
};

export function IncidentDetailHeader({ detail }: { detail: IncidentDetail }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-2 shadow-card">
      <div className={`border-l-4 p-5 ${SEVERITY_ACCENT[detail.severity]}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs text-text-muted">{detail.incident_id}</span>
          <StatusBadge status={detail.status} />
        </div>
        <h1 className="mt-1.5 text-xl font-semibold tracking-tight text-text-primary">{detail.title}</h1>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <SeverityBadge severity={detail.severity} />
          <span className="text-sm text-text-secondary">
            {detail.affected_services.length > 0
              ? detail.affected_services.join(", ")
              : "No affected services recorded"}
            {detail.affected_namespace ? ` · ${detail.affected_namespace}` : ""}
          </span>
        </div>
        <div className="mt-1.5 text-sm text-text-secondary">Reported {formatAbsoluteTime(detail.created_at)}</div>
        <div className="mt-4">
          <IncidentStatusActions detail={detail} />
        </div>
      </div>
    </div>
  );
}
