export default function Loading() {
  return (
    <main className="mx-auto max-w-[1400px] space-y-6 p-6">
      <div className="h-4 w-32 animate-pulse rounded-lg bg-surface-2" />
      <div className="h-32 animate-pulse rounded-xl border border-border bg-surface-2 shadow-card" />
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="h-48 animate-pulse rounded-xl border border-border bg-surface-2 shadow-card" />
        <div className="h-24 animate-pulse rounded-xl border border-border bg-surface-2 shadow-card" />
      </div>
      <div className="h-64 animate-pulse rounded-xl border border-border bg-surface-2 shadow-card" />
    </main>
  );
}
