"use client";

import { motion, useReducedMotion } from "framer-motion";

const PULSE_PATH =
  "M0 40 L280 40 L320 40 L345 12 L370 68 L395 40 L430 40 L455 24 L480 40 L1200 40";

export function HeartbeatDivider({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={`w-full overflow-hidden ${className}`} aria-hidden="true">
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-full h-16 text-primary/40">
          <path
            d={PULSE_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`w-full h-16 overflow-hidden relative ${className}`} aria-hidden="true">
      <motion.div
        className="flex h-full"
        style={{ width: "200%" }}
        animate={{ x: ["-50%", "0%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-1/2 h-full text-primary/40 shrink-0">
          <path
            d={PULSE_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-1/2 h-full text-primary/40 shrink-0">
          <path
            d={PULSE_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
