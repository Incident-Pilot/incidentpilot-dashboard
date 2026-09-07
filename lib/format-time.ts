// Fixed locale + UTC, deliberately not "whatever the viewer's browser is
// set to": app/incidents/[id]/page.tsx is a Server Component, so
// formatAbsoluteTime() runs once on the server (Node's own default locale)
// and again during client hydration (the browser's) -- an unpinned
// `toLocaleString(undefined, ...)` renders a different string each time
// (e.g. "8/11/2026, 9:48 PM" vs "11/08/2026, 21:48"), which is a real
// hydration-mismatch bug, not just a style choice. Pinning both also means
// two engineers in different timezones comparing an incident's timeline
// see the same wall-clock time, which matters more here than local-time
// convenience does.

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const diffSeconds = Math.floor((now.getTime() - new Date(iso).getTime()) / 1000);

  if (diffSeconds < 5) return "just now";
  if (diffSeconds < MINUTE) return `${diffSeconds} seconds ago`;
  if (diffSeconds < HOUR) {
    const minutes = Math.floor(diffSeconds / MINUTE);
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }
  if (diffSeconds < DAY) {
    const hours = Math.floor(diffSeconds / HOUR);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  if (diffSeconds < WEEK) {
    const days = Math.floor(diffSeconds / DAY);
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }

  return formatAbsoluteTime(iso);
}

export function formatAbsoluteTime(iso: string): string {
  const formatted = new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });
  return `${formatted} UTC`;
}
