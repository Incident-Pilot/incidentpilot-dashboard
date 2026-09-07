"use client";

import { useState } from "react";
import {
  AlertOctagon,
  ChevronDown,
  Layers,
  RotateCcw,
  RotateCw,
  Search,
  Settings2,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { RemediationAction, RemediationActionType, RemediationPlan, RemediationRiskLevel } from "@/types";
import { CitedText } from "@/components/incident/EvidenceCitation";

const COLLAPSED_ACTION_COUNT = 2;

const ACTION_TYPE_LABELS: Record<RemediationActionType, string> = {
  rollback_deployment: "Rollback deployment",
  scale_replicas: "Scale replicas",
  restart_pod: "Restart pod",
  config_change: "Config change",
  manual_investigation_required: "Manual investigation required",
};

const ACTION_TYPE_ICONS: Record<RemediationActionType, LucideIcon> = {
  rollback_deployment: RotateCcw,
  scale_replicas: Layers,
  restart_pod: RotateCw,
  config_change: Settings2,
  manual_investigation_required: Search,
};

const RISK_BADGE_STYLES: Record<RemediationRiskLevel, string> = {
  high: "bg-danger-bg text-danger-text border-danger-bg",
  medium: "bg-warning-bg text-warning-text border-warning-bg",
  low: "bg-surface-2 text-text-secondary border-border",
};

// A colored left accent per row, same "at-a-glance severity" language used
// elsewhere (IncidentDetailHeader's severity stripe, RootCauseCard's
// confirmed-state border) -- risk is scannable without reading the badge.
const RISK_ACCENT: Record<RemediationRiskLevel, string> = {
  high: "border-l-danger-text",
  medium: "border-l-warning-text",
  low: "border-l-border",
};

const RISK_LABELS: Record<RemediationRiskLevel, string> = {
  high: "High risk",
  medium: "Medium risk",
  low: "Low risk",
};

function RemediationActionRow({ action }: { action: RemediationAction }) {
  const TypeIcon = ACTION_TYPE_ICONS[action.action_type];
  return (
    <div className={`overflow-hidden rounded-lg border border-border bg-surface-1 border-l-4 ${RISK_ACCENT[action.risk_level]}`}>
      <div className="p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium text-text-primary">{action.description}</span>
          <span
            className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${RISK_BADGE_STYLES[action.risk_level]}`}
          >
            {RISK_LABELS[action.risk_level]}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1">
            <TypeIcon className="h-3 w-3" aria-hidden />
            {ACTION_TYPE_LABELS[action.action_type]}
          </span>
          <span className="break-all">
            <span className="font-medium text-text-primary">Target:</span> {action.target}
          </span>
        </div>

        <p className="mt-2 text-xs text-text-secondary">
          <CitedText text={action.rationale} />
        </p>
      </div>
    </div>
  );
}

export function RemediationCard({ plan }: { plan: RemediationPlan }) {
  const [expanded, setExpanded] = useState(false);

  const hasMore = plan.actions.length > COLLAPSED_ACTION_COUNT;
  const visibleActions = expanded ? plan.actions : plan.actions.slice(0, COLLAPSED_ACTION_COUNT);
  const hiddenCount = plan.actions.length - COLLAPSED_ACTION_COUNT;

  return (
    <div className="rounded-xl border border-warning-bg bg-surface-2 p-4 shadow-card">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
          <Wrench className="h-3.5 w-3.5" aria-hidden />
          Remediation
        </h3>
        <span className="inline-flex w-fit items-center gap-1 rounded-full border border-warning-bg bg-warning-bg px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-warning-text">
          <AlertOctagon className="h-3 w-3" aria-hidden />
          Proposed — not executed
        </span>
      </div>

      <p className="mt-2 text-sm font-medium text-warning-text">{plan.disclaimer}</p>

      <div className="mt-3 grid grid-cols-1 gap-2 xl:grid-cols-2">
        {visibleActions.map((action, index) => (
          <RemediationActionRow key={`${action.action_type}-${action.target}-${index}`} action={action} />
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent-text hover:underline"
        >
          <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
          {expanded ? "Show less" : `Show ${hiddenCount} more`}
        </button>
      )}
    </div>
  );
}
