"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { submitIntakeAction, signConsentAction } from "@/lib/actions";
import type { IntakeForm as IntakeFormData, ConsentForm, ConsentType } from "@/lib/db";

const consentCopy: Record<ConsentType, { title: string; body: string }> = {
  HIPAA: {
    title: "HIPAA consent",
    body: "I acknowledge that I have been given access to WellSide Behavioral Health's Notice of Privacy Practices, and I consent to the use and disclosure of my protected health information for treatment, payment, and healthcare operations as described in that notice.",
  },
  TELEHEALTH: {
    title: "Telehealth consent",
    body: "I understand that my care will be delivered via secure video visits rather than in person, and that telehealth has both benefits and limitations. I consent to receiving behavioral health treatment via telehealth.",
  },
  FINANCIAL: {
    title: "Financial responsibility agreement",
    body: "I understand that I am financially responsible for any costs not covered by insurance, including copays, deductibles, and self-pay fees, and I agree to WellSide Behavioral Health's billing and cancellation policies.",
  },
};

export function IntakeFormClient({
  patientName,
  existingIntake,
  existingConsents,
}: {
  patientName: string;
  existingIntake: IntakeFormData | undefined;
  existingConsents: ConsentForm[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    medicalHistory: existingIntake?.medicalHistory ?? "",
    behavioralHistory: existingIntake?.behavioralHistory ?? "",
    currentMedications: existingIntake?.currentMedications ?? "",
    previousTreatment: existingIntake?.previousTreatment ?? "",
    emergencyContactName: existingIntake?.emergencyContactName ?? "",
    emergencyContactPhone: existingIntake?.emergencyContactPhone ?? "",
  });

  const [signatures, setSignatures] = useState<Record<ConsentType, string>>({
    HIPAA: existingConsents.find((c) => c.type === "HIPAA")?.signedName ?? "",
    TELEHEALTH: existingConsents.find((c) => c.type === "TELEHEALTH")?.signedName ?? "",
    FINANCIAL: existingConsents.find((c) => c.type === "FINANCIAL")?.signedName ?? "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const nameMatches = (type: ConsentType) =>
    signatures[type].trim().toLowerCase() === patientName.trim().toLowerCase() &&
    signatures[type].trim().length > 0;

  const allSigned = (Object.keys(consentCopy) as ConsentType[]).every(nameMatches);

  async function handleFinish() {
    setSaving(true);
    await submitIntakeAction(form);
    for (const type of Object.keys(consentCopy) as ConsentType[]) {
      await signConsentAction(type, signatures[type]);
    }
    setSaving(false);
    router.push("/portal");
    router.refresh();
  }

  const steps = ["History", "Consents", "Review"];

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <Link
        href="/portal"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ChevronLeft size={15} />
        Back to portal
      </Link>

      <h1 className="font-display text-2xl font-semibold mb-1">
        Complete your intake
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        This information helps Wulaimot prepare for your first visit.
      </p>

      <div className="flex gap-2 mb-8">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Field label="Medical history" htmlFor="medicalHistory">
              <textarea
                id="medicalHistory"
                value={form.medicalHistory}
                onChange={(e) => update("medicalHistory", e.target.value)}
                className="w-full min-h-[80px] rounded-lg border border-border bg-background p-3 text-sm"
                placeholder="Any relevant medical conditions, surgeries, or hospitalizations"
              />
            </Field>
            <Field label="Behavioral health history" htmlFor="behavioralHistory">
              <textarea
                id="behavioralHistory"
                value={form.behavioralHistory}
                onChange={(e) => update("behavioralHistory", e.target.value)}
                className="w-full min-h-[80px] rounded-lg border border-border bg-background p-3 text-sm"
                placeholder="Prior diagnoses, hospitalizations, or significant life events"
              />
            </Field>
            <Field label="Current medications" htmlFor="currentMedications">
              <textarea
                id="currentMedications"
                value={form.currentMedications}
                onChange={(e) => update("currentMedications", e.target.value)}
                className="w-full min-h-[60px] rounded-lg border border-border bg-background p-3 text-sm"
                placeholder="Name, dose, and frequency"
              />
            </Field>
            <Field label="Previous treatment" htmlFor="previousTreatment">
              <textarea
                id="previousTreatment"
                value={form.previousTreatment}
                onChange={(e) => update("previousTreatment", e.target.value)}
                className="w-full min-h-[60px] rounded-lg border border-border bg-background p-3 text-sm"
                placeholder="Previous therapy, psychiatric care, or medication trials"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Emergency contact name" htmlFor="emergencyContactName">
                <input
                  id="emergencyContactName"
                  value={form.emergencyContactName}
                  onChange={(e) => update("emergencyContactName", e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                />
              </Field>
              <Field label="Emergency contact phone" htmlFor="emergencyContactPhone">
                <input
                  id="emergencyContactPhone"
                  value={form.emergencyContactPhone}
                  onChange={(e) => update("emergencyContactPhone", e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                />
              </Field>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="consents"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {(Object.keys(consentCopy) as ConsentType[]).map((type) => (
              <Card key={type} className="p-5">
                <p className="font-medium text-sm mb-2">{consentCopy[type].title}</p>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  {consentCopy[type].body}
                </p>
                <Field label={`Type your full legal name to sign (${patientName})`} htmlFor={type}>
                  <input
                    id={type}
                    value={signatures[type]}
                    onChange={(e) =>
                      setSignatures((s) => ({ ...s, [type]: e.target.value }))
                    }
                    placeholder={patientName}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                  />
                </Field>
                {nameMatches(type) && (
                  <p className="flex items-center gap-1.5 text-xs text-primary mt-2">
                    <Check size={12} /> Signed
                  </p>
                )}
              </Card>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-5 divide-y divide-border">
              <div className="py-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Medical history</span>
                <span className="text-right max-w-[60%] truncate">{form.medicalHistory || "—"}</span>
              </div>
              <div className="py-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Emergency contact</span>
                <span>{form.emergencyContactName || "—"}</span>
              </div>
              {(Object.keys(consentCopy) as ConsentType[]).map((type) => (
                <div key={type} className="py-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">{consentCopy[type].title}</span>
                  <span className="flex items-center gap-1.5 text-primary">
                    <Check size={13} /> {signatures[type]}
                  </span>
                </div>
              ))}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <Button
          variant="secondary"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={step === 0 ? "invisible" : ""}
        >
          Back
        </Button>
        {step < 2 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 1 && !allSigned}
          >
            Continue
          </Button>
        ) : (
          <Button onClick={handleFinish} disabled={saving}>
            {saving ? "Submitting…" : "Submit intake"}
          </Button>
        )}
      </div>
    </main>
  );
}
