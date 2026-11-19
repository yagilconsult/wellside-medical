"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, MotionConfig, type Variants } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Mail,
  ShieldCheck,
  CreditCard,
  FileText,
  User,
  Wallet,
  ClipboardCheck,
  CheckCircle2,
  Plus,
  Video,
  CalendarPlus,
  ChevronRight,
} from "lucide-react";
import { PortalSidebar, PortalNavItem } from "@/components/PortalSidebar";
import { PortalTopBar } from "@/components/PortalTopBar";
import { PortalWelcomeCard } from "@/components/PortalWelcomeCard";
import { LogoutButton } from "@/components/LogoutButton";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EditProfileModal } from "@/components/EditProfileModal";
import { MessageThread, ThreadMessage } from "@/components/MessageThread";
import { FileUpload } from "@/components/ui/FileUpload";
import { useToast, Toast } from "@/components/Toast";
import { fmtTime, fmtLongDate, fmtShortDate, monthDay, relativeDay } from "@/lib/format";
import type { PublicUser as DbUser, Appointment, InsuranceInfo, ConsentForm } from "@/lib/db";
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

// Motion: strong ease-out for entrances, springs without bounce for physical feedback,
// exits faster than entrances. MotionConfig (below) swaps movement for fades when the
// user prefers reduced motion.
const easeOut = [0.23, 1, 0.32, 1] as const;
const press = { type: "spring", bounce: 0, duration: 0.3 } as const;

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.03 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: easeOut } },
};
const tabVariants: Variants = {
  enter: (d: number) => ({ opacity: 0, y: 8 * d }),
  center: { opacity: 1, y: 0, transition: { duration: 0.24, ease: easeOut } },
  exit: (d: number) => ({ opacity: 0, y: -6 * d, transition: { duration: 0.12, ease: easeOut } }),
};

type Tone = "neutral" | "success" | "warning";

const toneIcon: Record<Tone, string> = {
  neutral: "bg-accent text-primary",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

/** Calendar-style date tile: "JUL / 30". */
function DateBlock({ date, small = false }: { date: string; small?: boolean }) {
  const { month, day } = monthDay(date);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", bounce: 0.25, duration: 0.45 }}
      className={`flex shrink-0 flex-col items-center justify-center rounded-xl bg-accent text-accent-foreground ${
        small ? "h-12 w-12" : "h-16 w-16"
      }`}
    >
      <span className={`font-medium uppercase tracking-wide ${small ? "text-[10px]" : "text-xs"}`}>{month}</span>
      <span className={`font-display font-semibold leading-none ${small ? "text-lg" : "text-2xl"}`}>{day}</span>
    </motion.div>
  );
}

