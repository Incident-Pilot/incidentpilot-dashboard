"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Search } from "lucide-react";
import type { Investigation, InvestigationPhase } from "@/types";
import { invokeInvestigation } from "@/lib/api-client";
import { CitedText, jumpToEvidence } from "@/components/incident/EvidenceCitation";

function SectionTitle({ icon: Icon, title }: { icon: typeof Search; title: string }) {
  return (
    <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent-muted">
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {title}
    </h3>
  );
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-1">
        <div className="h-full rounded-full bg-accent-solid" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-text-primary">{pct}%</span>
    </div>
  );
}

const IN_PROGRESS_PHASES: InvestigationPhase[] = [
  "DETECTED",
  "INVESTIGATING",
  "HYPOTHESIS_GENERATED",
  "VERIFYING",
  "VERIFICATION_FAILED",
];

export function RootCauseCard({
  investigation,
  loading,
  incidentId,
  onInvestigationStarted,
}: {
  investigation: Investigation | null;
  loading: boolean;
  incidentId?: string;
  onInvestigationStarted?: () => void;
}) {
  const [invoking, setInvoking] = useState(false);
  const [invocationError, setInvocationError] = useState<string | null>(null);

  async function handleInvestigate() {
    if (!incidentId) return;
    setInvoking(true);
    setInvocationError(null);
    try {
      await invokeInvestigation(incidentId);
      onInvestigationStarted?.();
    } catch (err) {
      setInvocationError(err instanceof Error ? err.message : "Failed to start investigation");
    } finally {
      setInvoking(false);
    }
  }
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-surface-2 p-5 shadow-card">
        <SectionTitle icon={Loader2} title="Root cause" />
        <p className="mt-2.5 flex items-center gap-2 text-sm text-text-secondary">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Loading investigation data…
        </p>
      </div>
    );
  }

  if (!investigation) {
    return (
      <div className="rounded-xl border border-border bg-surface-2 p-5 shadow-card">
        <SectionTitle icon={Search} title="Root cause" />
        <p className="mt-2.5 text-sm text-text-secondary">
          No investigation data available yet. Start the investigation to analyze this incident.
        </p>
        {invocationError && <p className="mt-2 text-sm text-danger-text">{invocationError}</p>}
        <div className="mt-4">
          <button
            onClick={handleInvestigate}
            disabled={invoking}
            className="inline-flex items-center gap-2 rounded-lg bg-accent-solid px-4 py-2 text-sm font-medium text-white shadow-card transition-colors hover:bg-accent-solid-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {invoking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Starting investigation…
              </>
            ) : (
              <>
                <Search className="h-4 w-4" aria-hidden />
                Investigate
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  const { phase, hypothesis, rejected_hypotheses_count, iteration, reasoning_summary } = investigation;

  if (IN_PROGRESS_PHASES.includes(phase)) {
    return (
      <div className="rounded-xl border border-border bg-surface-2 p-5 shadow-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <SectionTitle icon={Loader2} title="Root cause" />
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-surface-1 px-2.5 py-0.5 text-xs font-medium text-text-secondary">
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
            Investigation in progress
          </span>
        </div>

        <p className="mt-2.5 text-sm text-text-secondary">
          {hypothesis
            ? `Leading hypothesis (round ${iteration}): ${hypothesis.description}`
            : `Still gathering evidence (round ${iteration}) — no hypothesis yet.`}
        </p>
        {hypothesis && (
          <div className="mt-4">
            <ConfidenceBar confidence={hypothesis.confidence} />
          </div>
        )}
      </div>
    );
  }

  if (phase === "ESCALATED") {
    return (
      <div className="rounded-xl border border-warning-bg bg-surface-2 p-5 shadow-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <SectionTitle icon={AlertTriangle} title="Root cause" />
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-warning-bg bg-warning-bg px-2.5 py-0.5 text-xs font-medium text-warning-text">
            <AlertTriangle className="h-3 w-3" aria-hidden />
            Escalated — no root cause confirmed
          </span>
        </div>

        <p className="mt-2.5 text-sm text-text-primary">
          {rejected_hypotheses_count} hypothes{rejected_hypotheses_count === 1 ? "is" : "es"} tried across{" "}
          {iteration} round{iteration === 1 ? "" : "s"}; none survived verification.
        </p>

        {hypothesis && (
          <div className="mt-3">
            <div className="text-xs font-medium text-text-secondary">Last hypothesis considered</div>
            <p className="mt-1 text-sm text-text-primary">
              <CitedText text={hypothesis.description} />
            </p>
          </div>
        )}

        <p className="mt-3 text-xs text-text-secondary">{reasoning_summary}</p>

        <p className="mt-3 text-xs italic text-text-secondary">
          The read API only reports a rejected-hypothesis count, not the individual hypotheses or their
          rejection reasons — that detail exists in the agent&rsquo;s trajectory data but isn&rsquo;t exposed
          here yet.
        </p>
      </div>
    );
  }

  // phase === "ROOT_CAUSE_CONFIRMED", "REMEDIATION_PROPOSED", or
  // "POSTMORTEM_GENERATED" — all three show the same confirmed root-cause
  // card; remediation and post-mortem themselves render separately in
  // RemediationPlaceholder/RemediationCard and
  // PostMortemPlaceholder/PostMortemCard. This is the actual "answer" the
  // whole system exists to produce, so it gets the strongest visual
  // treatment on the page: a colored left accent, bigger type.
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-2 shadow-card">
      <div className="border-l-4 border-l-success-text p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <SectionTitle icon={CheckCircle2} title="Root cause" />
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-success-bg bg-success-bg px-2.5 py-0.5 text-xs font-medium text-success-text">
            <CheckCircle2 className="h-3 w-3" aria-hidden />
            Confirmed
          </span>
        </div>

        {hypothesis && (
          <>
            <p className="mt-3 text-base font-medium leading-snug text-text-primary">
              <CitedText text={hypothesis.description} />
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-text-secondary">
              <div className="flex items-center gap-2">
                <span className="font-medium text-text-primary">Confidence</span>
                <ConfidenceBar confidence={hypothesis.confidence} />
              </div>
              <div>
                <span className="font-medium text-text-primary">{iteration}</span> iteration
                {iteration === 1 ? "" : "s"}
              </div>
            </div>

            {hypothesis.causal_chain.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-medium text-text-secondary">Causal chain</div>
                <ol className="mt-2">
                  {hypothesis.causal_chain.map((step, index) => (
                    <li key={index} className="flex gap-2.5">
                      <div className="flex flex-col items-center">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-solid text-[10px] font-semibold text-white">
                          {index + 1}
                        </div>
                        {index < hypothesis.causal_chain.length - 1 && (
                          <div className="w-px flex-1 bg-border" aria-hidden />
                        )}
                      </div>
                      <p className="pb-3 text-xs text-text-secondary">
                        <CitedText text={step} />
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {hypothesis.affected_services.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-medium text-text-secondary">Affected services</div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {hypothesis.affected_services.map((service) => (
                    <span
                      key={service}
                      className="rounded-md border border-border bg-surface-1 px-1.5 py-0.5 text-[11px] text-text-secondary"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hypothesis.supporting_evidence.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-medium text-text-secondary">Supporting evidence</div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {hypothesis.supporting_evidence.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => jumpToEvidence(id)}
                      className="rounded-md border border-border bg-surface-1 px-1.5 py-0.5 font-mono text-[11px] text-text-secondary transition-colors hover:border-accent-border hover:bg-accent-bg hover:text-accent-text"
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
