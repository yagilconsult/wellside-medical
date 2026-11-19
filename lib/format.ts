/** Display helpers for appointment dates/times. Dates are stored as "YYYY-MM-DD" and "HH:mm". */

export function parseLocalDate(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function fmtTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return time;
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m || 0).padStart(2, "0")} ${suffix}`;
}

export function fmtLongDate(date: string): string {
  return parseLocalDate(date).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtShortDate(date: string): string {
  return parseLocalDate(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function monthDay(date: string): { month: string; day: string } {
  const d = parseLocalDate(date);
  return {
    month: d.toLocaleDateString(undefined, { month: "short" }),
    day: String(d.getDate()),
  };
}

/** "Today", "Tomorrow", "In 5 days", or "Date passed". Null when it's far away. */
export function relativeDay(date: string): string | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((parseLocalDate(date).getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff > 1 && diff <= 14) return `In ${diff} days`;
  if (diff < 0) return "Date passed";
  return null;
}
