"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Heart,
  LifeBuoy,
  Award,
  CheckCircle2,
  Users,
  ShieldCheck,
  Clock,
  Lock,
  ChevronDown,
  FileCheck,
  CalendarClock,
  BadgeDollarSign,
  MapPinned,
  Stethoscope,
  MousePointerClick,
  Wallet,
  Video,
  Mic,
  MessageCircle,
  PhoneOff,
} from "lucide-react";
import { NavMenu } from "@/components/NavMenu";
import { Button } from "@/components/ui/Button";

import { HeroPhotoBackground } from "@/components/HeroPhotoBackground";
import { HeartbeatDivider } from "@/components/HeartbeatDivider";
import { Footer } from "@/components/Footer";
import { TelehealthIllustration } from "@/components/TelehealthIllustration";
import { ReadyCta } from "@/components/ReadyCta";
import {
  TrustBar,
  ServiceCard,
  WhyCard,
  FeatureCard,
  ChecklistCard,
} from "@/components/landing/Cards";
import { HEADWAY_URL } from "@/lib/links";

const services = [
  {
    icon: Brain,
    title: "Individual Therapy",
    description:
      "Regular sessions built around what you're actually dealing with, not a one-size-fits-all treatment plan.",
  },
  {
    icon: Users,
    title: "Family Therapy",
    description:
      "A space for families to work through conflict, transitions, or communication that's broken down.",
  },
  {
    icon: Heart,
    title: "Couples Counseling",
    description:
      "Structured support for couples navigating conflict, trust, or just feeling disconnected from each other.",
  },
  {
    icon: Stethoscope,
    title: "Psychiatric Evaluation",
    description:
      "A thorough clinical assessment to understand what's going on, and whether medication could help.",
  },
  {
    icon: MessageCircle,
    title: "Group Therapy",
    description:
      "Small, therapist-led groups for people working through similar experiences together.",
  },
  {
    icon: LifeBuoy,
    title: "Crisis Support",
    description:
      "If things feel urgent, we'll help you get stabilized and pointed toward the right level of care fast.",
  },
];

const whyChoose = [
  {
    icon: Award,
    title: "Board-Certified PMHNP",
    description:
      "Wulaimot holds advanced training in psychiatric evaluation and medication management, and keeps her clinical knowledge current through ongoing education.",
  },
  {
    icon: ShieldCheck,
    title: "Confidential & Safe",
    description:
      "What you share stays between you and your provider. No judgment, no exceptions.",
  },
  {
    icon: Clock,
    title: "Care That Fits Your Schedule",
    description:
      "Appointments happen over secure video, with scheduling that actually works around your day.",
  },
  {
    icon: CheckCircle2,
    title: "Insurance or Self-Pay",
    description:
      "Use your insurance through Headway, or pay privately with upfront pricing and no surprise bills.",
  },
];

const faqs = [
  {
    q: "How does telehealth work?",
    a: "You'll meet with Wulaimot through a secure video visit from your phone, tablet, or computer. No in-person visit required.",
  },
  {
    q: "Do you accept insurance?",
    a: "Yes, through Headway. Search for Wulaimot on Headway to book and be billed through your insurance. You can also pay privately on this site, with upfront pricing.",
  },
  {
    q: "How do I prepare?",
    a: "Complete your intake forms ahead of time and find a quiet, private space for your appointment.",
  },
  {
    q: "What technology do I need?",
    a: "A smartphone, tablet, or computer with a camera, microphone, and stable internet connection.",
  },
  {
    q: "Can I reschedule?",
    a: "Yes, appointments can be rescheduled from your patient portal up to 24 hours in advance.",
  },
];

const trustBadges = [
  { icon: FileCheck, label: "Licensed, PMHNP-led psychiatric care", title: "Licensed provider", tag: "Clinical" },
  { icon: Lock, label: "Secure, HIPAA-conscious platform", title: "Private by design", tag: "Privacy" },
  { icon: CalendarClock, label: "Same-day & next-day appointments", title: "Fast scheduling", tag: "Access" },
  { icon: BadgeDollarSign, label: "Transparent pricing, no hidden fees", title: "Upfront pricing", tag: "Cost" },
  { icon: MapPinned, label: "Serving patients throughout the state", title: "Statewide care", tag: "Coverage" },
];

