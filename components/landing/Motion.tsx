"use client";

import { useRef } from "react";
import type { PointerEvent } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/** Thin gold-to-lavender bar that fills as the page scrolls. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-gold via-lavender to-sage"
    />
  );
}

/** Slow drifting colour wash. Transform only; off when reduced motion is set. */
export function Ambient({
  className,
  drift = 28,
  duration = 16,
}: {
  className?: string;
  drift?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full blur-3xl", className)}
      animate={reduce ? undefined : { x: [0, drift, 0], y: [0, -drift * 0.7, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/** Moves its child slightly against the scroll direction. */
export function Parallax({
  children,
  distance = 36,
  className,
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

/** Gold hairline that draws itself in once. */
export function DrawLine({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.span
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
      className={cn("block origin-left", className)}
    />
  );
}

/** Pointer handler that feeds --mx/--my to a card's spotlight. */
export function trackSpot(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

/** Soft light that follows the cursor inside a `group` card (hover devices only). */
export function Spot() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100 bg-[radial-gradient(220px_circle_at_var(--mx,50%)_var(--my,0%),hsl(var(--gold)/0.16),hsl(var(--lavender)/0.08)_45%,transparent_70%)]"
    />
  );
}
