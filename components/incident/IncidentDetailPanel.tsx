import type {
  IncidentDetail,
  Evidence,
  SourceStatusEntry,
  TimelineEntry,
  Investigation,
} from "@/types";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { SeverityBadge } from "@/components/badges/SeverityBadge";
import { RootCauseCard } from "@/components/incident/RootCauseCard";
import { SourceStatusRow } from "@/components/incident/SourceStatusRow";
import { EvidenceList } from "@/components/incident/EvidenceList";
import { TopologyView } from "@/components/incident/TopologyView";
import { TimelineView } from "@/components/incident/TimelineView";
import { RemediationPlaceholder } from "@/components/incident/RemediationPlaceholder";
import { AssigneePlaceholder } from "@/components/incident/AssigneePlaceholder";

export interface IncidentDetailData {
  detail: IncidentDetail;
  evidence: Evidence[];
  sourceStatus: SourceStatusEntry[];
  timeline: TimelineEntry[];
  investigation: Investigation | null;
  investigationLoading: boolean;
}

export function IncidentDetailPanel({ data }: { data: IncidentDetailData | null }) {
  if (!data) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border border-border bg-surface-2 text-sm text-text-secondary">
        Select an incident to see its details.
      </div>
    );
  }

  const { detail, evidence, sourceStatus, timeline, investigation, investigationLoading } = data;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-surface-2 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs text-text-muted">{detail.incident_id}</span>
          <StatusBadge status={detail.status} />
        </div>
        <h2 className="mt-1 text-lg font-semibold text-text-primary">{detail.title}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <SeverityBadge severity={detail.severity} />
          <span className="text-sm text-text-secondary">
            {detail.affected_services.length > 0
              ? detail.affected_services.join(", ")
              : "No affected services recorded"}
            {detail.affected_namespace ? ` · ${detail.affected_namespace}` : ""}
          </span>
        </div>
      </div>

      <RootCauseCard investigation={investigation} loading={investigationLoading} />

      <div className="rounded-lg border border-border bg-surface-2 p-4">
        <SourceStatusRow entries={sourceStatus} />
      </div>

      <div className="rounded-lg border border-border bg-surface-2 p-4">
        <EvidenceList evidence={evidence} />
      </div>

      <div className="rounded-lg border border-border bg-surface-2 p-4">
        <TopologyView topology={detail.topology} />
      </div>

      <div className="rounded-lg border border-border bg-surface-2 p-4">
        <TimelineView entries={timeline} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RemediationPlaceholder investigation={investigation} />
        <AssigneePlaceholder />
      </div>
    </div>
  );
}
