import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import * as db from "@/lib/db";
import { BookAgainClient } from "@/components/portal/BookAgainClient";

export default async function PortalBookPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "PATIENT") {
    redirect("/login");
  }

  const user = await db.findUserById(session.user.id);
  if (!user) redirect("/login");

  const existingInsurance = await db.getInsuranceForPatient(user.id);

  return <BookAgainClient patientId={user.id} existingInsurance={existingInsurance} />;
}
