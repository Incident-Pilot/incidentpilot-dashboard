import { CheckCircle2, ClipboardList, Eye, FileText, Lightbulb, Link2, ShieldCheck, TrendingDown, type LucideIcon } from "lucide-react";
import type { PostMortem, PostMortemActionItem, PostMortemActionPriority, PostMortemActionCategory } from "@/types";
import { CitedText } from "@/components/incident/EvidenceCitation";

const PRIORITY_BADGE_STYLES: Record<PostMortemActionPriority, string> = {
  high: "bg-danger-bg text-danger-text border-danger-bg",
  medium: "bg-warning-bg text-warning-text border-warning-bg",
  low: "bg-surface-2 text-text-secondary border-border",
};

// Same colored-left-accent language RemediationCard uses for risk --
// priority is scannable without reading the badge text.
const PRIORITY_ACCENT: Record<PostMortemActionPriority, string> = {
  high: "border-l-danger-text",
  medium: "border-l-warning-text",
  low: "border-l-border",
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

const CATEGORY_ICONS: Record<PostMortemActionCategory, LucideIcon> = {
  prevent: ShieldCheck,
  detect: Eye,
  process: ClipboardList,
};

function ActionItemRow({ item }: { item: PostMortemActionItem }) {
  const CategoryIcon = CATEGORY_ICONS[item.category];
  return (
    <div className={`overflow-hidden rounded-lg border border-border bg-surface-1 border-l-4 ${PRIORITY_ACCENT[item.priority]}`}>
      <div className="p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium text-text-primary">{item.description}</span>
          <span
            className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${PRIORITY_BADGE_STYLES[item.priority]}`}
          >
            {PRIORITY_LABELS[item.priority]}
          </span>
        </div>
        <div className="mt-2 inline-flex items-center gap-1 text-xs text-text-secondary">
          <CategoryIcon className="h-3 w-3" aria-hidden />
          {CATEGORY_LABELS[item.category]}
        </div>
      </div>
    </div>
  );
}

function IconListItem({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <li className="flex items-start gap-2 rounded-lg bg-surface-1 px-2.5 py-2 text-xs text-text-secondary">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden />
      <span>
        <CitedText text={text} />
      </span>
    </li>
  );
}

export function PostMortemCard({ postmortem }: { postmortem: PostMortem }) {
  return (
    <div className="rounded-xl border border-accent-border bg-surface-2 p-4 shadow-card">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
          <FileText className="h-3.5 w-3.5" aria-hidden />
          Post-mortem
        </h3>
        <span className="inline-flex w-fit items-center gap-1 rounded-full border border-success-bg bg-success-bg px-2.5 py-0.5 text-xs font-medium text-success-text">
          <CheckCircle2 className="h-3 w-3" aria-hidden />
          Generated
        </span>
      </div>

      <p className="mt-2.5 text-sm text-text-primary">
        <CitedText text={postmortem.summary} />
      </p>

      <div className="mt-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
          <TrendingDown className="h-3.5 w-3.5" aria-hidden />
          Impact
        </div>
        <p className="mt-1 text-sm text-text-primary">
          <CitedText text={postmortem.impact} />
        </p>
      </div>

      {postmortem.contributing_factors.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
            <Link2 className="h-3.5 w-3.5" aria-hidden />
            Contributing factors
          </div>
          <ul className="mt-1.5 space-y-1">
            {postmortem.contributing_factors.map((factor, index) => (
              <IconListItem key={index} icon={Link2} text={factor} />
            ))}
          </ul>
        </div>
      )}

      {postmortem.action_items.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-medium text-text-secondary">Follow-up action items</div>
          <div className="mt-2 grid grid-cols-1 gap-2 xl:grid-cols-2">
            {postmortem.action_items.map((item, index) => (
              <ActionItemRow key={index} item={item} />
            ))}
          </div>
        </div>
      )}

      {postmortem.lessons_learned.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
            <Lightbulb className="h-3.5 w-3.5" aria-hidden />
            Lessons learned
          </div>
          <ul className="mt-1.5 space-y-1">
            {postmortem.lessons_learned.map((lesson, index) => (
              <IconListItem key={index} icon={Lightbulb} text={lesson} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
