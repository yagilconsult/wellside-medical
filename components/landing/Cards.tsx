"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Landing-page card system. One shared look: soft layered shadow, a hairline
 * border that tints toward the brand teal on hover, and an icon tile that
 * fills in on hover. Motion is a critically damped spring (no bounce) and
 * only transform/opacity animate.
 */

const lift = { type: "spring", bounce: 0, duration: 0.3 } as const;

const cardBase =
  "group relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-card " +
  "transition-[border-color,box-shadow] duration-300 hover:border-primary/30 hover:shadow-card-hover";

/** Soft teal glow that fades in at the top of a card on hover. */
function Glow() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(60%_100%_at_20%_0%,hsl(var(--primary)/0.08),transparent)]"
    />
  );
}

export function IconTile({
  icon: Icon,
  tone = "soft",
  size = "md",
  className,
}: {
  icon: LucideIcon;
  tone?: "soft" | "solid";
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-xl transition-colors duration-200",
        size === "md" ? "h-12 w-12" : "h-10 w-10",
        tone === "solid"
          ? "bg-primary text-primary-foreground"
          : "bg-accent text-primary group-hover:bg-primary group-hover:text-primary-foreground",
        className
      )}
    >
      <Icon size={size === "md" ? 21 : 18} strokeWidth={1.75} />
    </span>
  );
}

/**
 * "What to expect" — solid brand cards in a descending staircase. Statement on
 * top, hairline divider, then a circle icon with a name and small-caps tag.
 * The staircase only applies from md up; below that the cards simply stack.
 */
export function TrustBar({
  items,
}: {
  items: { icon: LucideIcon; label: string; title: string; tag: string }[];
}) {
  return (
    <ul className="grid items-start gap-4 sm:grid-cols-2 md:grid-cols-5">
      {items.map((item, i) => (
        <motion.li
          key={item.label}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{ "--step": `${i * 28}px` } as CSSProperties}
          className="md:mt-[var(--step)]"
        >
          <motion.div
            whileHover={{ y: -4 }}
            transition={lift}
            className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-card-hover"
          >
            {i % 2 === 1 && (
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/10" />
            )}
            <p className="relative text-balance font-display text-lg font-semibold leading-snug tracking-tight">
              {item.label}
            </p>
            <div className="relative mt-6 flex items-center gap-3 border-t border-primary-foreground/20 pt-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground text-primary">
                <item.icon size={17} strokeWidth={1.9} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-tight">{item.title}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-foreground/70">
                  {item.tag}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.li>
      ))}
    </ul>
  );
}

/** Service card — numbered, editorial. */
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
    <motion.article
      whileHover={{ y: -4 }}
      transition={lift}
      className={cn(cardBase, "h-full p-6 text-left")}
    >
      <Glow />
      <span
        aria-hidden="true"
        className="absolute right-5 top-4 font-display text-3xl font-semibold tracking-tight text-foreground/[0.07]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <IconTile icon={icon} />
      <h3 className="relative mt-5 font-display text-lg font-semibold tracking-tight">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </motion.article>
  );
}

/** "Why choose" — horizontal card with a solid icon tile. */
export function WhyCard({
  icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={lift}
      className={cn(cardBase, "flex h-full items-start gap-5 p-6 text-left")}
    >
      <Glow />
      <IconTile icon={icon} tone="solid" />
      <div className="relative">
        <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </motion.article>
  );
}

/** Compact feature card for the telehealth section. */
export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={lift}
      className={cn(cardBase, "h-full bg-card/80 p-5 text-left backdrop-blur")}
    >
      <Glow />
      <IconTile icon={icon} size="sm" />
      <h3 className="relative mt-4 font-display text-base font-semibold tracking-tight">{title}</h3>
      <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </motion.article>
  );
}

/** Checklist panel used in the provider profile. */
export function ChecklistCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{title}</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
              <Check size={12} strokeWidth={2.5} />
            </span>
            <span className="text-foreground/80">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
