"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { PulseDot } from "@/components/PulseDot";

const quickLinks = [
  { label: "Our Services", href: "/#services" },
  { label: "About Us", href: "/#meet-wulaimot" },
  { label: "Insurance", href: "/#insurance" },
  { label: "Contact", href: "/book" },
];

const serviceLinks = [
  "Individual Therapy",
  "Family Therapy",
  "Couples Counseling",
  "Psychiatric Evaluation",
  "Group Therapy",
  "Crisis Intervention",
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "HIPAA Notice", href: "/hipaa" },
];

const revealContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const revealItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function Footer() {
  return (
    <footer className="relative bg-[hsl(172_42%_15%)] text-primary-foreground overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 right-[-6rem] h-80 w-80 rounded-full bg-white/5 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-[-6rem] h-72 w-72 rounded-full bg-emerald-300/5 blur-3xl"
        />
      </div>

      <motion.div
        variants={revealContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative mx-auto max-w-6xl px-6 py-16"
      >
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <motion.div variants={revealItem}>
            <div className="flex items-center gap-2.5 mb-3">
              <Image
                src="/images/logo.png"
                alt="WellSide Behavioral Health"
                width={36}
                height={40}
                className="h-9 w-auto shrink-0"
              />
              <p className="font-display font-semibold leading-tight">
                WellSide Behavioral Health
              </p>
            </div>
            <p className="text-sm text-primary-foreground/75 mb-4">
              Founded by Wulaimot Akindele, MSN, APRN, PMHNP — psychiatric
              care built around the person in front of her, delivered
              entirely by secure video visit.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
              <PulseDot />
              <span className="text-xs font-medium">
                Now accepting new patients
              </span>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div variants={revealItem}>
            <p className="text-sm font-medium mb-4">Quick Links</p>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <motion.li key={link.label} whileHover={{ x: 4 }}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/75 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={revealItem}>
            <p className="text-sm font-medium mb-4">Services</p>
            <ul className="space-y-2.5">
              {serviceLinks.map((label) => (
                <motion.li key={label} whileHover={{ x: 4 }}>
                  <Link
                    href="/#services"
                    className="text-sm text-primary-foreground/75 hover:text-primary-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={revealItem}>
            <p className="text-sm font-medium mb-4">Contact Info</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-primary-foreground/75">
                <Mail size={15} className="mt-0.5 shrink-0" />
                bookings@wellsidebehavioralhealth.com
              </li>
              <li className="flex items-start gap-2 text-sm text-primary-foreground/75">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                Virtual telehealth services
                <br />
                Serving patients statewide
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          variants={revealItem}
          className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} WellSide Behavioral Health. All
            rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
