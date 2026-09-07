import { ChevronLeft, ChevronRight } from "lucide-react";

// Client-side pagination only -- the Gateway's GET /incidents has no
// limit/offset support (checked observation-gateway/app/api/incidents.py),
// so the full list is always fetched; this just slices it for display so
// a 180+-incident list doesn't render as one long unpaginated page.
export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-2 px-3 py-1.5 font-medium text-text-primary shadow-card transition-colors hover:bg-surface-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Previous
      </button>
      <span className="text-text-secondary">
        Page {page} of {pageCount}
      </span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-2 px-3 py-1.5 font-medium text-text-primary shadow-card transition-colors hover:bg-surface-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
