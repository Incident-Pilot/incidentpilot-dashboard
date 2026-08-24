import type { Investigation } from "@/types";

function Section({ title }: { title: string }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wide text-accent-muted">{title}</h3>
  );
}

export function RootCauseCard({
  investigation,
  loading,
}: {
  investigation: Investigation | null;
  loading: boolean;
}) {
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
          No investigation data available yet. The Intelligence Plane's read API isn't wired up
          in this build — once it is, a root-cause hypothesis will appear here automatically.
        </p>
      </div>
    );
  }

  const confidencePct = Math.round(investigation.confidence * 100);

  return (
    <div className="rounded-lg border border-accent-border bg-surface-2 p-4">
      <div className="flex items-center justify-between">
        <Section title="Root cause" />
        {investigation.verification_verdict && (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
              investigation.verification_verdict === "CONFIRMED"
                ? "border-accent-border bg-accent-bg text-accent-text"
                : "border-danger-bg bg-danger-bg text-danger-text"
            }`}
          >
            {investigation.verification_verdict === "CONFIRMED" ? "Confirmed" : "Rejected"}
          </span>
        )}
      </div>

      <p className="mt-2 text-sm text-text-primary">{investigation.root_cause}</p>

      {investigation.causal_chain.length > 0 && (
        <ol className="mt-3 space-y-1 border-l-2 border-accent-border pl-3">
          {investigation.causal_chain.map((step, i) => (
            <li key={i} className="text-xs text-text-secondary">
              {step}
            </li>
          ))}
        </ol>
      )}

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-text-secondary">
        <div>
          <span className="font-medium text-text-primary">{confidencePct}%</span> confidence
        </div>
        <div>
          <span className="font-medium text-text-primary">{investigation.iteration_count}</span>{" "}
          iteration{investigation.iteration_count === 1 ? "" : "s"}
        </div>
      </div>

      {investigation.supporting_evidence_ids.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-medium text-text-secondary">Supporting evidence</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {investigation.supporting_evidence_ids.map((id) => (
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
    </div>
  );
}
