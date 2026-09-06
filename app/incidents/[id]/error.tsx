"use client";

import Link from "next/link";

export default function IncidentDetailError({ error }: { error: Error & { digest?: string } }) {
  return (
    <main className="mx-auto max-w-[1400px] p-6">
      <div className="rounded-md border border-danger-bg bg-danger-bg px-4 py-6 text-sm text-danger-text">
        <p className="font-medium">Failed to load this incident.</p>
        <p className="mt-1">{error.message}</p>
        <Link href="/" className="mt-4 inline-block text-sm underline">
          ← Back to incidents
        </Link>
      </div>
    </main>
  );
}
