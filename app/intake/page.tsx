import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import * as db from "@/lib/db";
import { IntakeFormClient } from "@/components/portal/IntakeFormClient";

export default async function IntakePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PATIENT") {
    redirect("/login");
  }

  const user = await db.findUserById(session.user.id);
  if (!user) redirect("/login");

  const intake = await db.getIntakeForPatient(user.id);
  const consents = await db.listConsentsForPatient(user.id);

  return (
    <IntakeFormClient
      patientName={user.name}
      existingIntake={intake}
      existingConsents={consents}
    />
  );
}
