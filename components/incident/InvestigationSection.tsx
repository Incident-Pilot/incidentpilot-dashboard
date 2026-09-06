"use client";

import { useEffect, useRef, useState } from "react";
import type { Investigation, InvestigationPhase } from "@/types";
import { fetchInvestigation } from "@/lib/api-client";
import { RootCauseCard } from "@/components/incident/RootCauseCard";
import { RemediationPlaceholder } from "@/components/incident/RemediationPlaceholder";
import { PostMortemPlaceholder } from "@/components/incident/PostMortemPlaceholder";
import { AssigneePlaceholder } from "@/components/incident/AssigneePlaceholder";

// Mirrors RootCauseCard's own IN_PROGRESS_PHASES -- while the investigation
// is in one of these phases, this section polls the agent API directly
// (not router.refresh(), which would re-run the whole Server Component
// page including the Gateway evidence/timeline/topology fetches) so the
// root cause / remediation / post-mortem cards update live without an
// unnecessary full-page refetch.
const IN_PROGRESS_PHASES: InvestigationPhase[] = [
  "DETECTED",
  "INVESTIGATING",
  "HYPOTHESIS_GENERATED",
  "VERIFYING",
  "VERIFICATION_FAILED",
];

const POLL_INTERVAL_MS = 5000;

export function InvestigationSection({
  incidentId,
  initialInvestigation,
}: {
  incidentId: string;
  initialInvestigation: Investigation | null;
}) {
  const [investigation, setInvestigation] = useState(initialInvestigation);
  const [loading, setLoading] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopPolling() {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }

  function startPolling() {
    stopPolling();
    pollingRef.current = setInterval(async () => {
      const latest = await fetchInvestigation(incidentId).catch(() => null);
      setInvestigation(latest);
      if (latest && !IN_PROGRESS_PHASES.includes(latest.phase)) {
        stopPolling();
      }
    }, POLL_INTERVAL_MS);
  }

  useEffect(() => {
    if (investigation === null || IN_PROGRESS_PHASES.includes(investigation.phase)) {
      startPolling();
    }
    return stopPolling;
    // Intentionally runs once on mount -- incidentId is stable for the
    // lifetime of this component (a new incident means a new page/mount).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleInvestigationStarted() {
    setLoading(true);
    // POST /investigations/{id} returns 202 before a trajectory file
    // necessarily exists yet -- give it a moment before the first poll,
    // same reasoning the previous single-page version used.
    setTimeout(() => {
      setLoading(false);
      startPolling();
    }, 1000);
  }

  return (
    <div className="space-y-4">
      <RootCauseCard
        investigation={investigation}
        loading={loading}
        incidentId={incidentId}
        onInvestigationStarted={handleInvestigationStarted}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RemediationPlaceholder investigation={investigation} />
        <AssigneePlaceholder />
      </div>

      <PostMortemPlaceholder investigation={investigation} />
    </div>
  );
}
