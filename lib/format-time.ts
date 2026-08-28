// Local-time formatting, matching the only other timestamp display in this
// app (TimelineView's `new Date(...).toLocaleString()`) — no explicit UTC
// conversion, so both stay consistent with each other and with whatever
// timezone the viewer's browser is already in.

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
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
