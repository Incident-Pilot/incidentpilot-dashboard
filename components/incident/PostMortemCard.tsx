import type { PostMortem, PostMortemActionItem, PostMortemActionPriority, PostMortemActionCategory } from "@/types";

const PRIORITY_STYLES: Record<PostMortemActionPriority, string> = {
  high: "bg-danger-bg text-danger-text border-danger-bg",
  medium: "bg-warning-bg text-warning-text border-warning-bg",
  low: "bg-surface-1 text-text-secondary border-border",
};

const PRIORITY_LABELS: Record<PostMortemActionPriority, string> = {
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
};

const CATEGORY_LABELS: Record<PostMortemActionCategory, string> = {
  prevent: "Prevent",
  detect: "Detect",
  process: "Process",
};

function ActionItemRow({ item }: { item: PostMortemActionItem }) {
  return (
    <div className="rounded-md border border-border bg-surface-1 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-text-primary">{item.description}</span>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${PRIORITY_STYLES[item.priority]}`}
        >
          {PRIORITY_LABELS[item.priority]}
        </span>
      </div>
      <div className="mt-2 text-xs text-text-secondary">
        <span className="font-medium text-text-primary">Category:</span> {CATEGORY_LABELS[item.category]}
      </div>
    </div>
  );
}

export function PostMortemCard({ postmortem }: { postmortem: PostMortem }) {
  return (
    <div className="rounded-lg border border-accent-border bg-surface-2 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">Post-mortem</h3>
        <span className="inline-flex items-center rounded-full border border-success-bg bg-success-bg px-2.5 py-0.5 text-xs font-medium text-success-text">
          Generated
        </span>
      </div>

      <p className="mt-2 text-sm text-text-primary">{postmortem.summary}</p>

      <div className="mt-3">
        <div className="text-xs font-medium text-text-secondary">Impact</div>
        <p className="mt-1 text-sm text-text-primary">{postmortem.impact}</p>
      </div>

      {postmortem.contributing_factors.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-medium text-text-secondary">Contributing factors</div>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-text-secondary">
            {postmortem.contributing_factors.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        </div>
      )}

      {postmortem.action_items.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-medium text-text-secondary">Follow-up action items</div>
          <div className="mt-2 space-y-2">
            {postmortem.action_items.map((item, index) => (
              <ActionItemRow key={index} item={item} />
            ))}
          </div>
        </div>
      )}

      {postmortem.lessons_learned.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-medium text-text-secondary">Lessons learned</div>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-text-secondary">
            {postmortem.lessons_learned.map((lesson, index) => (
              <li key={index}>{lesson}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
