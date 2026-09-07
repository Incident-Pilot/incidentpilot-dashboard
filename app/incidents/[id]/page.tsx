import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Activity, History, Share2 } from "lucide-react";
import {
  getIncident,
  getIncidentEvidence,
  getIncidentSourceStatus,
  getIncidentTimeline,
  GatewayRequestError,
} from "@/lib/gateway";
import { getInvestigation } from "@/lib/investigation";
import { IncidentDetailHeader } from "@/components/incident/IncidentDetailHeader";
import { InvestigationSection } from "@/components/incident/InvestigationSection";
import { IncidentStatsWidget } from "@/components/incident/IncidentStatsWidget";
import { TopologyView } from "@/components/incident/TopologyView";
import { TimelineView } from "@/components/incident/TimelineView";
import { SourceStatusRow } from "@/components/incident/SourceStatusRow";
import { AssigneePlaceholder } from "@/components/incident/AssigneePlaceholder";
import { SidebarCard } from "@/components/layout/SidebarCard";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const incidentId = decodeURIComponent(id);

  let detail;
  try {
    detail = await getIncident(incidentId);
  } catch (err) {
    if (err instanceof GatewayRequestError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  const [evidence, sourceStatusResponse, timelineResponse, investigation] = await Promise.all([
    getIncidentEvidence(incidentId),
    getIncidentSourceStatus(incidentId),
    getIncidentTimeline(incidentId),
    getInvestigation(incidentId),
  ]);

  return (
    <main className="mx-auto max-w-[1400px] space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-text transition-opacity hover:opacity-80"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to incidents
        </Link>
        <ThemeToggle />
      </div>

      <IncidentDetailHeader detail={detail} />

      {/* Dashboard grid, not a single centered column: main content
          (root cause / remediation / post-mortem / evidence, navigated via
          tabs -- see InvestigationSection) stays the focus, while status/
          topology/timeline/assignee are always-visible widgets in a sticky
          sidebar -- glanceable at once, the way a dashboard reads, rather
          than a report you scroll through top to bottom. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-4">
          <InvestigationSection incidentId={incidentId} initialInvestigation={investigation} evidence={evidence} />
        </div>

        <div className="min-w-0 space-y-4 lg:sticky lg:top-6 lg:self-start">
          <IncidentStatsWidget
            investigation={investigation}
            evidenceCount={evidence.length}
            affectedServiceCount={detail.affected_services.length}
          />
          <SidebarCard title="Source status" icon={Activity}>
            <SourceStatusRow entries={sourceStatusResponse.source_status} />
          </SidebarCard>
          <SidebarCard title="Topology" icon={Share2}>
            <TopologyView topology={detail.topology} />
          </SidebarCard>
          <SidebarCard title="Timeline" icon={History}>
            <TimelineView entries={timelineResponse.timeline} />
          </SidebarCard>
          <AssigneePlaceholder />
        </div>
      </div>
    </main>
  );
}
