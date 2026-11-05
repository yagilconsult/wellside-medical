"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PulseDot } from "@/components/PulseDot";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/links";

export function ReadyCta() {
  return (
    <section className="mx-auto max-w-4xl px-6 pt-4 pb-20 md:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -4 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 mb-3">
            <PulseDot />
            <span className="text-xs font-medium text-primary">
              Ready when you are
            </span>
          </div>
          <p className="font-display text-xl md:text-2xl font-semibold mb-1">
            Ready to talk to someone?
          </p>
          <p className="text-sm text-muted-foreground">
            Book a confidential consultation in minutes, no referral needed.
          </p>
        </div>

        <div className="relative flex shrink-0 flex-col items-center gap-3 sm:flex-row">
          <a href={PHONE_HREF} aria-label={`Call us at ${PHONE_DISPLAY}`}>
            <Button size="lg" variant="secondary">
              <Phone size={16} />
              {PHONE_DISPLAY}
            </Button>
          </a>
          <Link href="/book">
            <Button size="lg">
              Book appointment
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
