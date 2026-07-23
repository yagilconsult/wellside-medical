import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import * as db from "@/lib/db";
import { AdminPortalClient } from "@/components/admin/AdminPortalClient";
import { ThreadMessage } from "@/components/MessageThread";

export default async function AdminPortalPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PROVIDER") {
    redirect("/login");
  }

  const provider = await db.findUserById(session.user.id);
  if (!provider) redirect("/login");

  const patients = await db.listPatients();
  const allAppointments = await db.listAllAppointments();
  const appointments = allAppointments.map((a) => ({
    ...a,
    patientName: patients.find((p) => p.id === a.patientId)?.name ?? "Unknown patient",
  }));

  const rawThreads = await db.listThreadSummaries();
  const threads: Record<string, ThreadMessage[]> = {};
  for (const p of patients) {
    threads[p.id] = (rawThreads[p.id] ?? []).map((m) => ({
      id: m.id,
      from: (m.fromRole === "PROVIDER" ? "me" : "them") as "me" | "them",
      text: m.text,
      time: new Date(m.createdAt).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    }));
  }

  const insurance = await db.listAllInsurance();

  return (
    <AdminPortalClient
      provider={provider}
      patients={patients}
      appointments={appointments}
      threads={threads}
      insurance={insurance}
    />
  );
}
