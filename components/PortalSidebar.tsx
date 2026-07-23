"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PortalNavItem {
  key: string;
  label: string;
  icon: LucideIcon;
}

export function PortalSidebar({
  items,
  active,
  onSelect,
  layoutId = "portal-nav-highlight",
}: {
  items: PortalNavItem[];
  active: string;
  onSelect: (key: string) => void;
  layoutId?: string;
}) {
  return (
    <nav className="flex flex-row md:flex-col gap-1 w-full md:w-40 md:shrink-0 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.key === active;
        return (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={cn(
              "relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-left transition-colors shrink-0 whitespace-nowrap",
              isActive
                ? "text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 rounded-lg bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <Icon size={16} className="relative z-10" />
            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
