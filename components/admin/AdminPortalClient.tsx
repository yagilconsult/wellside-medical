"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Users,
  NotebookPen,
  ShieldCheck,
  CreditCard,
  Clock,
  Settings,
  Mail,
  User,
  Plus,
  CalendarCheck,
  ShieldAlert,
  UserPlus,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { PortalSidebar, PortalNavItem } from "@/components/PortalSidebar";
import { PortalTopBar } from "@/components/PortalTopBar";
import { PortalWelcomeCard } from "@/components/PortalWelcomeCard";
import { LogoutButton } from "@/components/LogoutButton";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, Field } from "@/components/ui/Input";
import { EditProfileModal } from "@/components/EditProfileModal";
import { MessageThread, ThreadMessage } from "@/components/MessageThread";
import { useToast, Toast } from "@/components/Toast";
import { cn } from "@/lib/utils";
import type { User as DbUser, Appointment, InsuranceInfo } from "@/lib/db";
import {
  updateProfileAction,
  sendMessageAction,
  updateAppointmentStatusAction,
} from "@/lib/actions";

const navItems: PortalNavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "appointments", label: "Appointments", icon: Calendar },
  { key: "patients", label: "Patients", icon: Users },
  { key: "messages", label: "Messages", icon: Mail },
  { key: "notes", label: "Clinical notes", icon: NotebookPen },
  { key: "insurance", label: "Insurance", icon: ShieldCheck },
  { key: "billing", label: "Billing", icon: CreditCard },
  { key: "scheduling", label: "Scheduling", icon: Clock },
  { key: "profile", label: "Profile", icon: User },
  { key: "settings", label: "Settings", icon: Settings },
];

const metricVariants = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

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

const insuranceTone = {
  VERIFIED: "success",
  PENDING: "warning",
  REJECTED: "danger",
  MANUAL_REVIEW: "danger",
} as const;

