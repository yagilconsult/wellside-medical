"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import * as db from "@/lib/db";
import { isSlotStillAvailable } from "@/lib/scheduling";
import { APPOINTMENT_DURATIONS } from "@/lib/scheduling-constants";
import {
  sendAppointmentConfirmationEmail,
  sendAppointmentConfirmedByProviderEmail,
  sendAppointmentCancelledEmail,
} from "@/lib/email";

/**
 * Every exported function here is a public HTTP endpoint (Next.js server
 * actions can be called by anyone, not just our own UI). So identity ALWAYS
 * comes from the session — never from an argument — and every action checks
 * the caller's role and, where relevant, that the record belongs to them.
 */

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const MAX_MESSAGE = 5000;
const MAX_FIELD = 5000;

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Not authenticated");
  return session.user;
}

async function requirePatient() {
  const user = await requireSession();
  if (user.role !== "PATIENT") throw new Error("Patients only");
  return user;
}

async function requireProvider() {
  const user = await requireSession();
  if (user.role !== "PROVIDER") throw new Error("Only the provider can do this");
  return user;
}

function clean(value: unknown, max = MAX_FIELD): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// ---------- Profile ----------

export async function updateProfileAction(patch: {
  name: string;
  email: string;
  phone: string;
}): Promise<{ ok: boolean; error?: string }> {
  const user = await requireSession();

  const name = clean(patch.name, 120);
  const email = clean(patch.email, 254).toLowerCase();
  const phone = clean(patch.phone, 40);

  if (!name) return { ok: false, error: "Name is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const existing = await db.findUserByEmail(email);
  if (existing && existing.id !== user.id) {
    return { ok: false, error: "That email is already in use." };
  }

  await db.updateUser(user.id, { name, email, phone });
  revalidatePath("/portal");
  revalidatePath("/admin");
  return { ok: true };
}

// ---------- Appointments ----------

export async function createAppointmentAction(input: {
  type: string;
  date: string;
  time: string;
  paymentMethod: db.PaymentMethod;
}): Promise<{ ok: boolean; error?: string }> {
  // The appointment always belongs to the signed-in patient.
  const user = await requirePatient();

  if (!(input.type in APPOINTMENT_DURATIONS)) {
    return { ok: false, error: "Please choose a valid appointment type." };
  }
  if (!DATE_RE.test(input.date) || !TIME_RE.test(input.time)) {
    return { ok: false, error: "Please choose a valid date and time." };
  }
  const paymentMethod: db.PaymentMethod =
    input.paymentMethod === "INSURANCE" ? "INSURANCE" : "SELF_PAY";

  const stillOpen = await isSlotStillAvailable(input.date, input.time, input.type);
  if (!stillOpen) {
    return {
      ok: false,
      error: "That time was just booked by someone else. Please pick another slot.",
    };
  }

  await db.createAppointment({
    patientId: user.id,
    type: input.type,
    date: input.date,
    time: input.time,
    paymentMethod,
    status: "REQUESTED",
  });
  revalidatePath("/portal");
  revalidatePath("/admin");

  const patient = await db.findUserById(user.id);
  if (patient) {
    await sendAppointmentConfirmationEmail(
      patient.email,
      patient.name,
      input.type,
      input.date,
      input.time
    );
  }

  return { ok: true };
}

export async function updateAppointmentStatusAction(
  appointmentId: string,
  status: db.AppointmentStatus
) {
  const user = await requireSession();

  const existing = await db.findAppointmentById(appointmentId);
  if (!existing) throw new Error("Appointment not found");

  if (user.role === "PROVIDER") {
    // Provider may move an appointment to any valid status.
  } else {
    // A patient may only cancel their own appointment.
    if (existing.patientId !== user.id || status !== "CANCELLED") {
      throw new Error("Not allowed");
    }
  }
  if (!["REQUESTED", "CONFIRMED", "COMPLETED", "CANCELLED"].includes(status)) {
    throw new Error("Invalid status");
  }

  const appt = await db.updateAppointmentStatus(appointmentId, status);
  revalidatePath("/portal");
  revalidatePath("/admin");

  if (appt && (status === "CONFIRMED" || status === "CANCELLED")) {
    const patient = await db.findUserById(appt.patientId);
    if (patient) {
      if (status === "CONFIRMED") {
        await sendAppointmentConfirmedByProviderEmail(
          patient.email,
          patient.name,
          appt.type,
          appt.date,
          appt.time
        );
      } else {
        await sendAppointmentCancelledEmail(
          patient.email,
          patient.name,
          appt.type,
          appt.date,
          appt.time
        );
      }
    }
  }
}

// ---------- Messages ----------

export async function sendMessageAction(threadUserId: string, text: string) {
  const user = await requireSession();

  const body = clean(text, MAX_MESSAGE);
  if (!body) throw new Error("Message is empty");

  // A patient can only write in their own thread. The provider can write in
  // any patient's thread.
  let threadId = user.id;
  if (user.role === "PROVIDER") {
    const target = await db.findUserById(threadUserId);
    if (!target || target.role !== "PATIENT") throw new Error("Unknown patient");
    threadId = target.id;
  }

  await db.createMessage({
    threadUserId: threadId,
    fromRole: user.role,
    authorId: user.id,
    text: body,
  });
  revalidatePath("/portal");
  revalidatePath("/admin");
}

// ---------- Insurance ----------

export async function updateInsuranceAction(
  patientId: string,
  patch: Partial<Omit<db.InsuranceInfo, "id" | "patientId">>
) {
  const user = await requireSession();

  if (user.role === "PROVIDER") {
    // Provider may update any patient's record, including verification status.
    const target = await db.findUserById(patientId);
    if (!target || target.role !== "PATIENT") throw new Error("Unknown patient");
    await db.upsertInsurance(target.id, patch);
  } else {
    // A patient can only edit their own details/cards, and can never set the
    // verification status — every patient submission goes back to PENDING.
    const ownCardPrefix = [
      `/api/insurance-card?path=${encodeURIComponent(`insurance-cards/${user.id}/`)}`,
      `/uploads/${user.id}/`,
    ];
    const okUrl = (u?: string) => !u || ownCardPrefix.some((p) => u.startsWith(p));
    if (!okUrl(patch.cardFrontUrl) || !okUrl(patch.cardBackUrl)) {
      throw new Error("Invalid card file");
    }
    await db.upsertInsurance(user.id, {
      company: patch.company ? clean(patch.company, 200) : undefined,
      plan: patch.plan ? clean(patch.plan, 200) : undefined,
      memberId: patch.memberId ? clean(patch.memberId, 100) : undefined,
      groupNumber: patch.groupNumber ? clean(patch.groupNumber, 100) : undefined,
      cardFrontUrl: patch.cardFrontUrl,
      cardBackUrl: patch.cardBackUrl,
      status: "PENDING",
    });
  }
  revalidatePath("/portal");
  revalidatePath("/admin");
}

// ---------- Intake + consent ----------

export async function submitIntakeAction(input: {
  medicalHistory: string;
  behavioralHistory: string;
  currentMedications: string;
  previousTreatment: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}) {
  const user = await requirePatient();
  await db.upsertIntake(user.id, {
    medicalHistory: clean(input.medicalHistory),
    behavioralHistory: clean(input.behavioralHistory),
    currentMedications: clean(input.currentMedications),
    previousTreatment: clean(input.previousTreatment),
    emergencyContactName: clean(input.emergencyContactName, 200),
    emergencyContactPhone: clean(input.emergencyContactPhone, 40),
    submittedAt: new Date().toISOString(),
  });
  revalidatePath("/portal");
}

export async function signConsentAction(type: db.ConsentType, signedName: string) {
  const user = await requirePatient();
  if (!["HIPAA", "TELEHEALTH", "FINANCIAL"].includes(type)) {
    throw new Error("Invalid consent type");
  }
  const name = clean(signedName, 200);
  if (!name) throw new Error("Signature is required");
  await db.upsertConsent(user.id, type, name);
  revalidatePath("/portal");
}

// ---------- Scheduling (provider-only) ----------

export async function setAvailabilityRuleAction(
  dayOfWeek: number,
  patch: { startTime: string; endTime: string; enabled: boolean }
) {
  await requireProvider();
  if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
    throw new Error("Invalid day");
  }
  if (!TIME_RE.test(patch.startTime) || !TIME_RE.test(patch.endTime)) {
    throw new Error("Invalid time");
  }
  if (patch.startTime >= patch.endTime) {
    throw new Error("End time must be after start time");
  }
  await db.setAvailabilityRule(dayOfWeek, {
    startTime: patch.startTime,
    endTime: patch.endTime,
    enabled: Boolean(patch.enabled),
  });
  revalidatePath("/admin");
}

export async function createScheduleBlockAction(input: {
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
}) {
  await requireProvider();
  if (!DATE_RE.test(input.date) || !TIME_RE.test(input.startTime) || !TIME_RE.test(input.endTime)) {
    throw new Error("Invalid date or time");
  }
  if (input.startTime >= input.endTime) {
    throw new Error("End time must be after start time");
  }
  await db.createScheduleBlock({
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    reason: input.reason ? clean(input.reason, 200) : undefined,
  });
  revalidatePath("/admin");
}

export async function deleteScheduleBlockAction(blockId: string) {
  await requireProvider();
  await db.deleteScheduleBlock(blockId);
  revalidatePath("/admin");
}
