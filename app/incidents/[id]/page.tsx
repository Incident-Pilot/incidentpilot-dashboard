import Link from "next/link";
import { notFound } from "next/navigation";
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
import { IncidentTabs } from "@/components/incident/IncidentTabs";

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
    <main className="mx-auto max-w-[1400px] space-y-4 p-6">
      <Link href="/" className="text-sm text-accent-text hover:underline">
        ← Back to incidents
      </Link>

      <IncidentDetailHeader detail={detail} />

      <div className="mx-auto max-w-4xl">
        <InvestigationSection incidentId={incidentId} initialInvestigation={investigation} />
      </div>

      <IncidentTabs
        evidence={evidence}
        sourceStatus={sourceStatusResponse.source_status}
        timeline={timelineResponse.timeline}
        topology={detail.topology}
      />
    </main>
  );
}
