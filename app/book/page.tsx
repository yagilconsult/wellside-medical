"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, ShieldCheck, Wallet, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { FileUpload } from "@/components/ui/FileUpload";
import { SoftCard } from "@/components/ui/Card";
import { BookingStepper, StepDef } from "@/components/BookingStepper";
import { cn } from "@/lib/utils";
import { createAppointmentAction, updateInsuranceAction } from "@/lib/actions";

const ALL_STEPS: (StepDef & { conditional?: boolean })[] = [
  { key: "details", label: "Details" },
  { key: "payment", label: "Payment" },
  { key: "insurance", label: "Insurance", conditional: true },
  { key: "estimate", label: "Estimate" },
  { key: "account", label: "Account" },
];

const APPOINTMENT_PRICING: Record<string, number> = {
  "Initial evaluation (60 min)": 200,
  "Follow-up (30 min)": 120,
  "Medication management (30 min)": 140,
};

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
};

export default function BookingFlowPage() {
  const router = useRouter();
  const [usesInsurance, setUsesInsurance] = useState(true);
  const [[stepIndex, direction], setStepIndex] = useState<[number, number]>([0, 1]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [appt, setAppt] = useState({
    type: "Initial evaluation (60 min)",
    date: "",
    time: "",
  });
  const [patient, setPatient] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    email: "",
    emergencyContact: "",
  });
  const [insuranceForm, setInsuranceForm] = useState({
    company: "",
    plan: "",
    memberId: "",
    groupNumber: "",
  });
  const [password, setPassword] = useState("");

  const steps = useMemo(
    () => ALL_STEPS.filter((s) => !s.conditional || usesInsurance),
    [usesInsurance]
  );
  const currentKey = steps[stepIndex]?.key ?? steps[steps.length - 1].key;
  const isLast = stepIndex === steps.length - 1;
  const sessionFee = APPOINTMENT_PRICING[appt.type] ?? 150;

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const stepIsValid: Record<string, boolean> = {
    details: Boolean(
      appt.date &&
        appt.time &&
        patient.firstName.trim() &&
        patient.lastName.trim() &&
        patient.dob &&
        patient.phone.trim() &&
        patient.email.trim() &&
        isValidEmail(patient.email)
    ),
    payment: true,
    insurance: Boolean(insuranceForm.company.trim() && insuranceForm.memberId.trim()),
    estimate: true,
    account: password.length >= 8,
  };

  const canContinue = stepIsValid[currentKey] ?? true;
  const estimatedCoverage = Math.round(sessionFee * 0.8);
  const estimatedCopay = sessionFee - estimatedCoverage;

  function goTo(newIndex: number, dir: number) {
    setStepIndex([Math.max(0, Math.min(steps.length - 1, newIndex)), dir]);
  }

  async function next() {
    if (!canContinue) return;

    if (!isLast) {
      goTo(stepIndex + 1, 1);
      return;
    }

    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${patient.firstName} ${patient.lastName}`.trim(),
        email: patient.email,
        phone: patient.phone,
        password,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong creating your account.");
      setSubmitting(false);
      return;
    }

    await createAppointmentAction({
      patientId: data.id,
      type: appt.type,
      date: appt.date,
      time: appt.time,
      paymentMethod: usesInsurance ? "INSURANCE" : "SELF_PAY",
    });

    if (usesInsurance && insuranceForm.company) {
      await updateInsuranceAction(data.id, {
        company: insuranceForm.company,
        plan: insuranceForm.plan,
        memberId: insuranceForm.memberId,
        groupNumber: insuranceForm.groupNumber,
        status: "PENDING",
      });
    }

    const signInResult = await signIn("credentials", {
      email: patient.email,
      password,
      redirect: false,
    });

    setSubmitting(false);

    if (signInResult?.error) {
      router.push("/login");
      return;
    }

    setSuccess(true);
    await new Promise((r) => setTimeout(r, 1100));
    router.push("/intake");
    router.refresh();
  }

  function back() {
    goTo(stepIndex - 1, -1);
  }

  if (success) {
    return (
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary"
        >
          <Check size={28} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-display text-xl font-semibold mb-2"
        >
          Appointment confirmed
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-sm text-muted-foreground"
        >
          Your account is ready. Taking you to your intake forms…
        </motion.p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-12 overflow-hidden">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={15} />
        Back to homepage
      </Link>

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
            <div>
              <p className="font-medium mb-1">Appointment & patient details</p>
              <p className="text-sm text-muted-foreground mb-1">
                Tell us when you&apos;d like to meet and a little about
                yourself.
              </p>
              <p className="text-xs text-muted-foreground/70 mb-5">
                Fields marked <span className="text-red-600">*</span> are required.
              </p>
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

                <div className="h-px bg-border my-2" />

                <div className="grid grid-cols-2 gap-4">
                  <Field label="First name" htmlFor="firstName" required>
                    <Input
                      id="firstName"
                      value={patient.firstName}
                      onChange={(e) => setPatient((p) => ({ ...p, firstName: e.target.value }))}
                      placeholder="Jordan"
                    />
                  </Field>
                  <Field label="Last name" htmlFor="lastName" required>
                    <Input
                      id="lastName"
                      value={patient.lastName}
                      onChange={(e) => setPatient((p) => ({ ...p, lastName: e.target.value }))}
                      placeholder="Rivera"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Date of birth" htmlFor="dob" required>
                    <Input
                      id="dob"
                      type="date"
                      value={patient.dob}
                      onChange={(e) => setPatient((p) => ({ ...p, dob: e.target.value }))}
                    />
                  </Field>
                  <Field label="Phone" htmlFor="phone" required>
                    <Input
                      id="phone"
                      value={patient.phone}
                      onChange={(e) => setPatient((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="(555) 555-0132"
                    />
                  </Field>
                </div>
                <Field label="Email" htmlFor="email" required>
                  <Input
                    id="email"
                    type="email"
                    value={patient.email}
                    onChange={(e) => setPatient((p) => ({ ...p, email: e.target.value }))}
                    placeholder="name@email.com"
                  />
                </Field>
                <Field label="Emergency contact" htmlFor="emergency" optional>
                  <Input
                    id="emergency"
                    value={patient.emergencyContact}
                    onChange={(e) => setPatient((p) => ({ ...p, emergencyContact: e.target.value }))}
                    placeholder="Name and phone"
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
              <p className="font-medium mb-1">Insurance verification</p>
              <p className="text-xs text-muted-foreground/70 mb-4">
                Fields marked <span className="text-red-600">*</span> are required.
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Insurance company" htmlFor="insCompany" required>
                    <Input
                      id="insCompany"
                      value={insuranceForm.company}
                      onChange={(e) => setInsuranceForm((f) => ({ ...f, company: e.target.value }))}
                      placeholder="Blue Cross Blue Shield"
                    />
                  </Field>
                  <Field label="Plan" htmlFor="plan" optional>
                    <Input
                      id="plan"
                      value={insuranceForm.plan}
                      onChange={(e) => setInsuranceForm((f) => ({ ...f, plan: e.target.value }))}
                      placeholder="PPO 500"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Member ID" htmlFor="memberId" required>
                    <Input
                      id="memberId"
                      value={insuranceForm.memberId}
                      onChange={(e) => setInsuranceForm((f) => ({ ...f, memberId: e.target.value }))}
                      placeholder="XYZ123456789"
                    />
                  </Field>
                  <Field label="Group number" htmlFor="groupNumber" optional>
                    <Input
                      id="groupNumber"
                      value={insuranceForm.groupNumber}
                      onChange={(e) => setInsuranceForm((f) => ({ ...f, groupNumber: e.target.value }))}
                      placeholder="00123"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FileUpload id="cardFront" label="Insurance card front" optional />
                  <FileUpload id="cardBack" label="Insurance card back" optional />
                </div>
              </div>
            </div>
          )}

          {currentKey === "estimate" && (
            <div>
              <p className="font-medium mb-4">Estimated cost</p>
              <SoftCard className="p-6">
                {usesInsurance && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="flex items-center gap-2 text-primary font-medium text-sm mb-4"
                  >
                    <Check size={16} />
                    Insurance verification pending
                  </motion.div>
                )}
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-between text-base font-medium pt-3"
                >
                  <span>{usesInsurance ? "Your estimated copay" : "Amount due"}</span>
                  <span>${usesInsurance ? estimatedCopay.toFixed(2) : sessionFee.toFixed(2)}</span>
                </motion.div>
              </SoftCard>
            </div>
          )}

          {currentKey === "account" && (
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 rounded-lg bg-accent p-4 mb-5"
              >
                <UserPlus size={18} className="text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-accent-foreground">
                  One last thing — we&apos;ll set up your secure{" "}
                  <strong>client portal</strong> so you can manage
                  appointments, message your provider, and view records
                  anytime.
                </p>
              </motion.div>
              <p className="font-medium mb-2">Create your secure patient account</p>
              <p className="text-sm text-muted-foreground mb-4">
                Manage appointments, join video visits, view records, and receive reminders.
              </p>
              <Field label="Password" htmlFor="password" required>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  minLength={8}
                />
              </Field>
              {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
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
          {submitting ? "Creating account…" : isLast ? "Confirm appointment" : "Continue"}
        </Button>
      </div>
    </main>
  );
}