export function AdminPortalClient({
  provider,
  patients,
  appointments,
  threads,
  insurance,
}: {
  provider: DbUser;
  patients: DbUser[];
  appointments: (Appointment & { patientName: string })[];
  threads: Record<string, ThreadMessage[]>;
  insurance: InsuranceInfo[];
}) {
  const router = useRouter();
  const [active, setActive] = useState("dashboard");
  const [selectedThread, setSelectedThread] = useState(patients[0]?.id ?? "");
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState(patients[0]?.id ?? "");
  const [composeText, setComposeText] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const { message, showToast } = useToast();

  const initials = provider.name.split(" ").map((n) => n[0]).join("");
  const activePatient = patients.find((p) => p.id === selectedThread);

  const today = new Date().toISOString().slice(0, 10);
  const todaysCount = appointments.filter((a) => a.date === today).length;
  const pendingInsurance = insurance.filter((i) => i.status === "PENDING" || i.status === "MANUAL_REVIEW").length;

  async function handleSend(text: string) {
    await sendMessageAction(selectedThread, text);
    router.refresh();
  }

  async function handleStatus(id: string, status: "CONFIRMED" | "COMPLETED") {
    await updateAppointmentStatusAction(id, status);
    showToast(status === "CONFIRMED" ? "Appointment accepted" : "Marked as complete");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <Toast message={message} />

      <EditProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        title="Edit your profile"
        fields={[
          { key: "name", label: "Full name" },
          { key: "email", label: "Email", type: "email" },
          { key: "phone", label: "Phone" },
        ]}
        values={{ name: provider.name, email: provider.email, phone: provider.phone ?? "" }}
        onSave={async (v) => {
          await updateProfileAction({ name: v.name, email: v.email, phone: v.phone });
          showToast("Profile updated");
          router.refresh();
        }}
      />

      <AnimatePresence>
        {composeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-6"
            onClick={() => setComposeOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6"
            >
              <p className="font-medium mb-4">New message</p>
              <div className="space-y-4 mb-6">
                <Field label="To" htmlFor="composeTo">
                  <select
                    id="composeTo"
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Message" htmlFor="composeText">
                  <textarea
                    id="composeText"
                    value={composeText}
                    onChange={(e) => setComposeText(e.target.value)}
                    className="w-full min-h-[90px] rounded-lg border border-border bg-background p-3 text-sm"
                    placeholder="Write your message…"
                  />
                </Field>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setComposeOpen(false)}>Cancel</Button>
                <Button
                  onClick={async () => {
                    if (!composeText.trim()) return;
                    await sendMessageAction(composeTo, composeText);
                    setSelectedThread(composeTo);
                    setActive("messages");
                    setComposeText("");
                    setComposeOpen(false);
                    showToast("Message sent");
                    router.refresh();
                  }}
                >
                  Send
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PortalTopBar name={provider.name} roleLabel="Founder & CEO" initials={initials} />
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
                    eyebrow="Founder & CEO"
                    greeting={`Welcome back, ${provider.name.split(" ")[0]}`}
                    detail="MSN, APRN, PMHNP · WellSide Behavioral Health"
                    initials={initials}
                  />
                  <motion.div
                    variants={{ show: { transition: { staggerChildren: 0.08 } } }}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                  >
                    <Metric icon={CalendarCheck} label="Today's appointments" value={String(todaysCount)} />
                    <Metric
                      icon={ShieldAlert}
                      tone={pendingInsurance > 0 ? "warning" : "success"}
                      label="Pending verifications"
                      value={String(pendingInsurance)}
                    />
                    <Metric icon={Users} label="Total patients" value={String(patients.length)} />
                    <Metric icon={CalendarDays} label="Total appointments" value={String(appointments.length)} />
                  </motion.div>
                  <Card className="p-4">
                    <p className="font-medium text-sm mb-3">Recent activity</p>
                    <div className="space-y-2.5">
                      {[...patients].slice(-3).reverse().map((p) => (
                        <div key={p.id} className="flex items-center gap-2.5 text-sm">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-primary shrink-0">
                            <UserPlus size={13} />
                          </div>
                          <span className="text-muted-foreground">
                            {p.name} joined as a patient
                          </span>
                        </div>
                      ))}
                      {patients.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No patients yet — new signups will appear here.
                        </p>
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {active === "appointments" && (
                <div className="space-y-3">
                  {appointments.length === 0 && (
                    <p className="text-sm text-muted-foreground">No appointments yet.</p>
                  )}
                  {appointments.map((a) => (
                    <Card key={a.id} className="p-4 flex justify-between items-center">
                      <span className="text-sm">
                        {a.patientName} · {a.date} {a.time}
                      </span>
                      <div className="flex items-center gap-2">
                        {a.status === "COMPLETED" && <Badge tone="neutral">Completed</Badge>}
                        {a.status === "CANCELLED" && <Badge tone="danger">Cancelled</Badge>}
                        {a.status === "CONFIRMED" && (
                          <>
                            <Badge tone="success">Confirmed</Badge>
                            <Button size="sm" variant="secondary" onClick={() => handleStatus(a.id, "COMPLETED")}>
                              Complete
                            </Button>
                          </>
                        )}
                        {a.status === "REQUESTED" && (
                          <Button size="sm" variant="secondary" onClick={() => handleStatus(a.id, "CONFIRMED")}>
                            Accept
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {active === "patients" && (
                <div className="divide-y divide-border">
                  {patients.map((p) => {
                    const ins = insurance.find((i) => i.patientId === p.id);
                    return (
                      <Link key={p.id} href={`/admin/patients/${p.id}`}>
                        <motion.div
                          whileHover={{ x: 4, backgroundColor: "hsl(var(--muted))" }}
                          className="flex justify-between items-center py-3 px-2 -mx-2 rounded-lg text-sm"
                        >
                          <span>{p.name}</span>
                          {ins && <Badge tone={insuranceTone[ins.status]}>{ins.status}</Badge>}
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {active === "messages" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-medium text-sm">Conversations</p>
                    <Button size="sm" onClick={() => { setComposeTo(patients[0]?.id ?? ""); setComposeOpen(true); }}>
                      <Plus size={14} />
                      New message
                    </Button>
                  </div>
                  <div className="grid grid-cols-[10rem_1fr] gap-4">
                    <div className="flex flex-col gap-1">
                      {patients.map((p) => {
                        const thread = threads[p.id] ?? [];
                        const last = thread[thread.length - 1];
                        return (
                          <button
                            key={p.id}
                            onClick={() => setSelectedThread(p.id)}
                            className={cn(
                              "text-left rounded-lg px-3 py-2 transition-colors",
                              selectedThread === p.id ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                            )}
                          >
                            <p className="text-sm font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {last ? last.text : "No messages yet"}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                    {activePatient && (
                      <MessageThread
                        key={selectedThread}
                        otherPartyName={activePatient.name}
                        otherPartyInitials={activePatient.name.split(" ").map((n) => n[0]).join("")}
                        messages={threads[selectedThread] ?? []}
                        onSend={handleSend}
                      />
                    )}
                  </div>
                </div>
              )}

              {active === "notes" && (
                <div>
                  <p className="font-medium text-sm mb-4">SOAP note</p>
                  <div className="space-y-3 mb-4">
                    {["Subjective", "Objective", "Assessment", "Plan"].map((label) => (
                      <div key={label}>
                        <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                        <textarea
                          className="w-full min-h-[64px] rounded-lg border border-border bg-background p-3 text-sm"
                          placeholder={`${label}...`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => showToast("Draft saved")}>Save draft</Button>
                    <Button onClick={() => showToast("Note finalized")}>Finalize</Button>
                  </div>
                </div>
              )}

              {active === "insurance" && (
                <div className="divide-y divide-border">
                  {insurance.map((i) => {
                    const p = patients.find((pt) => pt.id === i.patientId);
                    return (
                      <div key={i.id} className="flex justify-between items-center py-3 text-sm">
                        <span>{p?.name} · {i.company}{i.plan ? " " + i.plan : ""}</span>
                        <Badge tone={insuranceTone[i.status]}>{i.status}</Badge>
                      </div>
                    );
                  })}
                </div>
              )}

              {active === "billing" && (
                <div className="space-y-4">
                  <motion.div
                    variants={{ show: { transition: { staggerChildren: 0.08 } } }}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-3 gap-3"
                  >
                    <Metric icon={CheckCircle2} tone="success" label="Completed visits" value={String(appointments.filter((a) => a.status === "COMPLETED").length)} />
                    <Metric icon={CalendarCheck} label="Confirmed visits" value={String(appointments.filter((a) => a.status === "CONFIRMED").length)} />
                    <Metric icon={ShieldAlert} tone="warning" label="Cancelled" value={String(appointments.filter((a) => a.status === "CANCELLED").length)} />
                  </motion.div>
                </div>
              )}

              {active === "scheduling" && (
                <div className="divide-y divide-border">
                  <div className="flex justify-between items-center py-3 text-sm">
                    <span>Monday – Friday</span>
                    <Input type="time" defaultValue="09:00" className="w-32" />
                  </div>
                  <div className="flex justify-between items-center py-3 text-sm">
                    <span>Appointment duration</span>
                    <select className="h-9 rounded-lg border border-border bg-background px-2 text-sm">
                      <option>30 min</option>
                      <option>60 min</option>
                    </select>
                  </div>
                </div>
              )}

              {active === "profile" && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-11 w-11 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-medium">
                      {initials}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{provider.name}</p>
                      <p className="text-sm text-muted-foreground">{provider.email}</p>
                      <p className="text-sm text-muted-foreground">{provider.phone}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-primary">
                      Founder & CEO
                    </span>
                    <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      MSN, APRN, PMHNP
                    </span>
                  </div>
                  <Button variant="secondary" onClick={() => setProfileOpen(true)}>Edit profile</Button>
                </div>
              )}

              {active === "settings" && (
                <div className="divide-y divide-border">
                  <div className="flex justify-between items-center py-3 text-sm">
                    <span>Practice name</span>
                    <Input defaultValue="WellSide Behavioral Health" className="w-56 text-right" />
                  </div>
                  <div className="flex justify-between items-center py-3 text-sm">
                    <span>Two-factor authentication</span>
                    <Button size="sm" variant="secondary" onClick={() => showToast("Two-factor authentication enabled")}>Enable</Button>
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
