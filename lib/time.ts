/**
 * Pakistan Standard Time is a fixed UTC+5 with no daylight saving, so we can
 * do all local-time math with a constant offset. Open-Meteo is asked for
 * timezone=Asia/Karachi and returns offset-less local strings, which we keep
 * as strings instead of parsing them into server-timezone Dates.
 */
const PKT_OFFSET_MS = 5 * 60 * 60 * 1000;

/** Current hour in Karachi as "YYYY-MM-DDTHH:00", comparable to Open-Meteo hourly keys. */
export function karachiHourKey(now: Date = new Date()): string {
  return new Date(now.getTime() + PKT_OFFSET_MS).toISOString().slice(0, 13) + ":00";
}

/** "2026-11-09T13:00" -> "1 PM" */
export function formatHour(local: string): string {
  const h = Number(local.slice(11, 13));
  const suffix = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12} ${suffix}`;
}

/** "2026-11-09T06:42" -> "6:42 AM" */
export function formatClock(local: string): string {
  const h = Number(local.slice(11, 13));
  const m = local.slice(14, 16);
  const suffix = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${suffix}`;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-11-09" -> "Mon" */
export function formatWeekday(localDate: string): string {
  return WEEKDAYS[new Date(`${localDate.slice(0, 10)}T00:00:00Z`).getUTCDay()];
}

/** "2026-11-09" -> "Nov 9" */
export function formatShortDate(localDate: string): string {
  const d = new Date(`${localDate.slice(0, 10)}T00:00:00Z`);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/** Absolute timestamp (ISO with offset) -> "10:32 AM PKT" */
export function formatPkt(iso: string): string {
  const local = new Date(new Date(iso).getTime() + PKT_OFFSET_MS).toISOString();
  return `${formatClock(local)} PKT`;
}

export function relativeTime(iso: string, now: number = Date.now()): string {
  const seconds = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (seconds < 45) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
