import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function IncidentNotFound() {
  return (
    <main className="mx-auto max-w-[1400px] p-6">
      <div className="rounded-xl border border-border bg-surface-2 px-4 py-14 text-center shadow-card">
        <SearchX className="mx-auto h-8 w-8 text-text-muted" aria-hidden />
        <h1 className="mt-3 text-lg font-semibold text-text-primary">Incident not found</h1>
        <p className="mt-2 text-sm text-text-secondary">
          This incident doesn&rsquo;t exist, or you don&rsquo;t have access to it.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-text hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to incidents
        </Link>
      </div>
    </main>
  );
}