const telehealthFeatures = [
  {
    icon: Stethoscope,
    title: "Licensed expert care",
    description: "Board-certified psychiatric care, not a call center script.",
  },
  {
    icon: ShieldCheck,
    title: "Private & protected",
    description: "Your records and conversations are protected under HIPAA, always.",
  },
  {
    icon: MousePointerClick,
    title: "Skip the waiting room",
    description: "Book in minutes and see your provider from anywhere.",
  },
  {
    icon: Wallet,
    title: "Straightforward pricing",
    description: "Clear, upfront costs whether you use insurance or pay out of pocket.",
  },
];

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const heroWord = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const revealContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const revealItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={revealItem}
      className={`overflow-hidden rounded-2xl border bg-card transition-[border-color,box-shadow] duration-300 ${
        open ? "border-primary/30 shadow-card-hover" : "border-border/70 shadow-card hover:border-primary/20"
      }`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition-transform duration-100 active:scale-[0.99]"
      >
        <span className="font-display text-base font-semibold tracking-tight">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
            open ? "bg-primary text-primary-foreground" : "bg-accent text-primary"
          }`}
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{a}</p>
      </motion.div>
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <main>
      <NavMenu />

      <section className="relative overflow-hidden text-white min-h-[600px] md:min-h-[680px] flex flex-col justify-center">
        <HeroPhotoBackground />
        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="show"
          className="relative mx-auto max-w-3xl px-6 pt-28 pb-16 md:pt-36 md:pb-20 text-center"
        >
          <motion.div
            variants={heroItem}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 mb-6 border border-white/25"
          >
            <span className="relative inline-flex h-2 w-2">
              <motion.span
                animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                className="absolute inline-flex h-full w-full rounded-full bg-white"
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <span className="text-xs font-medium tracking-wide uppercase">
              Virtual psychiatric care · Now accepting new patients
            </span>
          </motion.div>

          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-5 leading-tight">
            {"Compassionate behavioral health care,".split(" ").map((word, i) => (
              <motion.span
                key={i}
                variants={heroWord}
                className="inline-block mr-[0.28em]"
              >
                {word}
              </motion.span>
            ))}
            <br />
            <motion.span variants={heroWord} className="inline-block">
              wherever you are
            </motion.span>
          </h1>

          <motion.p variants={heroItem} className="text-white/80 mb-9 max-w-xl mx-auto text-base md:text-lg">
            Receive confidential, personalized behavioral healthcare through
            secure virtual appointments with our provider.
          </motion.p>

          <motion.div variants={heroItem} className="flex flex-wrap justify-center gap-3 mb-12">
            <Link href="/book" className="relative">
              <motion.span
                animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-lg bg-white/40"
                aria-hidden="true"
              />
              <Button size="lg" className="relative !bg-white !text-primary hover:!bg-white/90">
                Book appointment
              </Button>
            </Link>
            <a href={HEADWAY_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary" className="!border-white/40 !text-white hover:!bg-white/10">
                Use insurance
              </Button>
            </a>
          </motion.div>

          <motion.div variants={heroItem} className="h-px bg-white/20 max-w-md mx-auto mb-8" />

          <motion.div
            variants={heroItem}
            className="flex flex-wrap justify-center gap-x-10 gap-y-4"
          >
            {[
              { title: "Board", subtitle: "Certified PMHNP" },
              { title: "1:1", subtitle: "Personalized Care" },
              { title: "All Ages", subtitle: "Adolescents & Adults" },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <p className="font-display text-lg font-semibold">{item.title}</p>
                <p className="text-xs text-white/70">{item.subtitle}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex justify-center pb-6 text-white/70"
          aria-hidden="true"
        >
          <ChevronDown size={20} />
        </motion.div>
      </section>

      <HeartbeatDivider className="bg-accent" />

      <section className="relative overflow-hidden bg-gradient-to-b from-accent via-accent/40 to-transparent">
        {/* Fine teal dot grid that fades out toward the bottom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(hsl(var(--primary)/0.14)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />
        {/* Soft glows: one behind the top-left of the staircase, one where it lands */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-primary/[0.12] blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Your first visit
            </p>
            <h2 className="font-display text-2xl font-semibold md:text-3xl">
              What to expect when you book with us
            </h2>
          </motion.div>
          <TrustBar items={trustBadges} />
        </div>
      </section>

      <motion.section
        id="services"
        variants={revealContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto max-w-5xl px-6 py-20 text-center"
      >
        <motion.h2
          variants={revealItem}
          className="font-display text-2xl md:text-3xl font-semibold mb-3"
        >
          Comprehensive Mental Health Services
        </motion.h2>
        <motion.p variants={revealItem} className="text-muted-foreground mb-12 max-w-2xl mx-auto">
          From a single consultation to ongoing care, every service is
          delivered by video visit with the same provider each time.
        </motion.p>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {services.map((service, i) => (
            <motion.div key={service.title} variants={revealItem} className="h-full">
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                index={i}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        id="meet-wulaimot"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mx-auto max-w-5xl px-6 py-20"
      >
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <motion.div
            variants={{ hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0 } }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl overflow-hidden shadow-lg"
          >
            <motion.div
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -inset-4 rounded-3xl bg-primary/20 blur-2xl -z-10"
              aria-hidden="true"
            />
            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.4 }}>
              <Image
                src="/images/wulaimot-akindele.jpg"
                alt="Wulaimot Akindele, MSN, APRN, PMHNP"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
          <motion.div
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
            }}
          >
            <motion.h2 variants={revealItem} className="font-display text-2xl font-semibold mb-1">
              Meet Wulaimot Akindele
            </motion.h2>
            <motion.p variants={revealItem} className="text-sm font-medium text-primary mb-5">
              MSN, APRN, PMHNP
            </motion.p>
            <motion.p variants={revealItem} className="text-muted-foreground mb-4">
              Wulaimot Akindele is a board-certified Psychiatric Mental
              Health Nurse Practitioner and the founder of WellSide
              Behavioral Health. She works with adolescents and adults on
              the full range of what brings people to therapy, from a
              specific diagnosis to simply not feeling like themselves
              lately.
            </motion.p>
            <motion.p variants={revealItem} className="text-muted-foreground mb-4">
              Her practice focuses on psychiatric evaluations and medication
              management for anxiety, depression, ADHD, PTSD, bipolar
              disorder, and other mood-related concerns.
            </motion.p>
            <motion.p variants={revealItem} className="text-muted-foreground mb-8">
              She built WellSide around one goal: make sure every patient
              feels heard in the room, not rushed through it.
            </motion.p>
            <motion.div variants={revealItem}>
              <Link href="/book">
                <Button size="lg">Schedule consultation</Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <section className="relative overflow-hidden">
        <motion.div
          animate={{ opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3">
              See your provider from the comfort of home
            </h2>
            <p className="text-muted-foreground">
              No commute, no waiting room. Just a secure video visit when it
              works for you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-border mb-14"
          >
            <div className="relative aspect-video">
              <TelehealthIllustration />

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute top-4 right-4 h-16 w-24 rounded-lg bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center"
              >
                <span className="text-[10px] text-white/80 font-medium">You</span>
              </motion.div>

              <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-black/25 backdrop-blur px-2.5 py-1">
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="h-1.5 w-1.5 rounded-full bg-red-400"
                />
                <span className="text-[10px] text-white/90 font-medium">Live</span>
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                {[Mic, Video, MessageCircle].map((Icon, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.12 }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur text-white"
                  >
                    <Icon size={15} />
                  </motion.div>
                ))}
                <motion.div
                  animate={{ boxShadow: ["0 0 0 0 rgba(220,38,38,0.4)", "0 0 0 8px rgba(220,38,38,0)"] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white"
                >
                  <PhoneOff size={15} />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {telehealthFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-muted overflow-hidden">
        <motion.div
          animate={{ transform: ["translate(0px, 0px)", "translate(20px, -15px)", "translate(0px, 0px)"] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -top-16 right-[-4rem] h-64 w-64 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <motion.div
          variants={revealContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative mx-auto max-w-5xl px-6 py-20"
        >
          <motion.h2
            variants={revealItem}
            className="font-display text-2xl md:text-3xl font-semibold text-center mb-3"
          >
            Why Choose WellSide Behavioral Health
          </motion.h2>
          <motion.p
            variants={revealItem}
            className="text-muted-foreground text-center max-w-2xl mx-auto mb-12"
          >
            WellSide was founded by Wulaimot Akindele, a board-certified
            Psychiatric Mental Health Nurse Practitioner, on a simple idea:
            psychiatric care should feel personal, not clinical.
          </motion.p>
          <div className="grid gap-5 sm:grid-cols-2">
            {whyChoose.map((item) => (
              <motion.div key={item.title} variants={revealItem} className="h-full">
                <WhyCard icon={item.icon} title={item.title} description={item.description} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3">
            Our Approach to Care
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every treatment plan starts with listening, not a checklist.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-muted p-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 rounded-full overflow-hidden shrink-0">
              <Image
                src="/images/wulaimot-akindele.jpg"
                alt="Wulaimot Akindele, MSN, APRN, PMHNP"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">Wulaimot Akindele</p>
              <p className="text-sm text-primary font-medium">MSN, APRN, PMHNP</p>
              <p className="text-sm text-muted-foreground">
                Founder &amp; Psychiatric Mental Health Nurse Practitioner
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ChecklistCard
              title="Clinical expertise"
              items={[
                "Psychiatric Evaluations",
                "Medication Management",
                "Evidence-Based Strategies",
                "Holistic Treatment Planning",
              ]}
            />
            <ChecklistCard
              title="Specializations"
              items={[
                "Anxiety & Depression",
                "ADHD",
                "PTSD & Trauma",
                "Mood Disorders & Bipolar",
              ]}
            />
          </div>
        </motion.div>
      </section>

      <motion.section
        id="insurance"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl px-6 py-20 text-center"
      >
        <h2 className="font-display text-2xl font-semibold mb-3">
          Use your insurance or pay privately
        </h2>
        <p className="text-muted-foreground mb-8">
          Insurance patients book, are billed and have their visits through
          Headway. Prefer to pay privately, or not use your insurance? Book
          directly here with upfront pricing and no surprise bills.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href={HEADWAY_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg">Book with insurance on Headway</Button>
          </a>
          <Link href="/book">
            <Button size="lg" variant="secondary">
              Self-pay booking
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Insurance visits are scheduled and billed through Headway, our insurance partner.
        </p>
      </motion.section>

      <section id="faq" className="bg-muted">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl font-semibold text-center mb-10"
          >
            Frequently asked questions
          </motion.h2>
          <motion.div
            variants={revealContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-4"
          >
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </motion.div>
        </div>
      </section>

      <ReadyCta />
      <Footer />
    </main>
  );
}
