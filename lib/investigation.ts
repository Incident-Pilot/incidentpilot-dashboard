// Server-only client for the Intelligence Plane's read API
// (incident-pilot-agent). That API does not exist yet (build prompt,
// Section 1/5) — GET /investigations/{incident_id} is planned but not
// built. Phase 1 always returns null so the dashboard renders an honest
// "no investigation data available yet" state instead of an error or a
// fake placeholder.
//
// Phase 2: once incident-pilot-agent exposes the endpoint, replace the
// body of getInvestigation() with a real fetch (mirroring lib/gateway.ts's
// pattern — server-side only, Bearer/whatever-auth from env vars
// AGENT_API_URL / AGENT_API_KEY). The Investigation return type is
// already defined in types/index.ts so no caller needs to change.
import "server-only";

import type { Investigation } from "@/types";

const AGENT_API_URL = process.env.AGENT_API_URL;

export async function getInvestigation(incidentId: string): Promise<Investigation | null> {
  if (!AGENT_API_URL) {
    // Expected in Phase 1: the agent read API isn't built yet.
    return null;
  }

  // Phase 2 implementation goes here once the real endpoint exists:
  //
  // const res = await fetch(`${AGENT_API_URL}/investigations/${encodeURIComponent(incidentId)}`, {
  //   headers: { Authorization: `Bearer ${process.env.AGENT_API_KEY}` },
  //   cache: "no-store",
  // });
  // if (res.status === 404) return null;
  // if (!res.ok) throw new Error(`Agent API request failed: ${res.status}`);
  // return res.json() as Promise<Investigation>;

  void incidentId;
  return null;
}
