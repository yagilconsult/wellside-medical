"use client";

import { motion } from "framer-motion";

export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        animate={{ x: [0, 30, -10, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -25, 15, 0], y: [0, 15, -15, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-[-6rem] h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 15, -20, 0], y: [0, -10, 20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-teal-300/15 blur-3xl"
      />

      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20"
      />
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/25"
      />
    </div>
  );
}
