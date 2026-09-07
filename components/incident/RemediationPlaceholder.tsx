import { CheckCircle2, Wrench } from "lucide-react";
import type { Investigation } from "@/types";
import { RemediationCard } from "@/components/incident/RemediationCard";

// A confirmed-but-not-actionable investigation (a genuine "no anomaly"
// finding) is a positive, completed outcome — not an absent/empty state —
// so it gets its own calm treatment instead of the muted placeholder below.
function RemediationNotNeeded() {
  return (
    <div className="rounded-xl border border-success-bg bg-surface-2 p-4 shadow-card">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
          <Wrench className="h-3.5 w-3.5" aria-hidden />
          Remediation
        </h3>
        <span className="inline-flex w-fit items-center gap-1 rounded-full border border-success-bg bg-success-bg px-2.5 py-0.5 text-xs font-medium text-success-text">
          <CheckCircle2 className="h-3 w-3" aria-hidden />
          No action needed
        </span>
      </div>
      <p className="mt-2 text-sm text-text-primary">
        Root cause confirmed: no anomaly detected, no remediation required.
      </p>
    </div>
  );
}

export function RemediationPlaceholder({ investigation }: { investigation: Investigation | null }) {
  if (investigation?.remediation_plan) {
    return <RemediationCard plan={investigation.remediation_plan} />;
  }

  if (investigation?.phase === "ROOT_CAUSE_CONFIRMED" && investigation.hypothesis?.actionable === false) {
    return <RemediationNotNeeded />;
  }

  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-1 p-4 opacity-60">
      <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
        <Wrench className="h-3.5 w-3.5" aria-hidden />
        Remediation
      </h3>
      <p className="mt-2 text-sm text-text-muted">Remediation not available yet.</p>
      <button
        type="button"
        disabled
        className="mt-3 cursor-not-allowed rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium text-text-muted"
      >
        Propose fix
      </button>
    </div>
  );
}
