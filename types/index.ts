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
// Mirrors incident_pilot_agent/api/schemas.py's InvestigationDetail
// (agentic_layer repo) exactly, captured 2026-08-26 by standing up that
// app against real trajectory files and curling
// GET /investigations/{incident_id} for a ROOT_CAUSE_CONFIRMED incident
// (INC-126C57F9) and an ESCALATED one (INC-B0A77F30). Replaces the old
// best-guess shape from the Hypothesis/Verification models directly —
// the real read API flattens/renames several fields (e.g. hypothesis
// detail is nested under `hypothesis`, there is no top-level
// `root_cause`/`confidence`/`causal_chain`, `iteration` not
// `iteration_count`). Keep in sync if incident_pilot_agent's schemas.py
// changes.
//
// `remediation_plan` and the `REMEDIATION_PROPOSED` phase added
// 2026-08-28, confirmed by running incident_pilot_agent/api/reader.py's
// actual get_investigation() against
// tests/fixtures/trajectories/inc-001-redis-cascade.trajectory.json (a
// real graph run, not hand-built -- see that repo's tests/test_api.py).
//
// `hypothesis.causal_chain`/`affected_services`/`actionable` added the
// same day once incident_pilot_agent wired them onto HypothesisSummary --
// reconfirmed by running get_investigation() against
// tests/fixtures/trajectories/inc-001-redis-cascade-actionable-fields.trajectory.json
// (also a real graph run; see that repo's tests/fixtures/trajectories/README.md
// and tests/test_api.py's
// test_get_investigation_includes_causal_chain_affected_services_actionable).
// That capture had `actionable: true`; `actionable: false` and an empty
// `affected_services` are real, reachable states (see
// incident_pilot_agent/llm/fake_client.py's "Insufficient evidence" path
// and graph/build.py's routing) but weren't captured with today's live
// payload -- the type still reflects them since the boolean/array shape
// itself is confirmed on the wire.
export type InvestigationPhase =
  | "DETECTED"
  | "INVESTIGATING"
  | "HYPOTHESIS_GENERATED"
  | "VERIFYING"
  | "ROOT_CAUSE_CONFIRMED"
  | "REMEDIATION_PROPOSED"
  | "VERIFICATION_FAILED"
  | "ESCALATED";

// Per-round verifier verdict — not the same concept as `phase`. An
// ESCALATED incident's last round still has verification_verdict
// "REJECTED" (its final hypothesis lost verification); ESCALATED itself
// only shows up in `phase`, never here.
export type VerificationVerdict = "CONFIRMED" | "REJECTED";

// Null until a hypothesis has been synthesized (phase DETECTED/early
// INVESTIGATING). No `root_cause` field — `description` is the closest
// analog. No `status`/`rejection_reason` here: those live on the
// Hypothesis model server-side but aren't exposed by this read API.
export interface InvestigationHypothesis {
  id: string;
  description: string;
  confidence: number; // 0.0 - 1.0
  supporting_evidence: string[];
  contradicting_evidence: string[];
  // Ordered cause -> effect narrative; order is meaningful, never sort it.
  causal_chain: string[];
  affected_services: string[];
  // False for a genuine "no anomaly / insufficient evidence" finding —
  // not a failure state, gates whether the remediation planner ran (see
  // graph/build.py). Only meaningful once phase reaches
  // ROOT_CAUSE_CONFIRMED/REMEDIATION_PROPOSED.
  actionable: boolean;
}

// Closed vocabulary mirroring RemediationAction.action_type
// (models/remediation.py). Extend here if the agent adds a new type.
export type RemediationActionType =
  | "rollback_deployment"
  | "scale_replicas"
  | "restart_pod"
  | "config_change"
  | "manual_investigation_required";

export type RemediationRiskLevel = "low" | "medium" | "high";

export interface RemediationAction {
  description: string;
  target: string;
  action_type: RemediationActionType;
  risk_level: RemediationRiskLevel;
  rationale: string;
}

// Mirrors RemediationPlanSummary (api/schemas.py) exactly -- note this is
// a narrower projection than the agent's internal RemediationPlan model:
// no `incident_id`/`generated_at`/`status` on the wire, just what the
// read API actually serializes.
export interface RemediationPlan {
  hypothesis_id: string;
  actions: RemediationAction[];
  disclaimer: string;
}

// GET /investigations/{incident_id}. 404 (body: { detail: string }) when
// no trajectory file exists yet for the incident — getInvestigation()
// maps that to null.
export interface Investigation {
  incident_id: string;
  phase: InvestigationPhase;
  iteration: number;
  hypothesis: InvestigationHypothesis | null;
  verification_verdict: VerificationVerdict | null;
  // Count only — the read API does not expose the rejected hypotheses'
  // descriptions/rejection reasons themselves, even though that data
  // exists in the agent's trajectory files. Worth requesting from
  // incident-pilot-agent if the UI ever needs to list them.
  rejected_hypotheses_count: number;
  updated_at: string;
  reasoning_summary: string;
  // Non-null only once phase reaches REMEDIATION_PROPOSED (a CONFIRMED,
  // actionable hypothesis that reached the remediation planner node).
  remediation_plan: RemediationPlan | null;
}
