import type { Severity } from "@/types";

const STYLES: Record<Severity, string> = {
  critical: "bg-danger-bg text-danger-text border-danger-bg",
  warning: "bg-warning-bg text-warning-text border-warning-bg",
  info: "bg-surface-1 text-text-secondary border-border",
  unknown: "bg-surface-1 text-text-secondary border-border",
};

const LABELS: Record<Severity, string> = {
  critical: "Critical",
  warning: "Warning",
  info: "Info",
  unknown: "Unknown",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[severity]}`}
    >
      {LABELS[severity]}
    </span>
  );
}
