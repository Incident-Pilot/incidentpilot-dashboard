"use client";

import { useEffect, useRef, useState } from "react";
import { Database, FileText, RadioTower, Search, Wrench } from "lucide-react";
import type { Evidence, Investigation, InvestigationPhase } from "@/types";
import { fetchInvestigation } from "@/lib/api-client";
import { RootCauseCard } from "@/components/incident/RootCauseCard";
import { RemediationPlaceholder } from "@/components/incident/RemediationPlaceholder";
import { PostMortemPlaceholder } from "@/components/incident/PostMortemPlaceholder";
import { EvidenceList } from "@/components/incident/EvidenceList";
import { EVIDENCE_JUMP_EVENT } from "@/components/incident/EvidenceCitation";

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

type TabKey = "root-cause" | "remediation" | "postmortem" | "evidence";

export function InvestigationSection({
  incidentId,
  initialInvestigation,
  evidence,
}: {
  incidentId: string;
  initialInvestigation: Investigation | null;
  evidence: Evidence[];
}) {
  const [investigation, setInvestigation] = useState(initialInvestigation);
  const [loading, setLoading] = useState(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<Date | null>(null);
  const [active, setActive] = useState<TabKey>("root-cause");
  const [pendingEvidenceId, setPendingEvidenceId] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // A citation (EvidenceCitation.tsx, rendered from RootCauseCard/
  // RemediationCard/PostMortemCard) needs to switch to the Evidence tab
  // before EvidenceList even exists in the DOM to scroll to -- this owns
  // that switch, since it's the component holding `active`.
  useEffect(() => {
    function handleJump(event: Event) {
      setActive("evidence");
      setPendingEvidenceId((event as CustomEvent<string>).detail);
    }
    window.addEventListener(EVIDENCE_JUMP_EVENT, handleJump);
    return () => window.removeEventListener(EVIDENCE_JUMP_EVENT, handleJump);
  }, []);

  const isWatching = investigation === null || IN_PROGRESS_PHASES.includes(investigation.phase);

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
      setLastCheckedAt(new Date());
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

  const tabs: { key: TabKey; label: string; icon: typeof Search }[] = [
    { key: "root-cause", label: "Root cause", icon: Search },
    { key: "remediation", label: "Remediation", icon: Wrench },
    { key: "postmortem", label: "Post-mortem", icon: FileText },
    { key: "evidence", label: "Evidence", icon: Database },
  ];

  return (
    <div className="space-y-3">
      {isWatching && (
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <RadioTower className="h-3 w-3 animate-pulse text-accent-solid" aria-hidden />
          Watching for updates
          {lastCheckedAt && <span>· last checked {lastCheckedAt.toLocaleTimeString()}</span>}
        </div>
      )}

      {/* One section visible at a time -- root cause, remediation, and
          post-mortem together plus a full evidence list is a lot to take
          in as one continuous scroll; navigating between them reads more
          like a dashboard drill-down than a report.

          The tab bar is its own compact strip, separate from the content
          below -- RootCauseCard/RemediationCard/PostMortemCard/EvidenceList
          each already render full card chrome (border, shadow, a colored
          status accent that's meaningful, not decorative), so nesting them
          inside a second card here would just be a frame around a frame. */}
      <div className="inline-flex flex-wrap gap-1 rounded-xl border border-border bg-surface-2 p-1.5 shadow-card">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              aria-current={isActive}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive ? "bg-accent-bg text-accent-text" : "text-text-secondary hover:bg-surface-1"
              }`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {tab.label}
              {tab.key === "evidence" && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] leading-none ${
                    isActive ? "bg-accent-solid/15 text-accent-text" : "bg-surface-1 text-text-muted"
                  }`}
                >
                  {evidence.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {active === "root-cause" && (
        <RootCauseCard
          investigation={investigation}
          loading={loading}
          incidentId={incidentId}
          onInvestigationStarted={handleInvestigationStarted}
        />
      )}
      {active === "remediation" && <RemediationPlaceholder investigation={investigation} />}
      {active === "postmortem" && <PostMortemPlaceholder investigation={investigation} />}
      {active === "evidence" && (
        <div className="rounded-xl border border-border bg-surface-2 p-4 shadow-card">
          <EvidenceList
            evidence={evidence}
            highlightId={pendingEvidenceId}
            onHighlighted={() => setPendingEvidenceId(null)}
          />
        </div>
      )}
    </div>
  );
}
