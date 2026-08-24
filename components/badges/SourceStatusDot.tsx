import type { SourceStatusValue } from "@/types";

const DOT_STYLES: Record<SourceStatusValue, string> = {
  available: "bg-success-text",
  timeout: "bg-warning-text",
  partial: "bg-warning-text",
  unavailable: "bg-text-muted",
};

const LABELS: Record<SourceStatusValue, string> = {
  available: "Available",
  timeout: "Timeout",
  partial: "Partial",
  unavailable: "Unavailable",
};

export function SourceStatusDot({
  source,
  status,
}: {
  source: string;
  status: SourceStatusValue;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOT_STYLES[status]}`} aria-hidden />
      <div className="min-w-0">
        <div className="truncate text-xs font-medium capitalize text-text-primary">{source}</div>
        <div className="text-[11px] text-text-secondary">{LABELS[status]}</div>
      </div>
    </div>
  );
}
