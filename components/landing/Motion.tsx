"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
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

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

/**
 * Page-wide tint that drifts sage -> lavender -> sage as you scroll. Two fixed
 * layers behind the content; only their opacity changes (compositor only).
 */
export function ColorShift() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const sage = useTransform(scrollYProgress, [0, 0.12, 0.25, 0.4, 0.65, 0.78, 0.92, 1], [0, 1, 0.4, 0, 0, 1, 0.3, 0]);
  const lav = useTransform(scrollYProgress, [0, 0.35, 0.52, 0.65, 1], [0, 0, 1, 0, 0]);
  if (reduce) return null;
  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ opacity: sage }}
        className="pointer-events-none fixed inset-0 -z-10 bg-[hsl(var(--sage)/0.13)]"
      />
      <motion.div
        aria-hidden="true"
        style={{ opacity: lav }}
        className="pointer-events-none fixed inset-0 -z-10 bg-[hsl(var(--lavender)/0.11)]"
      />
    </>
  );
}

function Word({ word, start, end, progress }: { word: string; start: number; end: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [start, end], [0.22, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{word}</motion.span>{" "}
    </>
  );
}

/** Paragraph whose words fill in from soft grey as it scrolls through the viewport. */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.5"] });
  const words = text.split(" ");
  if (reduce) return <p className={className}>{text}</p>;
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} word={w} start={(i / words.length) * 0.85} end={(i / words.length) * 0.85 + 0.15} progress={scrollYProgress} />
      ))}
    </p>
  );
}
