"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { FileUpload } from "@/components/ui/FileUpload";
import { SoftCard } from "@/components/ui/Card";
import { BookingStepper, StepDef } from "@/components/BookingStepper";
import { cn } from "@/lib/utils";
import { estimateCost } from "@/lib/pricing";
import { createAppointmentAction, updateInsuranceAction } from "@/lib/actions";
import type { InsuranceInfo } from "@/lib/db";

const ALL_STEPS: (StepDef & { conditional?: boolean })[] = [
  { key: "details", label: "Details" },
  { key: "payment", label: "Payment" },
  { key: "insurance", label: "Insurance", conditional: true },
  { key: "estimate", label: "Confirm" },
];

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
};

export function BookAgainClient({
  patientId,
  existingInsurance,
}: {
  patientId: string;
  existingInsurance: InsuranceInfo | undefined;
}) {
  const router = useRouter();
  const [usesInsurance, setUsesInsurance] = useState(true);
  const [[stepIndex, direction], setStepIndex] = useState<[number, number]>([0, 1]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [appt, setAppt] = useState({
    type: "Follow-up (30 min)",
    date: "",
    time: "",
  });
  const [insuranceForm, setInsuranceForm] = useState({
    company: existingInsurance?.company ?? "",
    plan: existingInsurance?.plan ?? "",
    memberId: existingInsurance?.memberId ?? "",
    groupNumber: existingInsurance?.groupNumber ?? "",
  });

  const steps = useMemo(
    () => ALL_STEPS.filter((s) => !s.conditional || usesInsurance),
    [usesInsurance]
  );
  const currentKey = steps[stepIndex]?.key ?? steps[steps.length - 1].key;
  const isLast = stepIndex === steps.length - 1;
  const { sessionFee, estimatedCoverage, estimatedCopay } = estimateCost(appt.type);

  const canContinue =
    currentKey === "details" ? Boolean(appt.date && appt.time) : true;

  function goTo(newIndex: number, dir: number) {
    setStepIndex([Math.max(0, Math.min(steps.length - 1, newIndex)), dir]);
  }

  async function next() {
    if (!canContinue) return;

    if (!isLast) {
      goTo(stepIndex + 1, 1);
      return;
    }

    setSubmitting(true);

    await createAppointmentAction({
      patientId,
      type: appt.type,
      date: appt.date,
      time: appt.time,
      paymentMethod: usesInsurance ? "INSURANCE" : "SELF_PAY",
    });

    if (usesInsurance && insuranceForm.company) {
      await updateInsuranceAction(patientId, {
        company: insuranceForm.company,
        plan: insuranceForm.plan,
        memberId: insuranceForm.memberId,
        groupNumber: insuranceForm.groupNumber,
      });
    }

    setSubmitting(false);
    setSuccess(true);
    await new Promise((r) => setTimeout(r, 1100));
    router.push("/portal");
    router.refresh();
  }

  function back() {
    goTo(stepIndex - 1, -1);
  }

  if (success) {
    return (
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary"
        >
          <Check size={28} />
        </motion.div>
        <h1 className="font-display text-xl font-semibold mb-2">Appointment booked</h1>
        <p className="text-sm text-muted-foreground">Taking you back to your portal…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-12 overflow-hidden">
      <Link
        href="/portal"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={15} />
        Back to portal
      </Link>

      <p className="font-display text-lg font-semibold mb-1">Book another appointment</p>
      <p className="text-sm text-muted-foreground mb-8">
        We already have your details on file, just pick a time.
      </p>

      <BookingStepper steps={steps} currentIndex={stepIndex} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentKey}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {currentKey === "details" && (
            <div className="space-y-4">
              <Field label="Appointment type" htmlFor="apptType" required>
                <select
                  id="apptType"
                  value={appt.type}
                  onChange={(e) => setAppt((a) => ({ ...a, type: e.target.value }))}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                >
                  <option>Initial evaluation (60 min)</option>
                  <option>Follow-up (30 min)</option>
                  <option>Medication management (30 min)</option>
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Date" htmlFor="date" required>
                  <Input
                    id="date"
                    type="date"
                    value={appt.date}
                    onChange={(e) => setAppt((a) => ({ ...a, date: e.target.value }))}
                  />
                </Field>
                <Field label="Time" htmlFor="time" required>
                  <Input
                    id="time"
                    type="time"
                    value={appt.time}
                    onChange={(e) => setAppt((a) => ({ ...a, time: e.target.value }))}
                  />
                </Field>
              </div>
            </div>
          )}

          {currentKey === "payment" && (
            <div>
              <p className="font-medium mb-4">Payment method</p>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setUsesInsurance(true)}
                  className={cn(
                    "rounded-lg border p-4 text-center text-sm",
                    usesInsurance
                      ? "border-2 border-primary text-primary font-medium"
                      : "border-border"
                  )}
                >
                  <ShieldCheck size={18} className="mx-auto mb-2" />
                  Use insurance
                </motion.button>
                <motion.button
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setUsesInsurance(false)}
                  className={cn(
                    "rounded-lg border p-4 text-center text-sm",
                    !usesInsurance
                      ? "border-2 border-primary text-primary font-medium"
                      : "border-border"
                  )}
                >
                  <Wallet size={18} className="mx-auto mb-2" />
                  Self pay
                </motion.button>
              </div>
            </div>
          )}

          {currentKey === "insurance" && (
            <div>
              <p className="font-medium mb-1">Insurance on file</p>
              <p className="text-xs text-muted-foreground mb-4">
                Already up to date? Just continue, otherwise update it below.
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Insurance company" htmlFor="insCompany">
                    <Input
                      id="insCompany"
                      value={insuranceForm.company}
                      onChange={(e) => setInsuranceForm((f) => ({ ...f, company: e.target.value }))}
                    />
                  </Field>
                  <Field label="Plan" htmlFor="plan" optional>
                    <Input
                      id="plan"
                      value={insuranceForm.plan}
                      onChange={(e) => setInsuranceForm((f) => ({ ...f, plan: e.target.value }))}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Member ID" htmlFor="memberId">
                    <Input
                      id="memberId"
                      value={insuranceForm.memberId}
                      onChange={(e) => setInsuranceForm((f) => ({ ...f, memberId: e.target.value }))}
                    />
                  </Field>
                  <Field label="Group number" htmlFor="groupNumber" optional>
                    <Input
                      id="groupNumber"
                      value={insuranceForm.groupNumber}
                      onChange={(e) => setInsuranceForm((f) => ({ ...f, groupNumber: e.target.value }))}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FileUpload id="cardFront" label="Updated card front" optional />
                  <FileUpload id="cardBack" label="Updated card back" optional />
                </div>
              </div>
            </div>
          )}

          {currentKey === "estimate" && (
            <div>
              <p className="font-medium mb-4">Review & confirm</p>
              <SoftCard className="p-6">
                <div className="flex justify-between text-sm py-2 border-b border-border/60">
                  <span className="text-muted-foreground">Appointment</span>
                  <span>{appt.type}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-border/60">
                  <span className="text-muted-foreground">Date & time</span>
                  <span>{appt.date} at {appt.time}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-border/60">
                  <span className="text-muted-foreground">Session fee</span>
                  <span>${sessionFee.toFixed(2)}</span>
                </div>
                {usesInsurance && (
                  <div className="flex justify-between text-sm py-2 border-b border-border/60">
                    <span className="text-muted-foreground">Estimated insurance coverage</span>
                    <span>-${estimatedCoverage.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-medium pt-3">
                  <span>{usesInsurance ? "Your estimated copay" : "Amount due"}</span>
                  <span>${usesInsurance ? estimatedCopay.toFixed(2) : sessionFee.toFixed(2)}</span>
                </div>
              </SoftCard>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-10">
        <Button
          variant="secondary"
          onClick={back}
          className={stepIndex === 0 ? "invisible" : ""}
        >
          Back
        </Button>
        <Button onClick={next} disabled={submitting || !canContinue}>
          {submitting ? "Booking…" : isLast ? "Confirm appointment" : "Continue"}
        </Button>
      </div>
    </main>
  );
}
