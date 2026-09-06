"use client";

import { useState } from "react";
import type { Evidence, SourceStatusEntry, TimelineEntry } from "@/types";
import { EvidenceList } from "@/components/incident/EvidenceList";
import { TopologyView } from "@/components/incident/TopologyView";
import { TimelineView } from "@/components/incident/TimelineView";
import { SourceStatusRow } from "@/components/incident/SourceStatusRow";

type TabKey = "evidence" | "topology" | "timeline" | "source-status";

const TABS: { key: TabKey; label: string }[] = [
  { key: "evidence", label: "Evidence" },
  { key: "topology", label: "Topology" },
  { key: "timeline", label: "Timeline" },
  { key: "source-status", label: "Source status" },
];

export function IncidentTabs({
  evidence,
  sourceStatus,
  timeline,
  topology,
}: {
  evidence: Evidence[];
  sourceStatus: SourceStatusEntry[];
  timeline: TimelineEntry[];
  topology: Record<string, string[]>;
}) {
  const [active, setActive] = useState<TabKey>("evidence");

  return (
    <div className="rounded-lg border border-border bg-surface-2 p-4">
      <div className="flex flex-wrap gap-1 border-b border-border pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            aria-current={active === tab.key}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              active === tab.key ? "bg-accent-bg text-accent-text" : "text-text-secondary hover:bg-surface-1"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {active === "evidence" && <EvidenceList evidence={evidence} />}
        {active === "topology" && <TopologyView topology={topology} />}
        {active === "timeline" && <TimelineView entries={timeline} />}
        {active === "source-status" && <SourceStatusRow entries={sourceStatus} />}
      </div>
    </div>
  );
}
