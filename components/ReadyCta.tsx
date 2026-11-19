"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/links";

export function ReadyCta() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-24 pt-4 md:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative overflow-hidden rounded-[2rem] border border-gold/40 bg-gradient-to-br from-accent via-background to-lavender/[0.12] px-8 py-14 text-center md:px-16"
      >
        <p className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep">
          <span aria-hidden="true" className="h-px w-8 bg-gold/70" />
          Ready when you are
          <span aria-hidden="true" className="h-px w-8 bg-gold/70" />
        </p>
        <h2 className="mx-auto mt-5 max-w-xl text-balance font-display text-3xl font-semibold md:text-[2.25rem]">
          Ready to talk to someone?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Book a confidential consultation in minutes, no referral needed.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/book"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-card transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            Book appointment
            <ArrowRight size={16} />
          </Link>
          <a
            href={PHONE_HREF}
            aria-label={`Call us at ${PHONE_DISPLAY}`}
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-gold/50 bg-card px-7 text-sm font-semibold text-primary transition-[transform,background-color] duration-150 ease-out active:scale-[0.97] [@media(hover:hover)]:hover:bg-accent"
          >
            <Phone size={16} />
            {PHONE_DISPLAY}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
