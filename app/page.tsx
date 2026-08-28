"use client";

import { useEffect, useMemo, useState } from "react";
import type { Incident, IncidentDetail } from "@/types";
import {
  fetchIncidents,
  fetchIncidentDetail,
  fetchIncidentEvidence,
  fetchIncidentSourceStatus,
  fetchIncidentTimeline,
  fetchInvestigation,
} from "@/lib/api-client";
import { FilterBar, type Filters } from "@/components/layout/FilterBar";
import { StatCards } from "@/components/layout/StatCards";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { IncidentList } from "@/components/incident/IncidentList";
import {
  IncidentDetailPanel,
  type IncidentDetailData,
} from "@/components/incident/IncidentDetailPanel";

const DEFAULT_FILTERS: Filters = { severity: "all", status: "all", search: "" };

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<IncidentDetailData | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  async function loadIncidents() {
    setError(null);
    try {
      const { incidents } = await fetchIncidents();
      incidents.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
      setIncidents(incidents);
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
    if (selectedId) {
      await loadDetail(selectedId);
    }
    setRefreshing(false);
  }

  async function loadDetail(incidentId: string) {
    setDetailError(null);
    setDetailData((prev) =>
      prev && prev.detail.incident_id === incidentId
        ? { ...prev, investigationLoading: true }
        : null,
    );
    try {
      const [detail, evidence, sourceStatusResponse, timelineResponse] = await Promise.all([
        fetchIncidentDetail(incidentId),
        fetchIncidentEvidence(incidentId),
        fetchIncidentSourceStatus(incidentId),
        fetchIncidentTimeline(incidentId),
      ]);

      setDetailData({
        detail,
        evidence,
        sourceStatus: sourceStatusResponse.source_status,
        timeline: timelineResponse.timeline,
        investigation: null,
        investigationLoading: true,
      });

      const investigation = await fetchInvestigation(incidentId).catch(() => null);
      setDetailData((prev) =>
        prev && prev.detail.incident_id === incidentId
          ? { ...prev, investigation, investigationLoading: false }
          : prev,
      );
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : "Failed to load incident detail");
      setDetailData(null);
    }
  }

  function handleSelect(id: string) {
    setSelectedId(id);
    loadDetail(id);
  }

  // The response from PATCH .../status is the same composite IncidentDetail
  // shape GET returns, so it can replace detailData.detail directly -- no
  // refetch needed. Also patches the matching row in the list/StatCards so
  // the status badge and counts update immediately without a full reload.
  function handleStatusChanged(updated: IncidentDetail) {
    setDetailData((prev) =>
      prev && prev.detail.incident_id === updated.incident_id ? { ...prev, detail: updated } : prev,
    );
    setIncidents((prev) =>
      prev.map((incident) => (incident.incident_id === updated.incident_id ? updated : incident)),
    );
  }

  const filteredIncidents = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return incidents.filter((incident) => {
      if (filters.severity !== "all" && incident.severity !== filters.severity) return false;
      if (filters.status !== "all" && incident.status !== filters.status) return false;
      if (search) {
        const haystack = `${incident.incident_id} ${incident.title} ${incident.affected_services.join(" ")}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });
  }, [incidents, filters]);

  return (
    <main className="mx-auto max-w-[1400px] space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Incident Pilot Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted">Manual refresh</span>
          <LogoutButton />
        </div>
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      <StatCards incidents={incidents} />

      {error && (
        <div className="rounded-md border border-danger-bg bg-danger-bg px-4 py-3 text-sm text-danger-text">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[45fr_55fr]">
        <div>
          {loading ? (
            <div className="rounded-lg border border-border bg-surface-2 px-4 py-8 text-center text-sm text-text-secondary">
              Loading incidents…
            </div>
          ) : (
            <IncidentList
              incidents={filteredIncidents}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          )}
        </div>

        <div>
          {detailError ? (
            <div className="rounded-md border border-danger-bg bg-danger-bg px-4 py-3 text-sm text-danger-text">
              {detailError}
            </div>
          ) : (
            <IncidentDetailPanel data={detailData} onStatusChanged={handleStatusChanged} />
          )}
        </div>
      </div>
    </main>
  );
}
