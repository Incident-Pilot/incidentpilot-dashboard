import type { Evidence } from "@/types";

export function EvidenceList({ evidence }: { evidence: Evidence[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-accent-muted">
        Evidence ({evidence.length})
      </h3>
      {evidence.length === 0 ? (
        <p className="mt-2 text-sm text-text-secondary">No evidence collected for this incident.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {evidence.map((e) => (
            <li
              key={e.evidence_id}
              className="rounded-md border border-border bg-surface-2 px-3 py-2"
            >
              <div className="flex items-center justify-between gap-2 text-xs text-text-muted">
                <span className="font-mono">{e.evidence_id}</span>
                <span className="capitalize">
                  {e.type.replace("_", " ")} · {e.source}
                </span>
              </div>
              <p className="mt-1 text-sm text-text-primary">{e.summary}</p>
              {e.service && (
                <p className="mt-0.5 text-xs text-text-secondary">service: {e.service}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
