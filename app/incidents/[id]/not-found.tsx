import Link from "next/link";

export default function IncidentNotFound() {
  return (
    <main className="mx-auto max-w-[1400px] p-6">
      <div className="rounded-lg border border-border bg-surface-2 px-4 py-12 text-center">
        <h1 className="text-lg font-semibold text-text-primary">Incident not found</h1>
        <p className="mt-2 text-sm text-text-secondary">
          This incident doesn&rsquo;t exist, or you don&rsquo;t have access to it.
        </p>
        <Link href="/" className="mt-4 inline-block text-sm text-accent-text hover:underline">
          ← Back to incidents
        </Link>
      </div>
    </main>
  );
}
