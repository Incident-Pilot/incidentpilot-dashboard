export function AssigneePlaceholder() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface-1 p-4 opacity-60">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">Assigned to</h3>
      <p className="mt-2 text-sm text-text-muted">Unassigned</p>
      <select
        disabled
        aria-label="Assignee (not available yet)"
        className="mt-3 w-full cursor-not-allowed rounded-md border border-border bg-surface-2 px-3 py-1.5 text-sm text-text-muted"
      >
        <option>Assignment not available yet</option>
      </select>
    </div>
  );
}
