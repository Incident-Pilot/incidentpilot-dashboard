// Server-only client for the Observation Gateway (incident-pilot-ecommerce).
//
// Import this ONLY from Next.js route handlers (app/api/**/route.ts) or
// Server Components — never from a "use client" file. GATEWAY_API_KEY must
// never reach the browser bundle.
import "server-only";

import type {
  Incident,
  IncidentDetail,
  Evidence,
  SourceStatusResponse,
  TimelineResponse,
  TopologyResponse,
} from "@/types";

const GATEWAY_URL = process.env.GATEWAY_URL;
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY;

export class GatewayConfigError extends Error {}
export class GatewayRequestError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function gatewayFetch<T>(path: string): Promise<T> {
  if (!GATEWAY_URL || !GATEWAY_API_KEY) {
    throw new GatewayConfigError(
      "GATEWAY_URL and GATEWAY_API_KEY must be set (see .env.example)",
    );
  }

  const res = await fetch(`${GATEWAY_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${GATEWAY_API_KEY}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new GatewayRequestError(
      `Gateway request to ${path} failed: ${res.status} ${body}`,
      res.status,
    );
  }

  return res.json() as Promise<T>;
}

export async function listIncidents(): Promise<Incident[]> {
  const data = await gatewayFetch<{ incidents: Incident[] }>("/incidents");
  return data.incidents;
}

export async function getIncident(incidentId: string): Promise<IncidentDetail> {
  return gatewayFetch<IncidentDetail>(`/incidents/${encodeURIComponent(incidentId)}`);
}

export async function getIncidentEvidence(incidentId: string): Promise<Evidence[]> {
  return gatewayFetch<Evidence[]>(`/incidents/${encodeURIComponent(incidentId)}/evidence`);
}

export async function getIncidentSourceStatus(
  incidentId: string,
): Promise<SourceStatusResponse> {
  return gatewayFetch<SourceStatusResponse>(
    `/incidents/${encodeURIComponent(incidentId)}/source-status`,
  );
}

export async function getIncidentTimeline(incidentId: string): Promise<TimelineResponse> {
  return gatewayFetch<TimelineResponse>(
    `/incidents/${encodeURIComponent(incidentId)}/timeline`,
  );
}

export async function getTopology(): Promise<TopologyResponse> {
  return gatewayFetch<TopologyResponse>("/topology");
}
