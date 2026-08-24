export function RemediationPlaceholder() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface-1 p-4 opacity-60">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        Remediation
      </h3>
      <p className="mt-2 text-sm text-text-muted">Remediation not available yet.</p>
      <button
        type="button"
        disabled
        className="mt-3 cursor-not-allowed rounded-md border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium text-text-muted"
      >
        Propose fix
      </button>
    </div>
  );
}
