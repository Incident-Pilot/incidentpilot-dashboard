// Mirrors shared/models/{incident,evidence,enums}.py in incident-pilot-ecommerce
// (the Observation Gateway). Keep in sync if those models change.

export type IncidentStatus = "open" | "resolved" | "closed";

export type Severity = "critical" | "warning" | "info" | "unknown";

export type ObservationSource =
  | "prometheus"
  | "loki"
  | "tempo"
  | "kubernetes"
  | "alertmanager"
  | "git"
  | "trivy"
  | "gitleaks"
  | "manual";

export type EvidenceType =
  | "metric"
  | "log"
  | "trace"
  | "kubernetes_event"
  | "deployment"
  | "security"
  | "alert";

export type SourceStatusValue = "available" | "unavailable" | "timeout" | "partial";

export interface IncidentEvidenceSummary {
  id: string;
  type: EvidenceType;
  summary: string;
}

// GET /incidents -> { incidents: Incident[] }
export interface Incident {
  incident_id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  current_phase: string;
  created_at: string;
  updated_at: string;
  source: string;
  affected_services: string[];
  affected_namespace: string | null;
  initial_alerts: string[];
  root_cause: string | null;
  root_cause_confidence: number | null;
}

// GET /incidents/{id} -> Incident fields + observations/evidence/topology
export interface IncidentDetail extends Incident {
  observations: string[];
  evidence: IncidentEvidenceSummary[];
  topology: Record<string, string[]>;
}

// GET /incidents/{id}/evidence -> Evidence[]
export interface RawReference {
  query: string | null;
  trace_id: string | null;
  log_query: string | null;
  extra: Record<string, unknown>;
}

export interface Evidence {
  evidence_id: string;
  incident_id: string;
  type: EvidenceType;
  source: ObservationSource;
  timestamp: string;
  service: string | null;
  resource: string | null;
  summary: string;
  observation_id: string | null;
  raw_reference: RawReference;
}

// GET /incidents/{id}/source-status
export interface SourceStatusEntry {
  source: string;
  status: SourceStatusValue;
  error: string | null;
  observation_count: number;
}

export interface SourceStatusResponse {
  incident_id: string;
  source_status: SourceStatusEntry[];
}

// GET /incidents/{id}/timeline
export interface TimelineEntry {
  timestamp: string;
  kind: "observation" | "evidence";
  id: string;
  source: string;
  type?: EvidenceType;
  signal?: string;
  summary?: string;
  description: string;
}

export interface TimelineResponse {
  incident_id: string;
  timeline: TimelineEntry[];
}

// GET /topology -> { namespace, topology: adjacency list }
export interface TopologyResponse {
  namespace: string;
  topology: Record<string, string[]>;
}

// --- Intelligence Plane (incident-pilot-agent) read API ---
//
// Does not exist yet (see build prompt, Section 1/5). This is a
// best-guess shape based on the agent's Hypothesis/Verification models
// (incident_pilot_agent/models/{hypothesis,verification}.py) so
// getInvestigation()'s Phase 2 implementation is a one-function change,
// not a redesign. Treat every field as provisional until the real
// GET /investigations/{incident_id} endpoint is confirmed.
export type VerificationVerdict = "CONFIRMED" | "REJECTED";

export interface Investigation {
  incident_id: string;
  root_cause: string;
  causal_chain: string[];
  confidence: number; // 0.0 - 1.0
  affected_services: string[];
  supporting_evidence_ids: string[];
  contradicting_evidence_ids: string[];
  verification_verdict: VerificationVerdict | null;
  iteration_count: number;
  updated_at: string;
}
