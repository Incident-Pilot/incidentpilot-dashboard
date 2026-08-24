"use client";

import type { Severity, IncidentStatus } from "@/types";

export interface Filters {
  severity: Severity | "all";
  status: IncidentStatus | "all";
  search: string;
}

export function FilterBar({
  filters,
  onChange,
  onRefresh,
  refreshing,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        aria-label="Filter by severity"
        className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary"
        value={filters.severity}
        onChange={(e) => onChange({ ...filters, severity: e.target.value as Filters["severity"] })}
      >
        <option value="all">All severities</option>
        <option value="critical">Critical</option>
        <option value="warning">Warning</option>
        <option value="info">Info</option>
        <option value="unknown">Unknown</option>
      </select>

      <select
        aria-label="Filter by status"
        className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary"
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value as Filters["status"] })}
      >
        <option value="all">All statuses</option>
        <option value="open">Open</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      <input
        type="text"
        placeholder="Search incidents…"
        aria-label="Search incidents"
        className="min-w-[220px] flex-1 rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />

      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-text-primary hover:bg-surface-1 disabled:opacity-50"
      >
        {refreshing ? "Refreshing…" : "Refresh"}
      </button>
    </div>
  );
}
