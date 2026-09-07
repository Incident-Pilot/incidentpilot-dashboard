"use client";

import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function IncidentDetailError({ error }: { error: Error & { digest?: string } }) {
  return (
    <main className="mx-auto max-w-[1400px] p-6">
      <div className="rounded-xl border border-danger-bg bg-danger-bg px-4 py-6 text-sm text-danger-text shadow-card">
        <p className="flex items-center gap-1.5 font-medium">
          <AlertTriangle className="h-4 w-4" aria-hidden />
          Failed to load this incident.
        </p>
        <p className="mt-1">{error.message}</p>
        <Link href="/" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium underline">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to incidents
        </Link>
      </div>
    </main>
  );
}
