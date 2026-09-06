"use client";

import { useEffect, useMemo, useState } from "react";
import type { Incident, InvestigationSummary } from "@/types";
import { fetchIncidents, fetchInvestigationSummaries } from "@/lib/api-client";
import { FilterBar, type Filters } from "@/components/layout/FilterBar";
import { StatCards } from "@/components/layout/StatCards";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { Pagination } from "@/components/layout/Pagination";
import { IncidentList } from "@/components/incident/IncidentList";

const DEFAULT_FILTERS: Filters = { severity: "all", status: "all", search: "", actionableOnly: false };
const PAGE_SIZE = 20;

// Both phases are only ever reached for a CONFIRMED, actionable hypothesis
// that has a remediation plan proposed (see graph/build.py's routing in
// agentic_layer) -- REMEDIATION_PROPOSED is "just proposed",
// POSTMORTEM_GENERATED is "proposed, and the post-mortem also ran since".
// Either way, remediation is sitting there awaiting action.
const ACTIONABLE_PHASES = new Set(["REMEDIATION_PROPOSED", "POSTMORTEM_GENERATED"]);

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [investigations, setInvestigations] = useState<InvestigationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  async function loadIncidents() {
    setError(null);
    try {
      const [{ incidents }, investigations] = await Promise.all([
        fetchIncidents(),
        fetchInvestigationSummaries().catch(() => []),
      ]);
      incidents.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
      setIncidents(incidents);
      setInvestigations(investigations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load incidents");
    }
  }

  useEffect(() => {
    // Fetch-on-mount: setLoading(false) runs inside an async .finally, not
    // synchronously in the effect body, but the lint rule can't tell that.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadIncidents().finally(() => setLoading(false));
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await loadIncidents();
    setRefreshing(false);
  }

  function handleFiltersChange(next: Filters) {
    setFilters(next);
    setPage(1);
  }

  const actionableIds = useMemo(
    () => new Set(investigations.filter((inv) => ACTIONABLE_PHASES.has(inv.phase)).map((inv) => inv.incident_id)),
    [investigations],
  );

  const filteredIncidents = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return incidents.filter((incident) => {
      if (filters.severity !== "all" && incident.severity !== filters.severity) return false;
      if (filters.status !== "all" && incident.status !== filters.status) return false;
      // "Actionable" means open AND has a remediation plan awaiting action
      // -- a closed incident's old remediation plan isn't actionable
      // anymore, same reasoning as StatCards' own "Actionable now" count.
      if (filters.actionableOnly && (incident.status !== "open" || !actionableIds.has(incident.incident_id))) {
        return false;
      }
      if (search) {
        const haystack = `${incident.incident_id} ${incident.title} ${incident.affected_services.join(" ")}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });
  }, [incidents, filters, actionableIds]);

  const pageCount = Math.max(1, Math.ceil(filteredIncidents.length / PAGE_SIZE));
  const pagedIncidents = filteredIncidents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main className="mx-auto max-w-[1400px] space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Incident Pilot Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted">Manual refresh</span>
          <LogoutButton />
        </div>
      </div>

      <FilterBar filters={filters} onChange={handleFiltersChange} onRefresh={handleRefresh} refreshing={refreshing} />

      <StatCards incidents={incidents} actionableIds={actionableIds} />

      {error && (
        <div className="rounded-md border border-danger-bg bg-danger-bg px-4 py-3 text-sm text-danger-text">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border border-border bg-surface-2 px-4 py-8 text-center text-sm text-text-secondary">
          Loading incidents…
        </div>
      ) : (
        <>
          <IncidentList incidents={pagedIncidents} actionableIds={actionableIds} />
          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </>
      )}
    </main>
  );
}
