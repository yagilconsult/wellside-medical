"use client";

import { motion } from "framer-motion";

export function PulseDot() {
  return (
    <span className="relative inline-flex h-2 w-2">
      <motion.span
        animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        className="absolute inline-flex h-full w-full rounded-full bg-primary"
      />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
    </span>
  );
}
