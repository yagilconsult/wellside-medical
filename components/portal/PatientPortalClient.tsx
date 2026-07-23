"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Mail,
  ShieldCheck,
  CreditCard,
  FileText,
  User,
  CalendarClock,
  Wallet,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";
import { PortalSidebar, PortalNavItem } from "@/components/PortalSidebar";
import { PortalTopBar } from "@/components/PortalTopBar";
import { PortalWelcomeCard } from "@/components/PortalWelcomeCard";
import { LogoutButton } from "@/components/LogoutButton";
import { Card, SoftCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EditProfileModal } from "@/components/EditProfileModal";
import { MessageThread, ThreadMessage } from "@/components/MessageThread";
import { FileUpload } from "@/components/ui/FileUpload";
import { useToast, Toast } from "@/components/Toast";
import type { User as DbUser, Appointment, InsuranceInfo, ConsentForm } from "@/lib/db";
import {
  updateProfileAction,
  sendMessageAction,
  updateAppointmentStatusAction,
  updateInsuranceAction,
} from "@/lib/actions";

const navItems: PortalNavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "appointments", label: "Appointments", icon: Calendar },
  { key: "messages", label: "Messages", icon: Mail },
  { key: "insurance", label: "Insurance", icon: ShieldCheck },
  { key: "billing", label: "Billing", icon: CreditCard },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "profile", label: "Profile", icon: User },
];

const metricVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

