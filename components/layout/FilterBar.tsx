"use client";

import { RefreshCw, Search } from "lucide-react";
import type { Severity, IncidentStatus } from "@/types";

export interface Filters {
  severity: Severity | "all";
  status: IncidentStatus | "all";
  search: string;
  // Restricts the list to incidents with a proposed remediation plan
  // awaiting action (phase REMEDIATION_PROPOSED or POSTMORTEM_GENERATED,
  // still open) -- see app/page.tsx's actionableIds computation.
  actionableOnly: boolean;
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
        className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary shadow-card transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-solid/40"
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
        className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary shadow-card transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-solid/40"
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value as Filters["status"] })}
      >
        <option value="all">All statuses</option>
        <option value="open">Open</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden />
        <input
          type="text"
          placeholder="Search incidents…"
          aria-label="Search incidents"
          className="w-full rounded-lg border border-border bg-surface-2 py-2 pl-9 pr-3 text-sm text-text-primary shadow-card transition-colors placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-solid/40"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>

      <label className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary shadow-card">
        <input
          type="checkbox"
          checked={filters.actionableOnly}
          onChange={(e) => onChange({ ...filters, actionableOnly: e.target.checked })}
          className="accent-accent-solid"
        />
        Actionable only
      </label>

      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-text-primary shadow-card transition-colors hover:bg-surface-1 disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden />
        {refreshing ? "Refreshing…" : "Refresh"}
      </button>
    </div>
  );
}
