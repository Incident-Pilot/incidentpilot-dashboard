// Browser-side fetch helpers. These call ONLY this app's own /api/* routes
// — never the Gateway or agent API directly — so no credentials ever need
// to reach client code.
import type { Incident, IncidentDetail, IncidentStatus, Investigation, InvestigationSummary } from "@/types";

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

// Note: incident detail/evidence/source-status/timeline are fetched
// server-side directly via lib/gateway.ts in app/incidents/[id]/page.tsx
// (a Server Component) -- no client-side equivalent needed for those.

export function fetchInvestigation(id: string): Promise<Investigation | null> {
  return fetchJson(`/api/incidents/${encodeURIComponent(id)}/investigation`);
}

// Powers the "actionable now" view on the list page -- one call covering
// every investigated incident, rather than fetching each one individually.
export function fetchInvestigationSummaries(): Promise<InvestigationSummary[]> {
  return fetchJson("/api/investigations");
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

export async function invokeInvestigation(id: string): Promise<{ message: string; incident_id: string }> {
  const res = await fetch(`/api/incidents/${encodeURIComponent(id)}/investigate`, {
    method: "POST",
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Failed to invoke investigation: ${res.status}`);
  }
  return res.json() as Promise<{ message: string; incident_id: string }>;
}
