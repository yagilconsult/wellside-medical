import { getAvailabilityRules, listAppointmentsForDate, listScheduleBlocksForDate } from "./db";
import { getDurationMinutes } from "./scheduling-constants";

/**
 * Server-only scheduling logic — imports lib/db.ts, so this file must
 * never be imported from a client component. Browser-safe constants
 * (durations, day labels) live in lib/scheduling-constants.ts instead.
 */

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60).toString().padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

const SLOT_INCREMENT_MINUTES = 30;

/**
 * Returns the list of bookable start times ("14:00", "14:30", ...) for a
 * given date and appointment type — respecting Wulaimot's real weekly
 * hours, skipping times that would overlap an existing appointment
 * (accounting for that appointment's own duration, not just its start
 * time), and skipping past times if the date is today.
 */
export async function getAvailableSlots(
  date: string,
  appointmentType: string
): Promise<string[]> {
  const duration = getDurationMinutes(appointmentType);

  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return [];
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = dateObj.getDay();

  const rules = await getAvailabilityRules();
  const rule = rules.find((r) => r.dayOfWeek === dayOfWeek);
  if (!rule || !rule.enabled) return [];

  const startMin = timeToMinutes(rule.startTime);
  const endMin = timeToMinutes(rule.endTime);

  const existing = await listAppointmentsForDate(date);
  const busyRanges = existing.map((a) => {
    const s = timeToMinutes(a.time);
    const d = getDurationMinutes(a.type);
    return [s, s + d] as [number, number];
  });

  const blocks = await listScheduleBlocksForDate(date);
  for (const block of blocks) {
    busyRanges.push([timeToMinutes(block.startTime), timeToMinutes(block.endTime)]);
  }

  const now = new Date();
  const isToday =
    now.getFullYear() === year && now.getMonth() === month - 1 && now.getDate() === day;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const slots: string[] = [];
  for (let t = startMin; t + duration <= endMin; t += SLOT_INCREMENT_MINUTES) {
    if (isToday && t <= nowMinutes) continue;
    const overlaps = busyRanges.some(([busyStart, busyEnd]) => t < busyEnd && t + duration > busyStart);
    if (!overlaps) slots.push(minutesToTime(t));
  }

  return slots;
}

/**
 * Server-side re-check used at the moment of actually creating an
 * appointment — protects against two people booking the same slot at
 * nearly the same time (a race the client-side slot list alone can't
 * prevent).
 */
export async function isSlotStillAvailable(
  date: string,
  time: string,
  appointmentType: string
): Promise<boolean> {
  const slots = await getAvailableSlots(date, appointmentType);
  return slots.includes(time);
}
