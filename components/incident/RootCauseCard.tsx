"use client";

import { useState } from "react";
import type { Investigation, InvestigationPhase } from "@/types";
import { invokeInvestigation } from "@/lib/api-client";

function Section({ title }: { title: string }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wide text-accent-muted">{title}</h3>
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
      <div className="rounded-lg border border-border bg-surface-2 p-4">
        <Section title="Root cause" />
        <p className="mt-2 text-sm text-text-secondary">Loading investigation data…</p>
      </div>
    );
  }

  if (!investigation) {
    return (
      <div className="rounded-lg border border-border bg-surface-2 p-4">
        <Section title="Root cause" />
        <p className="mt-2 text-sm text-text-secondary">
          No investigation data available yet. Start the investigation to analyze this incident.
        </p>
        {invocationError && (
          <p className="mt-2 text-sm text-error-text">{invocationError}</p>
        )}
        <div className="mt-4">
          <button
            onClick={handleInvestigate}
            disabled={invoking}
            className="inline-flex items-center rounded-md bg-accent-bg px-3 py-2 text-sm font-medium text-accent-text hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {invoking ? (
              <>
                <span className="inline-block mr-2 h-4 w-4 animate-spin rounded-full border-2 border-accent-text border-t-transparent"></span>
                Starting Investigation…
              </>
            ) : (
              "Investigate"
            )}
          </button>
        </div>
      </div>
    );
  }

  const { phase, hypothesis, rejected_hypotheses_count, iteration, reasoning_summary } =
    investigation;

  if (IN_PROGRESS_PHASES.includes(phase)) {
    return (
      <div className="rounded-lg border border-border bg-surface-2 p-4">
        <div className="flex items-center justify-between">
          <Section title="Root cause" />
          <span className="inline-flex items-center rounded-full border border-border bg-surface-1 px-2.5 py-0.5 text-xs font-medium text-text-secondary">
            Investigation in progress
          </span>
        </div>

        <p className="mt-2 text-sm text-text-secondary">
          {hypothesis
            ? `Leading hypothesis (round ${iteration}): ${hypothesis.description}`
            : `Still gathering evidence (round ${iteration}) — no hypothesis yet.`}
        </p>
        {hypothesis && (
          <div className="mt-4 text-xs text-text-secondary">
            <span className="font-medium text-text-primary">
              {Math.round(hypothesis.confidence * 100)}%
            </span>{" "}
            confidence so far
          </div>
        )}
      </div>
    );
  }

  if (phase === "ESCALATED") {
    return (
      <div className="rounded-lg border border-warning-bg bg-surface-2 p-4">
        <div className="flex items-center justify-between">
          <Section title="Root cause" />
          <span className="inline-flex items-center rounded-full border border-warning-bg bg-warning-bg px-2.5 py-0.5 text-xs font-medium text-warning-text">
            Escalated — no root cause confirmed
          </span>
        </div>

        <p className="mt-2 text-sm text-text-primary">
          {rejected_hypotheses_count} hypothes{rejected_hypotheses_count === 1 ? "is" : "es"}{" "}
          tried across {iteration} round{iteration === 1 ? "" : "s"}; none survived verification.
        </p>

        {hypothesis && (
          <div className="mt-3">
            <div className="text-xs font-medium text-text-secondary">
              Last hypothesis considered
            </div>
            <p className="mt-1 text-sm text-text-primary">{hypothesis.description}</p>
          </div>
        )}

        <p className="mt-3 text-xs text-text-secondary">{reasoning_summary}</p>

        <p className="mt-3 text-xs italic text-text-secondary">
          The read API only reports a rejected-hypothesis count, not the individual hypotheses or
          their rejection reasons — that detail exists in the agent&rsquo;s trajectory data but
          isn&rsquo;t exposed here yet.
        </p>
      </div>
    );
  }

  // phase === "ROOT_CAUSE_CONFIRMED" or "REMEDIATION_PROPOSED" — both show
  // the same confirmed root-cause card; remediation itself renders
  // separately in RemediationPlaceholder/RemediationCard.
  return (
    <div className="rounded-lg border border-accent-border bg-surface-2 p-4">
      <div className="flex items-center justify-between">
        <Section title="Root cause" />
        <span className="inline-flex items-center rounded-full border border-success-bg bg-success-bg px-2.5 py-0.5 text-xs font-medium text-success-text">
          Confirmed
        </span>
      </div>

      {hypothesis && (
        <>
          <p className="mt-2 text-sm text-text-primary">{hypothesis.description}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-text-secondary">
            <div>
              <span className="font-medium text-text-primary">
                {Math.round(hypothesis.confidence * 100)}%
              </span>{" "}
              confidence
            </div>
            <div>
              <span className="font-medium text-text-primary">{iteration}</span> iteration
              {iteration === 1 ? "" : "s"}
            </div>
          </div>

          {hypothesis.causal_chain.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-medium text-text-secondary">Causal chain</div>
              <ol className="mt-1 list-decimal space-y-0.5 pl-4 text-xs text-text-secondary">
                {hypothesis.causal_chain.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {hypothesis.affected_services.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-medium text-text-secondary">Affected services</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {hypothesis.affected_services.map((service) => (
                  <span
                    key={service}
                    className="rounded border border-border bg-surface-1 px-1.5 py-0.5 text-[11px] text-text-secondary"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hypothesis.supporting_evidence.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-medium text-text-secondary">Supporting evidence</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {hypothesis.supporting_evidence.map((id) => (
                  <span
                    key={id}
                    className="rounded border border-border bg-surface-1 px-1.5 py-0.5 font-mono text-[11px] text-text-secondary"
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
