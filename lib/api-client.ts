// Browser-side fetch helpers. These call ONLY this app's own /api/* routes
// — never the Gateway or agent API directly — so no credentials ever need
// to reach client code.
import type {
  Incident,
  IncidentDetail,
  IncidentStatus,
  Evidence,
  SourceStatusResponse,
  TimelineResponse,
  Investigation,
} from "@/types";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request to ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function fetchIncidents(): Promise<{ incidents: Incident[] }> {
  return fetchJson("/api/incidents");
}

export function fetchIncidentDetail(id: string): Promise<IncidentDetail> {
  return fetchJson(`/api/incidents/${encodeURIComponent(id)}`);
}

export function fetchIncidentEvidence(id: string): Promise<Evidence[]> {
  return fetchJson(`/api/incidents/${encodeURIComponent(id)}/evidence`);
}

export function fetchIncidentSourceStatus(id: string): Promise<SourceStatusResponse> {
  return fetchJson(`/api/incidents/${encodeURIComponent(id)}/source-status`);
}

export function fetchIncidentTimeline(id: string): Promise<TimelineResponse> {
  return fetchJson(`/api/incidents/${encodeURIComponent(id)}/timeline`);
}

export function fetchInvestigation(id: string): Promise<Investigation | null> {
  return fetchJson(`/api/incidents/${encodeURIComponent(id)}/investigation`);
}

export async function updateIncidentStatus(
  id: string,
  status: Extract<IncidentStatus, "resolved" | "closed">,
): Promise<IncidentDetail> {
  const res = await fetch(`/api/incidents/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request to update status failed: ${res.status}`);
  }
  return res.json() as Promise<IncidentDetail>;
}
