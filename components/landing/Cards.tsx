"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DrawLine, Spot, trackSpot } from "@/components/landing/Motion";

/**
 * Landing-page building blocks: calm, airy, premium. Gold is used only for
 * small accents (eyebrows, hairlines, numerals); lavender and sage appear as
 * soft tints. Motion is one gentle reveal (once) and a quiet hover lift, both
 * transform/opacity only. MotionProvider handles reduced motion.
 */

const ease = [0.23, 1, 0.32, 1] as const;
const lift = { type: "spring", bounce: 0, duration: 0.3 } as const;

/** Fade-up reveal, plays once when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Small-caps gold label with a hairline. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep",
        className
      )}
    >
      <DrawLine className="h-px w-8 bg-gold/70" />
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  body,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal className={cn("mb-14 max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-5 text-balance font-display text-3xl font-semibold md:text-[2.5rem]">{title}</h2>
      {body && <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{body}</p>}
    </Reveal>
  );
}

const tones = [
  "bg-sage/20 text-primary",
  "bg-lavender/15 text-[hsl(280_25%_38%)]",
  "bg-gold/15 text-gold-deep",
];

export function IconTile({
  icon: Icon,
  tone = 0,
  size = "md",
}: {
  icon: LucideIcon;
  tone?: number;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-out [@media(hover:hover)]:group-hover:-rotate-6 [@media(hover:hover)]:group-hover:scale-110",
        size === "md" ? "h-12 w-12" : "h-10 w-10",
        tones[tone % tones.length]
      )}
    >
      <Icon size={size === "md" ? 21 : 18} strokeWidth={1.6} />
    </span>
  );
}

const cardBase =
  "group relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-card " +
  "transition-[border-color,box-shadow] duration-300 [@media(hover:hover)]:hover:border-gold/40 [@media(hover:hover)]:hover:shadow-card-hover";

/** "What to expect": numbered steps joined by a hairline. */
export function TrustBar({
  items,
}: {
  items: { icon: LucideIcon; label: string; title: string; tag: string }[];
}) {
  return (
    <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
      <DrawLine className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent lg:block" />
      {items.map((item, i) => (
        <motion.li
          key={item.label}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: i * 0.055, ease }}
          className="group relative text-center"
        >
          <motion.span
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: "spring", bounce: 0.25, duration: 0.6, delay: 0.1 + i * 0.07 }}
            className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-background shadow-card transition-[background-color,border-color,transform] duration-300 [@media(hover:hover)]:group-hover:-translate-y-1 [@media(hover:hover)]:group-hover:border-primary [@media(hover:hover)]:group-hover:bg-primary"
          >
            <item.icon size={20} strokeWidth={1.6} className="text-primary transition-colors duration-300 [@media(hover:hover)]:group-hover:text-primary-foreground" />
          </motion.span>
          <p className="mt-4 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep">
            {String(i + 1).padStart(2, "0")} · {item.tag}
          </p>
          <p className="mt-2 text-balance font-display text-base font-semibold leading-snug">{item.label}</p>
          <p className="mt-1.5 text-sm text-muted-foreground">{item.title}</p>
        </motion.li>
      ))}
    </ol>
  );
}

export function ServiceCard({
  icon,
  title,
  description,
  index,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.article onPointerMove={trackSpot} whileHover={{ y: -3 }} transition={lift} className={cn(cardBase, "h-full p-7 text-left")}>
      <Spot />
      <div className="relative flex items-start justify-between">
        <IconTile icon={icon} tone={index} />
        <span aria-hidden="true" className="font-display text-sm font-semibold tracking-widest text-gold/80 transition-transform duration-300 [@media(hover:hover)]:group-hover:-translate-y-0.5">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="relative mt-6 font-display text-lg font-semibold tracking-tight">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </motion.article>
  );
}

/** "Why choose": open layout, gold hairline on top, no box. */
export function WhyCard({
  icon,
  title,
  description,
  index = 0,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
}) {
  return (
    <article className="group h-full text-left">
      <DrawLine className="h-px w-full bg-gold/40" />
      <div className="pt-6">
      <IconTile icon={icon} tone={index + 1} size="sm" />
      <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </article>
  );
}

export function FeatureCard({
  icon,
  title,
  description,
  index = 0,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
}) {
  return (
    <motion.article
      onPointerMove={trackSpot}
      whileHover={{ y: -3 }}
      transition={lift}
      className={cn(cardBase, "h-full rounded-2xl bg-card/90 p-5 text-left backdrop-blur")}
    >
      <Spot />
      <div className="relative"><IconTile icon={icon} size="sm" tone={index} /></div>
      <h3 className="relative mt-4 font-display text-base font-semibold tracking-tight">{title}</h3>
      <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </motion.article>
  );
}

export function ChecklistCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep">{title}</p>
      <ul className="mt-4 space-y-3">
        {items.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.45, delay: i * 0.07, ease }}
            className="flex items-start gap-3 text-sm"
          >
            <motion.span
              initial={{ scale: 0.5 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ type: "spring", bounce: 0.35, duration: 0.5, delay: 0.1 + i * 0.07 }}
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage/25 text-primary"
            >
              <Check size={12} strokeWidth={2.5} />
            </motion.span>
            <span className="text-foreground/80">{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
