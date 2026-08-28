import type { RemediationAction, RemediationActionType, RemediationPlan, RemediationRiskLevel } from "@/types";

const ACTION_TYPE_LABELS: Record<RemediationActionType, string> = {
  rollback_deployment: "Rollback deployment",
  scale_replicas: "Scale replicas",
  restart_pod: "Restart pod",
  config_change: "Config change",
  manual_investigation_required: "Manual investigation required",
};

const RISK_STYLES: Record<RemediationRiskLevel, string> = {
  high: "bg-danger-bg text-danger-text border-danger-bg",
  medium: "bg-warning-bg text-warning-text border-warning-bg",
  low: "bg-surface-1 text-text-secondary border-border",
};

const RISK_LABELS: Record<RemediationRiskLevel, string> = {
  high: "High risk",
  medium: "Medium risk",
  low: "Low risk",
};

function RemediationActionRow({ action }: { action: RemediationAction }) {
  return (
    <div className="rounded-md border border-border bg-surface-1 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-text-primary">{action.description}</span>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${RISK_STYLES[action.risk_level]}`}
        >
          {RISK_LABELS[action.risk_level]}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
        <span>
          <span className="font-medium text-text-primary">Type:</span>{" "}
          {ACTION_TYPE_LABELS[action.action_type]}
        </span>
        <span>
          <span className="font-medium text-text-primary">Target:</span> {action.target}
        </span>
      </div>

      <p className="mt-2 text-xs text-text-secondary">{action.rationale}</p>
    </div>
  );
}

export function RemediationCard({ plan }: { plan: RemediationPlan }) {
  return (
    <div className="rounded-lg border border-warning-bg bg-surface-2 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          Remediation
        </h3>
        <span className="inline-flex items-center rounded-full border border-warning-bg bg-warning-bg px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-warning-text">
          Proposed — not executed
        </span>
      </div>

      <p className="mt-2 text-sm font-medium text-warning-text">{plan.disclaimer}</p>

      <div className="mt-3 space-y-2">
        {plan.actions.map((action, index) => (
          <RemediationActionRow key={`${action.action_type}-${action.target}-${index}`} action={action} />
        ))}
      </div>
    </div>
  );
}
