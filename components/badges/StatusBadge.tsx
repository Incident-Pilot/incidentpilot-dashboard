import type { IncidentStatus } from "@/types";

// The build spec's original status vocabulary (Confirmed/Investigating/
// Escalated) doesn't exist on the Gateway's real Incident model — its
// `status` field is only open/resolved/closed (see shared/models/incident.py
// and enums.py in incident-pilot-ecommerce). Per product decision, Phase 1
// renders the Gateway's real status values instead of inventing states the
// backend can't back up.
const STYLES: Record<IncidentStatus, string> = {
  open: "bg-accent-bg text-accent-text border-accent-border",
  resolved: "bg-success-bg text-success-text border-success-bg",
  closed: "bg-surface-1 text-text-secondary border-border",
};

const LABELS: Record<IncidentStatus, string> = {
  open: "Open",
  resolved: "Resolved",
  closed: "Closed",
};

export function StatusBadge({ status }: { status: IncidentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