/** Small tappable status tile that jumps to the related tab. */
function StatusTile({
  icon: Icon,
  label,
  value,
  hint,
  tone = "neutral",
  onClick,
}: {
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  label: string;
  value: string;
  hint: string;
  tone?: Tone;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      variants={rise}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={press}
      className="group rounded-2xl border border-border bg-card p-4 text-left shadow-card outline-none transition-shadow duration-200 hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <div className="mb-3 flex items-center justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-200 ease-out group-hover:scale-110 ${toneIcon[tone]}`}
        >
          <Icon size={17} />
        </div>
        <ChevronRight
          size={16}
          className="text-muted-foreground/50 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
        />
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-lg font-semibold leading-tight">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
    </motion.button>
  );
}

function EmptyState({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  title: string;
  hint?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-4 py-8 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
        <Icon size={22} />
      </div>
      <p className="font-medium">{title}</p>
      {hint && <p className="mt-1 max-w-xs text-sm text-muted-foreground">{hint}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 font-display text-xl font-semibold">{children}</h2>;
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
  // Moving to a tab further down enters from below, and vice versa (spatial consistency).
  const dirRef = useRef(1);
  function selectTab(key: string) {
    const order = navItems.map((n) => n.key);
    dirRef.current = order.indexOf(key) >= order.indexOf(active) ? 1 : -1;
    setActive(key);
  }
  const [profileOpen, setProfileOpen] = useState(false);
  const [insuranceUploadOpen, setInsuranceUploadOpen] = useState(false);
  const [uploadCardFrontUrl, setUploadCardFrontUrl] = useState(insurance?.cardFrontUrl);
  const [uploadCardBackUrl, setUploadCardBackUrl] = useState(insurance?.cardBackUrl);
  const { message, showToast } = useToast();

  const initials = user.name.split(" ").map((n) => n[0]).join("");
  const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const upcomingList = appointments.filter((a) => a.status === "CONFIRMED" || a.status === "REQUESTED");
  const upcoming = upcomingList[0];
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
    <MotionConfig reducedMotion="user">
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
          const res = await updateProfileAction({ name: v.name, email: v.email, phone: v.phone });
          if (!res.ok) {
            showToast(res.error ?? "Couldn't update profile");
            return;
          }
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
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: press }}
              exit={{ opacity: 0, scale: 0.97, y: 4, transition: { duration: 0.12, ease: easeOut } }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6"
            >
              <p className="font-medium mb-4">Update insurance card</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <FileUpload
                  id="updCardFront"
                  label="Front"
                  existingUrl={uploadCardFrontUrl}
                  onUploadComplete={setUploadCardFrontUrl}
                />
                <FileUpload
                  id="updCardBack"
                  label="Back"
                  existingUrl={uploadCardBackUrl}
                  onUploadComplete={setUploadCardBackUrl}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setInsuranceUploadOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    await updateInsuranceAction(user.id, {
                      status: "PENDING",
                      cardFrontUrl: uploadCardFrontUrl,
                      cardBackUrl: uploadCardBackUrl,
                    });
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
          <PortalSidebar items={navItems} active={active} onSelect={selectTab} />
          <div className="shrink-0 md:pt-4 md:mt-4 border-t-0 md:border-t border-border">
            <LogoutButton />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait" custom={dirRef.current}>
            <motion.div
              key={active}
              custom={dirRef.current}
              variants={tabVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {active === "dashboard" && (
                <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
                  <PortalWelcomeCard
                    eyebrow="Patient portal"
                    greeting={`Welcome back, ${user.name.split(" ")[0]}`}
                    detail={`Patient since ${memberSince}`}
                    initials={initials}
                  />

                  {!consentsComplete && (
                    <motion.div variants={rise}>
                    <div className="flex flex-col gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 sm:flex-row sm:items-center">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400">
                        <ClipboardCheck size={22} />
                      </div>
                      <div className="flex-1">
                        <p className="font-display text-base font-semibold">Finish your intake forms</p>
                        <p className="text-sm text-muted-foreground">
                          We need these signed before your first visit. It only takes a few minutes.
                        </p>
                      </div>
                      <Link href="/intake">
                        <Button size="sm" className="w-full sm:w-auto">Complete intake</Button>
                      </Link>
                    </div>
                    </motion.div>
                  )}

                  <motion.div variants={rise}>
                  <Card className="p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Your next visit
                      </p>
                      {upcoming && (
                        <Link href="/portal/book" className="text-sm font-medium text-primary hover:underline">
                          Book another
                        </Link>
                      )}
                    </div>
                    {upcoming ? (
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <DateBlock date={upcoming.date} />
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-lg font-semibold leading-snug">{upcoming.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {fmtLongDate(upcoming.date)} at {fmtTime(upcoming.time)}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge tone={upcoming.status === "CONFIRMED" ? "success" : "warning"}>
                              {upcoming.status === "CONFIRMED" ? "Confirmed" : "Awaiting confirmation"}
                            </Badge>
                            {relativeDay(upcoming.date) && (
                              <span className="text-xs text-muted-foreground">{relativeDay(upcoming.date)}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {upcoming.status === "CONFIRMED" && relativeDay(upcoming.date) !== "Date passed" && (
                            <Link href={`/video/${upcoming.id}`} target="_blank">
                              <Button size="sm">
                                {relativeDay(upcoming.date) === "Today" ? (
                                  <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75 animate-ping motion-reduce:animate-none" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-200" />
                                  </span>
                                ) : (
                                  <Video size={14} />
                                )}
                                Join video visit
                              </Button>
                            </Link>
                          )}
                          <Button size="sm" variant="secondary" onClick={() => selectTab("appointments")}>
                            Manage
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <EmptyState
                        icon={CalendarPlus}
                        title="No visit scheduled"
                        hint="Pick a time that works for you. Appointments are held over secure video."
                      >
                        <Link href="/portal/book">
                          <Button size="sm">
                            <Plus size={14} />
                            Book an appointment
                          </Button>
                        </Link>
                      </EmptyState>
                    )}
                  </Card>
                  </motion.div>

                  <motion.div variants={stagger} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <StatusTile
                      icon={ShieldCheck}
                      label="Insurance"
                      value={
                        !insurance
                          ? "Not on file"
                          : insurance.status === "VERIFIED"
                          ? "Verified"
                          : insurance.status === "REJECTED"
                          ? "Needs attention"
                          : "Under review"
                      }
                      hint={
                        !insurance
                          ? "Paying self-pay"
                          : insurance.status === "VERIFIED"
                          ? "Coverage confirmed"
                          : insurance.status === "REJECTED"
                          ? "Please update your card"
                          : "We'll confirm before your visit"
                      }
                      tone={insurance?.status === "VERIFIED" ? "success" : insurance ? "warning" : "neutral"}
                      onClick={() => selectTab("insurance")}
                    />
                    <StatusTile
                      icon={Wallet}
                      label="Balance"
                      value={outstandingBalance}
                      hint={upcoming ? "Due at your visit" : "Nothing due"}
                      onClick={() => selectTab("billing")}
                    />
                    <StatusTile
                      icon={consentsComplete ? CheckCircle2 : ClipboardCheck}
                      label="Intake forms"
                      value={consentsComplete ? "Complete" : "Incomplete"}
                      hint={consentsComplete ? "All forms signed" : "Action needed"}
                      tone={consentsComplete ? "success" : "warning"}
                      onClick={() => selectTab("documents")}
                    />
                  </motion.div>

                  <motion.div variants={rise}>
                  <Card className="p-5">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Recent activity
                    </p>
                    {completed.length > 0 ? (
                      <div className="divide-y divide-border">
                        {completed.slice(0, 3).map((a) => (
                          <div key={a.id} className="flex items-center gap-3 py-2.5 text-sm">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                              <CheckCircle2 size={15} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium">{a.type}</p>
                              <p className="text-xs text-muted-foreground">Completed {fmtShortDate(a.date)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="py-3 text-sm text-muted-foreground">
                        Your completed visits will show up here.
                      </p>
                    )}
                  </Card>
                  </motion.div>
                </motion.div>
              )}

              {active === "appointments" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-semibold">Appointments</h2>
                    <Link href="/portal/book">
                      <Button size="sm">
                        <Plus size={14} />
                        Book another
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Upcoming</p>
                    <AnimatePresence initial={false} mode="popLayout">
                    {upcomingList.map((a) => (
                      <motion.div
                        key={a.id}
                        layout
                        transition={press}
                        exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15, ease: easeOut } }}
                      >
                        <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                          <DateBlock date={a.date} small />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{a.type}</p>
                            <p className="text-xs text-muted-foreground">
                              {fmtLongDate(a.date)} at {fmtTime(a.time)}
                            </p>
                            <Badge tone={a.status === "CONFIRMED" ? "success" : "warning"} className="mt-1.5">
                              {a.status === "CONFIRMED" ? "Confirmed" : "Awaiting confirmation"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {a.status === "CONFIRMED" && relativeDay(a.date) !== "Date passed" && (
                              <Link href={`/video/${a.id}`} target="_blank">
                                <Button size="sm">
                                  <Video size={14} />
                                  Join
                                </Button>
                              </Link>
                            )}
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                selectTab("messages");
                                showToast("Message your provider with a time that works better");
                              }}
                            >
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
                      </motion.div>
                    ))}
                    </AnimatePresence>
                    {upcomingList.length === 0 && (
                      <Card>
                        <EmptyState icon={CalendarPlus} title="No upcoming appointments" hint="Book a time whenever you're ready." />
                      </Card>
                    )}
                  </div>

                  {(completed.length > 0 || appointments.some((a) => a.status === "CANCELLED")) && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Past</p>
                      {[...completed, ...appointments.filter((a) => a.status === "CANCELLED")].map((a) => (
                        <Card key={a.id} className="flex items-center gap-3 p-4">
                          <DateBlock date={a.date} small />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{a.type}</p>
                            <p className="text-xs text-muted-foreground">
                              {fmtShortDate(a.date)} at {fmtTime(a.time)}
                            </p>
                          </div>
                          <Badge tone={a.status === "CANCELLED" ? "danger" : "neutral"}>
                            {a.status === "CANCELLED" ? "Cancelled" : "Completed"}
                          </Badge>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {active === "messages" && (
                <div>
                  <SectionTitle>Messages</SectionTitle>
                  <MessageThread
                    otherPartyName="Wulaimot Akindele"
                    otherPartyInitials="WA"
                    messages={messages}
                    onSend={handleSend}
                  />
                </div>
              )}

              {active === "insurance" && (
                <div>
                  <SectionTitle>Insurance</SectionTitle>
                  <Card className="p-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          insurance?.status === "VERIFIED" ? toneIcon.success : insurance ? toneIcon.warning : toneIcon.neutral
                        }`}
                      >
                        <ShieldCheck size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">
                          {insurance
                            ? [insurance.company, insurance.plan].filter(Boolean).join(" ") || "Insurance card submitted"
                            : "No insurance on file"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {!insurance
                            ? "You're set up as self-pay. Add a card if you'd like us to review your coverage."
                            : insurance.status === "VERIFIED"
                            ? "Coverage confirmed"
                            : insurance.status === "REJECTED"
                            ? "We couldn't verify this card. Please upload a clearer photo."
                            : "Under review. We'll confirm before your visit."}
                        </p>
                      </div>
                      {insurance && (
                        <Badge tone={insurance.status === "VERIFIED" ? "success" : insurance.status === "REJECTED" ? "danger" : "warning"}>
                          {insurance.status === "VERIFIED" ? "Verified" : insurance.status === "REJECTED" ? "Needs attention" : "Under review"}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-5">
                      <Button variant="secondary" onClick={() => setInsuranceUploadOpen(true)}>
                        {insurance ? "Update insurance card" : "Add insurance card"}
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

              {active === "billing" && (
                <div>
                  <SectionTitle>Billing</SectionTitle>
                  <Card className="overflow-hidden">
                    {completed.length > 0 ? (
                      <div className="divide-y divide-border">
                        {completed.map((a) => (
                          <div key={a.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
                            <div>
                              <p className="font-medium">{a.type}</p>
                              <p className="text-xs text-muted-foreground">{fmtShortDate(a.date)}</p>
                            </div>
                            <span className="font-medium">$30.00</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState icon={Wallet} title="No charges yet" hint="Charges for completed visits will appear here." />
                    )}
                    <div className="flex items-center justify-between border-t border-border bg-muted px-5 py-4">
                      <span className="font-medium">Outstanding balance</span>
                      <span className="font-display text-lg font-semibold">{outstandingBalance}</span>
                    </div>
                  </Card>
                </div>
              )}

              {active === "documents" && (
                <div>
                  <SectionTitle>Documents</SectionTitle>
                  <Card className="divide-y divide-border">
                    {(["HIPAA", "TELEHEALTH", "FINANCIAL"] as const).map((type) => {
                      const consent = consents.find((c) => c.type === type);
                      return (
                        <div key={type} className="flex items-center gap-3 px-5 py-4">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${consent ? toneIcon.success : toneIcon.warning}`}>
                            <FileText size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{consentLabels[type]}</p>
                            <p className="text-xs text-muted-foreground">
                              {consent ? `Signed ${fmtShortDate(consent.signedAt.slice(0, 10))}` : "Not signed yet"}
                            </p>
                          </div>
                          {consent ? (
                            <Badge tone="success">Signed</Badge>
                          ) : (
                            <Link href="/intake">
                              <Button size="sm">Sign now</Button>
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </Card>
                </div>
              )}

              {active === "profile" && (
                <div>
                  <SectionTitle>Profile</SectionTitle>
                  <Card className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-semibold text-accent-foreground">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-lg font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">Patient since {memberSince}</p>
                      </div>
                    </div>
                    <dl className="mt-5 divide-y divide-border rounded-xl border border-border text-sm">
                      <div className="flex justify-between gap-4 px-4 py-3">
                        <dt className="text-muted-foreground">Email</dt>
                        <dd className="truncate font-medium">{user.email}</dd>
                      </div>
                      <div className="flex justify-between gap-4 px-4 py-3">
                        <dt className="text-muted-foreground">Phone</dt>
                        <dd className="font-medium">{user.phone || "Not added"}</dd>
                      </div>
                    </dl>
                    <div className="mt-5">
                      <Button variant="secondary" onClick={() => setProfileOpen(true)}>
                        Edit profile
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
    </MotionConfig>
  );
}
