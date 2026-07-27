/**
 * Pure constants and helpers — safe to import from client components.
 * The actual database-touching logic lives in lib/scheduling.ts, which
 * must only ever be imported from server components/actions/routes.
 */

export const APPOINTMENT_DURATIONS: Record<string, number> = {
  "Initial evaluation (60 min)": 60,
  "Follow-up (30 min)": 30,
  "Medication management (30 min)": 30,
};

export function getDurationMinutes(appointmentType: string): number {
  return APPOINTMENT_DURATIONS[appointmentType] ?? 30;
}

export const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
