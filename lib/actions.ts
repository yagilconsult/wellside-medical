"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import * as db from "@/lib/db";
import {
  sendAppointmentConfirmationEmail,
  sendAppointmentConfirmedByProviderEmail,
  sendAppointmentCancelledEmail,
} from "@/lib/email";

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Not authenticated");
  return session.user;
}

// ---------- Profile ----------

export async function updateProfileAction(patch: {
  name: string;
  email: string;
  phone: string;
}) {
  const user = await requireSession();
  await db.updateUser(user.id, patch);
  revalidatePath("/portal");
  revalidatePath("/admin");
}

// ---------- Appointments ----------

export async function createAppointmentAction(input: {
  patientId: string;
  type: string;
  date: string;
  time: string;
  paymentMethod: db.PaymentMethod;
}) {
  await db.createAppointment({ ...input, status: "REQUESTED" });
  revalidatePath("/portal");
  revalidatePath("/admin");

  const patient = await db.findUserById(input.patientId);
  if (patient) {
    await sendAppointmentConfirmationEmail(
      patient.email,
      patient.name,
      input.type,
      input.date,
      input.time
    );
  }
}

export async function updateAppointmentStatusAction(
  appointmentId: string,
  status: db.AppointmentStatus
) {
  await requireSession();
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
  await db.createMessage({
    threadUserId,
    fromRole: user.role,
    authorId: user.id,
    text,
  });
  revalidatePath("/portal");
  revalidatePath("/admin");
}

// ---------- Insurance ----------

export async function updateInsuranceAction(
  patientId: string,
  patch: Partial<Omit<db.InsuranceInfo, "id" | "patientId">>
) {
  await requireSession();
  await db.upsertInsurance(patientId, patch);
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
  const user = await requireSession();
  await db.upsertIntake(user.id, { ...input, submittedAt: new Date().toISOString() });
  revalidatePath("/portal");
}

export async function signConsentAction(type: db.ConsentType, signedName: string) {
  const user = await requireSession();
  await db.upsertConsent(user.id, type, signedName);
  revalidatePath("/portal");
}
