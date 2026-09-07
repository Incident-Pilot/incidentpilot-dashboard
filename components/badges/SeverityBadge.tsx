import { AlertTriangle, Info, HelpCircle, Flame } from "lucide-react";
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

const ICONS: Record<Severity, typeof Flame> = {
  critical: Flame,
  warning: AlertTriangle,
  info: Info,
  unknown: HelpCircle,
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const Icon = ICONS[severity];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[severity]}`}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {LABELS[severity]}
    </span>
  );
}
