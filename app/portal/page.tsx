import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import * as db from "@/lib/db";
import { PatientPortalClient } from "@/components/portal/PatientPortalClient";

export default async function PatientPortalPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PATIENT") {
    redirect("/login");
  }

  const user = await db.findUserById(session.user.id);
  if (!user) redirect("/login");

  const appointments = await db.listAppointmentsForPatient(user.id);
  const rawMessages = await db.listMessagesForThread(user.id);
  const messages = rawMessages.map((m) => ({
    id: m.id,
    from: (m.fromRole === "PATIENT" ? "me" : "them") as "me" | "them",
    text: m.text,
    time: new Date(m.createdAt).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  }));
  const insurance = await db.getInsuranceForPatient(user.id);
  const consents = await db.listConsentsForPatient(user.id);

  return (
    <PatientPortalClient
      user={user}
      appointments={appointments}
      messages={messages}
      insurance={insurance}
      consents={consents}
    />
  );
}
