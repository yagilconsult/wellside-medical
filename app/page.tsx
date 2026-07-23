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
import { Card } from "@/components/ui/Card";
import { HeroPhotoBackground } from "@/components/HeroPhotoBackground";
import { HeartbeatDivider } from "@/components/HeartbeatDivider";
import { Footer } from "@/components/Footer";
import { TelehealthIllustration } from "@/components/TelehealthIllustration";
import { ReadyCta } from "@/components/ReadyCta";

const services = [
  {
    icon: Brain,
    title: "Individual Therapy",
    description:
      "One-on-one sessions tailored to your needs, focused on personal growth and lasting mental wellness.",
  },
  {
    icon: Users,
    title: "Family Therapy",
    description:
      "Strengthen family bonds and build healthier communication through collaborative, therapeutic support.",
  },
  {
    icon: Heart,
    title: "Couples Counseling",
    description:
      "Evidence-based techniques to help you and your partner communicate, connect, and grow together.",
  },
  {
    icon: Stethoscope,
    title: "Psychiatric Evaluation",
    description:
      "Comprehensive mental health assessments and medication management from a licensed provider.",
  },
  {
    icon: MessageCircle,
    title: "Group Therapy",
    description:
      "Connect with others facing similar challenges in a supportive, professionally guided setting.",
  },
  {
    icon: LifeBuoy,
    title: "Crisis Intervention",
    description:
      "Urgent guidance and support during acute mental health crises, with a clear path to immediate care.",
  },
];

const whyChoose = [
  {
    icon: Award,
    title: "Board-Certified PMHNP",
    description:
      "Led by Wulaimot Akindele, a board-certified Psychiatric Mental Health Nurse Practitioner with advanced training in psychiatric care and medication management.",
  },
  {
    icon: ShieldCheck,
    title: "Confidential & Safe",
    description:
      "We hold ourselves to the highest privacy standards and create a safe, judgment-free space for healing.",
  },
  {
    icon: Clock,
    title: "Virtual Telehealth Convenience",
    description:
      "Every appointment is conducted virtually through a secure platform, with flexible scheduling that fits your life.",
  },
  {
    icon: CheckCircle2,
    title: "Insurance Accepted",
    description:
      "We accept most major insurance plans and offer transparent, affordable self-pay options.",
  },
];

