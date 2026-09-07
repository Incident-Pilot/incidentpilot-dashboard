import type { LucideIcon } from "lucide-react";

// Shared chrome for the incident detail page's sidebar widgets (Source
// status, Topology, Timeline, Assigned to) -- one place for the
// title+icon+card treatment instead of five near-identical repeats.
export function SidebarCard({
  title,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-4 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent-muted">
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {title}
        </h3>
        {action}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
