import type { Investigation } from "@/types";
import { PostMortemCard } from "@/components/incident/PostMortemCard";

export function PostMortemPlaceholder({ investigation }: { investigation: Investigation | null }) {
  if (investigation?.postmortem) {
    return <PostMortemCard postmortem={investigation.postmortem} />;
  }

  // Post-mortem generation is automatic (it runs right after the
  // remediation planner, on the same CONFIRMED + actionable path -- see
  // incident_pilot_agent/graph/build.py) -- there is no user-triggered
  // "generate" action here the way RootCauseCard has "Investigate", so
  // this is a plain waiting state, never a disabled button.
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface-1 p-4 opacity-60">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">Post-mortem</h3>
      <p className="mt-2 text-sm text-text-muted">
        Post-mortem not available yet. Generated automatically once a root cause is confirmed and a
        remediation plan is proposed.
      </p>
    </div>
  );
}
