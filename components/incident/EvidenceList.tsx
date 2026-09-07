"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Evidence, EvidenceType } from "@/types";
import { Pagination } from "@/components/layout/Pagination";

const TYPE_LABELS: Record<EvidenceType, string> = {
  metric: "Metric",
  log: "Log",
  trace: "Trace",
  kubernetes_event: "K8s event",
  deployment: "Deployment",
  security: "Security",
  alert: "Alert",
};

const PAGE_SIZE = 20;

export function EvidenceList({
  evidence,
  highlightId,
  onHighlighted,
}: {
  evidence: Evidence[];
  // Set by InvestigationSection when a citation (EvidenceCitation.tsx)
  // jumps here. EvidenceList is mounted only while its tab is active (see
  // InvestigationSection), so it can't reliably listen for that jump event
  // itself -- it may not exist in the DOM yet when the click happens. The
  // parent owns switching to this tab and handing over which ID to land
  // on; this component just reacts to that prop once it's mounted.
  highlightId?: string | null;
  onHighlighted?: () => void;
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<EvidenceType | "all">("all");
  const [page, setPage] = useState(1);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleTypeFilterChange(type: EvidenceType | "all") {
    setTypeFilter(type);
    setPage(1);
  }

  useEffect(() => {
    if (!highlightId) return;
    // The target row must win over whatever filter/page was active -- its
    // page is computed against the full (unfiltered) list, since that's
    // the ordering that's about to apply once filters clear. This reacts
    // to an explicit external action (a citation jump landing here via
    // InvestigationSection's highlightId prop), not state derived from
    // props on every render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch("");
    setTypeFilter("all");
    const index = evidence.findIndex((e) => e.evidence_id === highlightId);
    setPage(index >= 0 ? Math.floor(index / PAGE_SIZE) + 1 : 1);
    const timer = setTimeout(() => {
      const el = document.getElementById(highlightId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("citation-highlight");
        setTimeout(() => el.classList.remove("citation-highlight"), 2000);
      }
      onHighlighted?.();
    }, 50);
    return () => clearTimeout(timer);
  }, [highlightId, evidence, onHighlighted]);

  const availableTypes = useMemo(() => Array.from(new Set(evidence.map((e) => e.type))), [evidence]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return evidence.filter((e) => {
      if (typeFilter !== "all" && e.type !== typeFilter) return false;
      if (q) {
        const haystack = `${e.evidence_id} ${e.summary} ${e.service ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [evidence, search, typeFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (evidence.length === 0) {
    return <p className="text-sm text-text-secondary">No evidence collected for this incident.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted"
            aria-hidden
          />
          <input
            type="text"
            placeholder="Search evidence…"
            aria-label="Search evidence"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-1 py-1.5 pl-8 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-solid/40"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => handleTypeFilterChange("all")}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              typeFilter === "all" ? "bg-accent-bg text-accent-text" : "bg-surface-1 text-text-secondary hover:bg-surface-2"
            }`}
          >
            All ({evidence.length})
          </button>
          {availableTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeFilterChange(type)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                typeFilter === type ? "bg-accent-bg text-accent-text" : "bg-surface-1 text-text-secondary hover:bg-surface-2"
              }`}
            >
              {TYPE_LABELS[type]} ({evidence.filter((e) => e.type === type).length})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-3 text-sm text-text-secondary">No evidence matches your search.</p>
      ) : (
        <>
          <ul className="mt-3 space-y-2">
            {paged.map((e) => (
              <li
                key={e.evidence_id}
                id={e.evidence_id}
                className="rounded-lg border border-border bg-surface-1 px-3 py-2.5 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs text-text-muted">
                  <span className="font-mono">{e.evidence_id}</span>
                  <span className="capitalize">
                    {e.type.replace("_", " ")} · {e.source}
                  </span>
                </div>
                <p className="mt-1 text-sm text-text-primary">{e.summary}</p>
                {e.service && <p className="mt-0.5 text-xs text-text-secondary">service: {e.service}</p>}
              </li>
            ))}
          </ul>

          {pageCount > 1 && (
            <div className="mt-3">
              <Pagination page={page} pageCount={pageCount} onChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
