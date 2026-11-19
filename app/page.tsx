"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
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
  Reveal,
  Eyebrow,
  SectionHead,
  TrustBar,
  ServiceCard,
  WhyCard,
  FeatureCard,
  ChecklistCard,
} from "@/components/landing/Cards";
import { HEADWAY_URL } from "@/lib/links";
import { CallButton } from "@/components/CallButton";

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
const heroItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const heroWord: Variants = {
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
const revealItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={revealItem}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-transform duration-100 active:scale-[0.99]"
      >
        <span className="font-display text-base font-semibold tracking-tight">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
            open ? "bg-gold/20 text-gold-deep" : "bg-sage/20 text-primary"
          }`}
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="overflow-hidden"
      >
        <p className="pb-5 pr-12 text-sm leading-relaxed text-muted-foreground">{a}</p>
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

      <section className="relative overflow-hidden bg-gradient-to-b from-accent via-background to-background">
        <div className="mx-auto max-w-6xl px-6 pb-28 pt-24">
          <SectionHead
            eyebrow="Your first visit"
            title="What to expect when you book with us"
            body="Five simple steps, from booking to your first conversation."
          />
          <TrustBar items={trustBadges} />
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-6 py-28">
        <SectionHead
          eyebrow="Services"
          title="Comprehensive mental health services"
          body="From a single consultation to ongoing care, every service is delivered by video visit with the same provider each time."
        />
        <motion.div
          variants={revealContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
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
        </motion.div>
      </section>

      <section id="meet-wulaimot" className="relative overflow-hidden bg-gradient-to-br from-lavender/[0.09] via-background to-sage/[0.12]">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-28 md:grid-cols-[5fr_6fr]">
          <Reveal className="relative mx-auto w-full max-w-md">
            <div
              aria-hidden="true"
              className="absolute -bottom-5 -left-5 h-full w-full rounded-[2rem] border border-gold/50"
            />
            <div className="relative overflow-hidden rounded-[2rem] shadow-card-hover">
              <Image
                src="/images/wulaimot-akindele.jpg"
                alt="Wulaimot Akindele, MSN, APRN, PMHNP"
                width={500}
                height={500}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Eyebrow>Your provider</Eyebrow>
            <h2 className="mt-5 font-display text-3xl font-semibold md:text-[2.5rem]">
              Meet Wulaimot Akindele
            </h2>
            <p className="mt-2 text-sm font-medium text-primary">MSN, APRN, PMHNP</p>
            <div className="mt-7 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Wulaimot Akindele is a board-certified Psychiatric Mental Health Nurse
                Practitioner and the founder of WellSide Behavioral Health. She works with
                adolescents and adults on the full range of what brings people to therapy,
                from a specific diagnosis to simply not feeling like themselves lately.
              </p>
              <p>
                Her practice focuses on psychiatric evaluations and medication management for
                anxiety, depression, ADHD, PTSD, bipolar disorder, and other mood-related
                concerns.
              </p>
              <p>
                She built WellSide around one goal: make sure every patient feels heard in the
                room, not rushed through it.
              </p>
            </div>
            <div className="mt-9">
              <Link href="/book">
                <Button size="lg">Schedule consultation</Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 py-28">
          <SectionHead
            eyebrow="Telehealth"
            title="See your provider from the comfort of home"
            body="No commute, no waiting room. Just a secure video visit when it works for you."
          />

          <Reveal className="relative mx-auto mb-16 max-w-3xl overflow-hidden rounded-[2rem] border border-border/60 shadow-card-hover">
            <div className="relative aspect-video">
              <TelehealthIllustration />
              <div className="absolute right-4 top-4 flex h-16 w-24 items-center justify-center rounded-xl border border-white/30 bg-white/20 backdrop-blur">
                <span className="text-[10px] font-medium text-white/80">You</span>
              </div>
              <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                <span className="text-[10px] font-medium text-white/90">Live</span>
              </div>
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3">
                {[Mic, Video, MessageCircle].map((Icon, i) => (
                  <span
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur"
                  >
                    <Icon size={15} />
                  </span>
                ))}
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white">
                  <PhoneOff size={15} />
                </span>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {telehealthFeatures.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 0.055} className="h-full">
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={i}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-b from-sage/[0.12] to-background">
        <div className="mx-auto max-w-5xl px-6 py-28">
          <SectionHead
            eyebrow="Why WellSide"
            title="Psychiatric care that feels personal, not clinical"
            body="WellSide was founded by Wulaimot Akindele, a board-certified Psychiatric Mental Health Nurse Practitioner, on a simple idea."
          />
          <div className="grid gap-x-12 gap-y-12 sm:grid-cols-2">
            {whyChoose.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 0.07} className="h-full">
                <WhyCard icon={item.icon} title={item.title} description={item.description} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-28">
        <SectionHead
          eyebrow="Our approach"
          title="Every treatment plan starts with listening"
          body="Not a checklist."
        />
        <Reveal className="rounded-[2rem] border border-gold/30 bg-gradient-to-br from-accent via-background to-lavender/[0.08] p-8 md:p-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-gold/50 ring-offset-2 ring-offset-background">
              <Image
                src="/images/wulaimot-akindele.jpg"
                alt="Wulaimot Akindele, MSN, APRN, PMHNP"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-display font-semibold">Wulaimot Akindele</p>
              <p className="text-sm font-medium text-primary">MSN, APRN, PMHNP</p>
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
              items={["Anxiety & Depression", "ADHD", "PTSD & Trauma", "Mood Disorders & Bipolar"]}
            />
          </div>
        </Reveal>
      </section>

      <section id="insurance" className="mx-auto max-w-5xl px-6 pb-28">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-primary px-8 py-14 text-center text-primary-foreground md:px-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_0%,hsl(var(--lavender)/0.28),transparent),radial-gradient(50%_70%_at_0%_100%,hsl(var(--gold)/0.22),transparent)]"
          />
          <div className="relative">
            <p className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[hsl(37_45%_72%)]">
              <span aria-hidden="true" className="h-px w-8 bg-[hsl(37_45%_72%)]/60" />
              Coverage
            </p>
            <h2 className="mx-auto mt-5 max-w-xl text-balance font-display text-3xl font-semibold md:text-[2.25rem]">
              Use your insurance or pay privately
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-primary-foreground/80">
              Insurance patients book, are billed and have their visits through Headway. Prefer to
              pay privately, or not use your insurance? Book directly here with upfront pricing and
              no surprise bills.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href={HEADWAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center rounded-xl bg-white px-6 text-sm font-semibold text-primary shadow-card transition-transform duration-150 ease-out active:scale-[0.97]"
              >
                Book with insurance on Headway
              </a>
              <Link
                href="/book"
                className="inline-flex h-12 items-center rounded-xl border border-white/40 px-6 text-sm font-semibold text-white transition-[transform,background-color] duration-150 ease-out active:scale-[0.97] [@media(hover:hover)]:hover:bg-white/10"
              >
                Self-pay booking
              </Link>
            </div>
            <p className="mt-5 text-xs text-primary-foreground/60">
              Insurance visits are scheduled and billed through Headway, our insurance partner.
            </p>
          </div>
        </Reveal>
      </section>

      <section id="faq" className="bg-gradient-to-b from-background to-accent/60">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 py-28 md:grid-cols-[2fr_3fr]">
          <Reveal className="md:sticky md:top-28 md:self-start">
            <Eyebrow>Questions</Eyebrow>
            <h2 className="mt-5 text-balance font-display text-3xl font-semibold md:text-[2.25rem]">
              Frequently asked questions
            </h2>
          </Reveal>
          <motion.div
            variants={revealContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="divide-y divide-gold/25 border-y border-gold/25"
          >
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </motion.div>
        </div>
      </section>

      <ReadyCta />
      <Footer />
      <CallButton />
    </main>
  );
}
