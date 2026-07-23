"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { InsuranceCard } from "@/components/InsuranceCard";
import { useToast, Toast } from "@/components/Toast";
import { updateInsuranceAction } from "@/lib/actions";
import type { User, Appointment, InsuranceInfo, IntakeForm, ConsentForm } from "@/lib/db";

const tabs = ["overview", "insurance", "clinical", "documents", "billing"] as const;
type Tab = (typeof tabs)[number];

const consentLabels: Record<string, string> = {
  HIPAA: "HIPAA consent",
  TELEHEALTH: "Telehealth consent",
  FINANCIAL: "Financial responsibility agreement",
};

const insuranceTone = {
  VERIFIED: "success",
  PENDING: "warning",
  REJECTED: "danger",
  MANUAL_REVIEW: "danger",
} as const;

export function PatientDetailClient({
  patient,
  appointments,
  insurance,
  intake,
  consents,
}: {
  patient: User;
  appointments: Appointment[];
  insurance: InsuranceInfo | undefined;
  intake: IntakeForm | undefined;
  consents: ConsentForm[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [showCard, setShowCard] = useState(false);
  const { message, showToast } = useToast();

  const initials = patient.name.split(" ").map((n) => n[0]).join("");
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;

  async function setInsuranceStatus(status: "VERIFIED" | "REJECTED") {
    await updateInsuranceAction(patient.id, { status });
    showToast(status === "VERIFIED" ? "Insurance marked verified" : "Insurance marked rejected");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Toast message={message} />

      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft size={15} />
        Back to admin portal
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-medium">
          {initials}
        </div>
        <div>
          <p className="font-medium">{patient.name}</p>
          <p className="text-sm text-muted-foreground">
            {patient.dob ? `DOB ${patient.dob} · ` : ""}
            Patient since {new Date(patient.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setShowCard(false); }}
            className={cn(
              "relative rounded-lg px-3.5 py-2 text-sm capitalize",
              tab === t ? "text-accent-foreground font-medium" : "text-muted-foreground hover:bg-muted"
            )}
          >
            {tab === t && (
              <motion.div
                layoutId="patient-tab-highlight"
                className="absolute inset-0 rounded-lg bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{t}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab + String(showCard)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "overview" && (
            <div className="divide-y divide-border">
              <Row label="Email" value={patient.email} />
              <Row label="Phone" value={patient.phone || "—"} />
              <Row
                label="Emergency contact"
                value={
                  intake?.emergencyContactName
                    ? `${intake.emergencyContactName}${intake.emergencyContactPhone ? " · " + intake.emergencyContactPhone : ""}`
                    : "Not on file"
                }
              />
              <Row label="Current medications" value={intake?.currentMedications || "None on file"} />
              <Row
                label="Intake status"
                tone={intake?.submittedAt ? "success" : undefined}
                value={intake?.submittedAt ? "Complete" : "Not submitted"}
              />
            </div>
          )}

          {tab === "insurance" && !showCard && (
            <div>
              {insurance ? (
                <div className="divide-y divide-border mb-4">
                  <Row label="Insurance company" value={insurance.company} />
                  <Row label="Plan" value={insurance.plan || "—"} />
                  <Row label="Member ID" value={insurance.memberId || "—"} />
                  <Row label="Status" tone="success" value={insurance.status} />
                  {insurance.memberId && (
                    <div className="flex justify-between items-center py-3 text-sm">
                      <span className="text-muted-foreground">Uploaded card</span>
                      <button className="text-sm underline" onClick={() => setShowCard(true)}>
                        View
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-4">No insurance on file.</p>
              )}
              {insurance && insurance.status !== "VERIFIED" && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setInsuranceStatus("VERIFIED")}>
                    Mark verified
                  </Button>
                  <Button size="sm" variant="secondary" className="!text-red-600" onClick={() => setInsuranceStatus("REJECTED")}>
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}

          {tab === "insurance" && showCard && insurance && (
            <div>
              <button className="text-sm text-muted-foreground mb-4" onClick={() => setShowCard(false)}>
                ← Back to insurance details
              </button>
              <InsuranceCard
                company={insurance.company}
                plan={insurance.plan || ""}
                memberName={patient.name}
                memberId={insurance.memberId || ""}
                groupNumber={insurance.groupNumber || ""}
                memberServicesPhone="1-800-555-0199"
                claimsAddress="On file with payer"
              />
            </div>
          )}

          {tab === "clinical" && (
            <div>
              <p className="font-medium text-sm mb-1">Behavioral health history</p>
              <p className="text-sm text-muted-foreground mb-4">
                {intake?.behavioralHistory || "Not yet submitted."}
              </p>
              <p className="font-medium text-sm mb-1">Medical history</p>
              <p className="text-sm text-muted-foreground mb-4">
                {intake?.medicalHistory || "Not yet submitted."}
              </p>
              <p className="font-medium text-sm mb-1">Previous treatment</p>
              <p className="text-sm text-muted-foreground">
                {intake?.previousTreatment || "Not yet submitted."}
              </p>
            </div>
          )}

          {tab === "documents" && (
            <div className="divide-y divide-border">
              {(["HIPAA", "TELEHEALTH", "FINANCIAL"] as const).map((type) => {
                const consent = consents.find((c) => c.type === type);
                return (
                  <div key={type} className="flex justify-between items-center py-3 text-sm">
                    <span className="text-muted-foreground">{consentLabels[type]}</span>
                    {consent ? (
                      <Badge tone="success">
                        Signed {new Date(consent.signedAt).toLocaleDateString()}
                      </Badge>
                    ) : (
                      <Badge tone="warning">Not signed</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === "billing" && (
            <div className="divide-y divide-border">
              {appointments.filter((a) => a.status === "COMPLETED").map((a) => (
                <Row key={a.id} label={`${a.date} visit`} value="$30.00 paid" />
              ))}
              {completedCount === 0 && (
                <p className="text-sm text-muted-foreground py-3">No billing history yet.</p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className="flex justify-between items-center py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {tone ? <Badge tone={tone}>{value}</Badge> : <span>{value}</span>}
    </div>
  );
}
