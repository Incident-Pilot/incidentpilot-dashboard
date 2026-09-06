import type { Incident } from "@/types";

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 px-4 py-3">
      <div
        className={`text-xs font-medium uppercase tracking-wide ${
          accent ? "text-accent-muted" : "text-text-secondary"
        }`}
      >
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold text-text-primary">{value}</div>
    </div>
  );
}

export function StatCards({
  incidents,
  actionableIds,
}: {
  incidents: Incident[];
  // Optional: absent while investigation data hasn't loaded yet (or the
  // agent API isn't configured), in which case the card just reads 0
  // rather than blocking on a second fetch to render the other three.
  actionableIds?: Set<string>;
}) {
  const open = incidents.filter((i) => i.status === "open").length;
  const resolved = incidents.filter((i) => i.status === "resolved").length;
  const closed = incidents.filter((i) => i.status === "closed").length;
  // "Critical" = still-open incidents at critical severity, i.e. what most
  // urgently needs attention right now (see StatusBadge.tsx for why this
  // replaces the spec's original "Escalated" bucket, which has no backing
  // field on the Gateway's Incident model).
  const critical = incidents.filter((i) => i.status === "open" && i.severity === "critical").length;
  const actionable = actionableIds
    ? incidents.filter((i) => i.status === "open" && actionableIds.has(i.incident_id)).length
    : 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      <StatCard label="Open" value={open} accent />
      <StatCard label="Resolved" value={resolved} />
      <StatCard label="Closed" value={closed} />
      <StatCard label="Critical" value={critical} />
      <StatCard label="Actionable now" value={actionable} accent />
    </div>
  );
}