const faqs = [
  {
    q: "How does telehealth work?",
    a: "You'll meet with Wulaimot through a secure video visit from your phone, tablet, or computer — no in-person visit required.",
  },
  {
    q: "Do you accept insurance?",
    a: "Yes. We verify your coverage before your first appointment and provide an estimated copay in advance.",
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
  { icon: FileCheck, label: "Licensed U.S. behavioral health providers" },
  { icon: Lock, label: "Fully HIPAA-conscious & secure" },
  { icon: CalendarClock, label: "Same-day & next-day appointments" },
  { icon: BadgeDollarSign, label: "Transparent pricing, no hidden fees" },
  { icon: MapPinned, label: "Proudly serving patients nationwide" },
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
    description: "Your health information is secured to HIPAA standards.",
  },
  {
    icon: MousePointerClick,
    title: "Skip the waiting room",
    description: "Book in minutes and see your provider from anywhere.",
  },
  {
    icon: Wallet,
    title: "Value-driven care",
    description: "Clear, upfront costs whether you use insurance or self-pay.",
  },
];

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
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
  show: { transition: { staggerChildren: 0.1 } },
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
      className="rounded-lg bg-background border border-border overflow-hidden"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-medium text-sm">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown size={16} className="text-muted-foreground" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="text-sm text-muted-foreground px-5 pb-5">{a}</p>
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
              Virtual telehealth services · Compassionate care
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
            <Link href="/book?step=insurance">
              <Button size="lg" variant="secondary" className="!border-white/40 !text-white hover:!bg-white/10">
                Verify insurance
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={heroItem} className="h-px bg-white/20 max-w-md mx-auto mb-8" />

          <motion.div
            variants={heroItem}
            className="flex flex-wrap justify-center gap-x-10 gap-y-4"
          >
            {[
              { title: "Board", subtitle: "Certified PMHNP" },
              { title: "Holistic", subtitle: "Patient-Centered Care" },
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

      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-xl md:text-2xl font-semibold text-center mb-10"
        >
          Trusted care you can count on
        </motion.h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {trustBadges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className={i % 2 === 1 ? "sm:mt-6" : ""}
            >
              <Card className="p-5 h-full">
                <motion.div
                  whileHover={{ scale: 1.12, rotate: -6 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"
                >
                  <badge.icon size={18} />
                </motion.div>
                <p className="text-sm font-medium leading-snug">{badge.label}</p>
              </Card>
            </motion.div>
          ))}
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
          We offer a full range of evidence-based mental health services
          designed to support your journey toward wellness.
        </motion.p>
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              variants={revealItem}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="text-left"
            >
              <Card className="p-6 h-full rounded-xl">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-primary"
                >
                  <service.icon size={20} />
                </motion.div>
                <p className="font-medium mb-2">{service.title}</p>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </Card>
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
              show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
            }}
          >
            <motion.h2 variants={revealItem} className="font-display text-2xl font-semibold mb-1">
              Meet Wulaimot Akindele
            </motion.h2>
            <motion.p variants={revealItem} className="text-sm font-medium text-primary mb-5">
              MSN, APRN, PMHNP
            </motion.p>
            <motion.p variants={revealItem} className="text-muted-foreground mb-4">
              Wulaimot Akindele is a board-certified Psychiatric Mental Health
              Nurse Practitioner and the founder of WellSide Behavioral
              Health. She brings extensive expertise in providing
              compassionate, evidence-based psychiatric care to adolescents
              and adults.
            </motion.p>
            <motion.p variants={revealItem} className="text-muted-foreground mb-4">
              Wulaimot specializes in psychiatric evaluations and medication
              management for a wide range of conditions including anxiety
              disorders, depression, ADHD, PTSD, bipolar disorder, and mood
              regulation challenges.
            </motion.p>
            <motion.p variants={revealItem} className="text-muted-foreground mb-8">
              At WellSide Behavioral Health, Wulaimot is committed to
              fostering a supportive, respectful environment where every
              patient feels heard, understood, and valued on their journey to
              mental health.
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
              No commute, no waiting room — just a secure video visit when it
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

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {telehealthFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary"
                >
                  <feature.icon size={18} />
                </motion.div>
                <p className="text-sm font-medium mb-1">{feature.title}</p>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-muted overflow-hidden">
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
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
            Founded by Wulaimot Akindele, MSN, APRN, PMHNP, we provide
            exceptional psychiatric mental health care with compassion,
            clinical expertise, and evidence-based approaches tailored to
            your unique needs.
          </motion.p>
          <div className="grid gap-5 sm:grid-cols-2">
            {whyChoose.map((item) => (
              <motion.div
                key={item.title}
                variants={revealItem}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="p-6 h-full rounded-xl text-left">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary"
                  >
                    <item.icon size={18} />
                  </motion.div>
                  <p className="font-medium mb-1.5">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </Card>
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
            At WellSide Behavioral Health, we believe in comprehensive,
            patient-centered psychiatric care.
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
            <div className="rounded-xl bg-background p-5">
              <p className="font-medium text-sm mb-3">Clinical Expertise</p>
              <ul className="space-y-1.5">
                {[
                  "Psychiatric Evaluations",
                  "Medication Management",
                  "Evidence-Based Strategies",
                  "Holistic Treatment Planning",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-background p-5">
              <p className="font-medium text-sm mb-3">Specializations</p>
              <ul className="space-y-1.5">
                {[
                  "Anxiety & Depression",
                  "ADHD",
                  "PTSD & Trauma",
                  "Mood Disorders & Bipolar",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
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
          We verify your coverage before your first appointment and give you
          an estimated copay in advance, with secure billing throughout.
        </p>
        <Link href="/book">
          <Button size="lg" variant="secondary">
            Verify your insurance
          </Button>
        </Link>
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
