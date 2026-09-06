import type { IncidentDetail } from "@/types";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { SeverityBadge } from "@/components/badges/SeverityBadge";
import { IncidentStatusActions } from "@/components/incident/IncidentStatusActions";
import { formatAbsoluteTime } from "@/lib/format-time";

export function IncidentDetailHeader({ detail }: { detail: IncidentDetail }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs text-text-muted">{detail.incident_id}</span>
        <StatusBadge status={detail.status} />
      </div>
      <h1 className="mt-1 text-lg font-semibold text-text-primary">{detail.title}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <SeverityBadge severity={detail.severity} />
        <span className="text-sm text-text-secondary">
          {detail.affected_services.length > 0
            ? detail.affected_services.join(", ")
            : "No affected services recorded"}
          {detail.affected_namespace ? ` · ${detail.affected_namespace}` : ""}
        </span>
      </div>
      <div className="mt-1 text-sm text-text-secondary">Reported {formatAbsoluteTime(detail.created_at)}</div>
      <div className="mt-3">
        <IncidentStatusActions detail={detail} />
      </div>
    </div>
  );
}
