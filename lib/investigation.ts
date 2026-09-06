// Server-only client for the Intelligence Plane's read API
// (incident-pilot-agent). Mirrors lib/gateway.ts's pattern: server-side
// only, Bearer auth, `cache: "no-store"`, typed error classes.
//
// Phase 1 fallback preserved: when AGENT_API_URL isn't set, getInvestigation()
// returns null so the dashboard renders an honest "no investigation data
// available yet" state instead of an error.
import "server-only";

import type { Investigation, InvestigationSummary } from "@/types";

const AGENT_API_URL = process.env.AGENT_API_URL;
const AGENT_API_KEY = process.env.AGENT_API_KEY;

export class AgentApiRequestError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function getInvestigation(incidentId: string): Promise<Investigation | null> {
  if (!AGENT_API_URL) {
    // Expected when the agent API isn't configured in this environment.
    return null;
  }

  const res = await fetch(
    `${AGENT_API_URL}/investigations/${encodeURIComponent(incidentId)}`,
    {
      headers: { Authorization: `Bearer ${AGENT_API_KEY}` },
      cache: "no-store",
    },
  );

  if (res.status === 404) {
    // No trajectory file for this incident yet — not an error.
    return null;
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new AgentApiRequestError(
      `Agent API request to /investigations/${incidentId} failed: ${res.status} ${body}`,
      res.status,
    );
  }

  return res.json() as Promise<Investigation>;
}

// GET /investigations -- used to compute which incidents are "actionable
// now" (see InvestigationSummary's own doc comment) across the whole list
// in one call. Same fallback as getInvestigation(): an unconfigured agent
// API means no investigation data exists yet, not an error.
export async function listInvestigations(): Promise<InvestigationSummary[]> {
  if (!AGENT_API_URL) {
    return [];
  }

  const res = await fetch(`${AGENT_API_URL}/investigations`, {
    headers: { Authorization: `Bearer ${AGENT_API_KEY}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new AgentApiRequestError(`Agent API request to /investigations failed: ${res.status} ${body}`, res.status);
  }

  return res.json() as Promise<InvestigationSummary[]>;
}
