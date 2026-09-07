"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Radar } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "Invalid username or password.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-1 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-xl border border-border bg-surface-2 p-7 shadow-card"
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-solid text-white shadow-card">
            <Radar className="h-5 w-5" aria-hidden />
          </div>
          <h1 className="mt-3 text-lg font-semibold tracking-tight text-text-primary">Incident Pilot</h1>
          <p className="mt-1 text-sm text-text-secondary">Sign in to continue.</p>
        </div>

        {error && (
          <div className="rounded-lg border border-danger-bg bg-danger-bg px-3 py-2 text-sm text-danger-text">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="username" className="text-xs font-medium text-text-secondary">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm text-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-solid/40"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-xs font-medium text-text-secondary">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm text-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-solid/40"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-accent-solid px-3 py-2 text-sm font-medium text-white shadow-card transition-colors hover:bg-accent-solid-hover disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
