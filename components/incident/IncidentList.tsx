"use client";

import type { Incident } from "@/types";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { SeverityBadge } from "@/components/badges/SeverityBadge";

export function IncidentList({
  incidents,
  selectedId,
  onSelect,
}: {
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (incidents.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface-2 px-4 py-8 text-center text-sm text-text-secondary">
        No incidents match the current filters.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface-2">
      {incidents.map((incident) => {
        const selected = incident.incident_id === selectedId;
        return (
          <li key={incident.incident_id}>
            <button
              type="button"
              onClick={() => onSelect(incident.incident_id)}
              aria-current={selected}
              className={`block w-full px-4 py-3 text-left transition-colors hover:bg-surface-1 ${
                selected ? "bg-accent-bg" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs font-mono text-text-muted">
                  {incident.incident_id}
                </span>
                <StatusBadge status={incident.status} />
              </div>
              <div className="mt-1 truncate text-sm font-medium text-text-primary">
                {incident.title}
              </div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <span className="truncate text-xs text-text-secondary">
                  {incident.affected_services.length > 0
                    ? incident.affected_services.join(", ")
                    : "No affected services recorded"}
                </span>
                <SeverityBadge severity={incident.severity} />
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