function Metric({
  label,
  value,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  tone?: "neutral" | "success" | "warning";
}) {
  const toneClasses = {
    neutral: "bg-accent text-primary",
    success: "bg-emerald-500/10 text-emerald-600",
    warning: "bg-amber-500/10 text-amber-600",
  };
  return (
    <motion.div variants={metricVariants} className="rounded-lg bg-muted p-4">
      <div className={`mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
        <Icon size={15} />
      </div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-medium">{value}</p>
    </motion.div>
  );
}

const consentLabels: Record<string, string> = {
  HIPAA: "HIPAA consent",
  TELEHEALTH: "Telehealth consent",
  FINANCIAL: "Financial responsibility agreement",
};

export function PatientPortalClient({
  user,
  appointments,
  messages,
  insurance,
  consents,
}: {
  user: DbUser;
  appointments: Appointment[];
  messages: ThreadMessage[];
  insurance: InsuranceInfo | undefined;
  consents: ConsentForm[];
}) {
  const router = useRouter();
  const [active, setActive] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const [insuranceUploadOpen, setInsuranceUploadOpen] = useState(false);
  const { message, showToast } = useToast();

  const initials = user.name.split(" ").map((n) => n[0]).join("");
  const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const upcoming = appointments.find((a) => a.status === "CONFIRMED" || a.status === "REQUESTED");
  const completed = appointments.filter((a) => a.status === "COMPLETED");
  const outstandingBalance = upcoming ? "$30.00" : "$0.00";
  const consentsComplete = ["HIPAA", "TELEHEALTH", "FINANCIAL"].every((t) =>
    consents.some((c) => c.type === t)
  );

  async function handleCancel(id: string) {
    await updateAppointmentStatusAction(id, "CANCELLED");
    showToast("Appointment cancelled");
    router.refresh();
  }

  async function handleSend(text: string) {
    await sendMessageAction(user.id, text);
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <Toast message={message} />

      <EditProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        fields={[
          { key: "name", label: "Full name" },
          { key: "email", label: "Email", type: "email" },
          { key: "phone", label: "Phone" },
        ]}
        values={{ name: user.name, email: user.email, phone: user.phone ?? "" }}
        onSave={async (v) => {
          await updateProfileAction({ name: v.name, email: v.email, phone: v.phone });
          showToast("Profile updated");
          router.refresh();
        }}
      />

      <AnimatePresence>
        {insuranceUploadOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-6"
            onClick={() => setInsuranceUploadOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6"
            >
              <p className="font-medium mb-4">Update insurance card</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <FileUpload id="updCardFront" label="Front" />
                <FileUpload id="updCardBack" label="Back" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setInsuranceUploadOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    await updateInsuranceAction(user.id, { status: "PENDING" });
                    setInsuranceUploadOpen(false);
                    showToast("Insurance card submitted for review");
                    router.refresh();
                  }}
                >
                  Submit
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PortalTopBar name={user.name} roleLabel="Patient" initials={initials} />
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="flex flex-row md:flex-col justify-between md:h-full w-full md:w-40 md:shrink-0">
          <PortalSidebar items={navItems} active={active} onSelect={setActive} />
          <div className="shrink-0 md:pt-4 md:mt-4 border-t-0 md:border-t border-border">
            <LogoutButton />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {active === "dashboard" && (
                <div className="space-y-4">
                  <PortalWelcomeCard
                    eyebrow="Patient portal"
                    greeting={`Welcome back, ${user.name.split(" ")[0]}`}
                    detail={`Patient since ${memberSince}`}
                    initials={initials}
                  />
                  <motion.div
                    variants={{ show: { transition: { staggerChildren: 0.08 } } }}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                  >
                    <Metric
                      icon={CalendarClock}
                      label="Upcoming appointment"
                      value={upcoming ? `${upcoming.date} ${upcoming.time}` : "None scheduled"}
                    />
                    <Metric icon={Wallet} label="Outstanding balance" value={outstandingBalance} />
                    <Metric
                      icon={ShieldCheck}
                      tone={insurance?.status === "VERIFIED" ? "success" : "warning"}
                      label="Insurance status"
                      value={insurance ? insurance.status : "Not on file"}
                    />
                    <Metric
                      icon={consentsComplete ? CheckCircle2 : ClipboardCheck}
                      tone={consentsComplete ? "success" : "warning"}
                      label="Intake status"
                      value={consentsComplete ? "Complete" : "Action needed"}
                    />
                  </motion.div>
                  {!consentsComplete && (
                    <SoftCard className="p-4 flex items-center justify-between">
                      <p className="text-sm">
                        Your intake forms and consents are incomplete.
                      </p>
                      <Link href="/intake">
                        <Button size="sm">Complete intake</Button>
                      </Link>
                    </SoftCard>
                  )}
                  <Card className="p-4">
                    <p className="font-medium text-sm mb-3">Recent activity</p>
                    <div className="space-y-2.5">
                      {completed.length > 0 ? (
                        completed.slice(0, 3).map((a) => (
                          <div key={a.id} className="flex items-center gap-2.5 text-sm">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-primary shrink-0">
                              <CheckCircle2 size={13} />
                            </div>
                            <span className="text-muted-foreground">
                              Completed visit on {a.date}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No completed visits yet — your history will appear here.
                        </p>
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {active === "appointments" && (
                <div className="space-y-6">
                  <div>
                    <p className="font-medium text-sm mb-2">Upcoming</p>
                    {appointments
                      .filter((a) => a.status === "CONFIRMED" || a.status === "REQUESTED")
                      .map((a) => (
                        <Card key={a.id} className="p-4 flex justify-between items-center mb-2">
                          <span className="text-sm">
                            {a.type} · {a.date} {a.time}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge tone={a.status === "CONFIRMED" ? "success" : "warning"}>
                              {a.status === "CONFIRMED" ? "Confirmed" : "Requested"}
                            </Badge>
                            <Button size="sm" variant="secondary" onClick={() => showToast("Reschedule request sent")}>
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="!text-red-600"
                              onClick={() => handleCancel(a.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </Card>
                      ))}
                    {appointments.filter((a) => a.status === "CONFIRMED" || a.status === "REQUESTED").length === 0 && (
                      <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-2">Past</p>
                    {[...completed, ...appointments.filter((a) => a.status === "CANCELLED")].map((a) => (
                      <Card key={a.id} className="p-4 flex justify-between items-center mb-2">
                        <span className="text-sm">
                          {a.type} · {a.date} {a.time}
                        </span>
                        <Badge tone={a.status === "CANCELLED" ? "danger" : "neutral"}>
                          {a.status === "CANCELLED" ? "Cancelled" : "Completed"}
                        </Badge>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {active === "messages" && (
                <MessageThread
                  otherPartyName="Wulaimot Akindele"
                  otherPartyInitials="WA"
                  messages={messages}
                  onSend={handleSend}
                />
              )}

              {active === "insurance" && (
                <div className="space-y-4">
                  <SoftCard className="p-4 flex items-center gap-2 text-primary font-medium text-sm">
                    <ShieldCheck size={16} />
                    {insurance
                      ? `${insurance.status.charAt(0) + insurance.status.slice(1).toLowerCase()} · ${insurance.company}${insurance.plan ? " " + insurance.plan : ""}`
                      : "No insurance on file"}
                  </SoftCard>
                  <Button variant="secondary" onClick={() => setInsuranceUploadOpen(true)}>
                    Update insurance card
                  </Button>
                </div>
              )}

              {active === "billing" && (
                <div className="divide-y divide-border">
                  {completed.map((a) => (
                    <div key={a.id} className="flex justify-between text-sm py-3 items-center">
                      <span className="text-muted-foreground">
                        {a.date} visit copay
                      </span>
                      <div className="flex items-center gap-3">
                        <span>$30.00</span>
                        <button onClick={() => showToast("Receipt downloaded")} className="text-xs underline text-primary">
                          Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between text-base font-medium py-3">
                    <span>Outstanding balance</span>
                    <span>{outstandingBalance}</span>
                  </div>
                </div>
              )}

              {active === "documents" && (
                <div className="divide-y divide-border">
                  {(["HIPAA", "TELEHEALTH", "FINANCIAL"] as const).map((type) => {
                    const consent = consents.find((c) => c.type === type);
                    return (
                      <div key={type} className="flex justify-between text-sm py-3 items-center">
                        <span className="text-muted-foreground">{consentLabels[type]}</span>
                        {consent ? (
                          <Badge tone="success">
                            Signed {new Date(consent.signedAt).toLocaleDateString()}
                          </Badge>
                        ) : (
                          <Link href="/intake" className="text-xs underline text-primary">
                            Sign now
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {active === "profile" && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-11 w-11 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-medium">
                      {initials}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted px-4 py-3 mb-4 inline-block">
                    <p className="text-xs text-muted-foreground">Patient since</p>
                    <p className="text-sm font-medium">{memberSince}</p>
                  </div>
                  <div>
                    <Button variant="secondary" onClick={() => setProfileOpen(true)}>
                      Edit profile
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
