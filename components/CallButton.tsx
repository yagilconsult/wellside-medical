"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/links";

/** Always-reachable call button for phones. Tapping opens the dialer with the number ready. */
export function CallButton() {
  return (
    <motion.a
      href={PHONE_HREF}
      aria-label={`Call us at ${PHONE_DISPLAY}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", bounce: 0, duration: 0.3, delay: 0.6 }}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card-hover md:hidden"
    >
      <Phone size={22} />
    </motion.a>
  );
}
