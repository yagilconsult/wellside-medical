import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import * as db from "@/lib/db";
import { PatientDetailClient } from "@/components/admin/PatientDetailClient";

export default async function PatientProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PROVIDER") {
    redirect("/login");
  }

  const patientRow = await db.findUserById(params.id);
  if (!patientRow || patientRow.role !== "PATIENT") notFound();
  const patient = db.toPublicUser(patientRow);

  const appointments = await db.listAppointmentsForPatient(patient.id);
  const insurance = await db.getInsuranceForPatient(patient.id);
  const intake = await db.getIntakeForPatient(patient.id);
  const consents = await db.listConsentsForPatient(patient.id);

  return (
    <PatientDetailClient
      patient={patient}
      appointments={appointments}
      insurance={insurance}
      intake={intake}
      consents={consents}
    />
  );
}
