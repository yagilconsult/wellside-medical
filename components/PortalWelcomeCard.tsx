"use client";

import { motion } from "framer-motion";

export function PortalWelcomeCard({
  eyebrow,
  greeting,
  detail,
  initials,
}: {
  eyebrow: string;
  greeting: string;
  detail: string;
  initials: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground p-6 mb-6"
    >
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -12, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-16 right-[-3rem] h-52 w-52 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 rounded-full bg-white/15 flex items-center justify-center text-lg font-semibold">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-primary-foreground/70 mb-0.5">
            {eyebrow}
          </p>
          <p className="font-display text-xl font-semibold truncate">{greeting}</p>
          <p className="text-sm text-primary-foreground/75">{detail}</p>
        </div>
      </div>
    </motion.div>
  );
}
