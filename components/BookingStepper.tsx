"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepDef {
  key: string;
  label: string;
}

export function BookingStepper({
  steps,
  currentIndex,
}: {
  steps: StepDef[];
  currentIndex: number;
}) {
  return (
    <div className="mb-10">
      <div className="flex items-start">
        {steps.map((step, i) => {
          const isDone = i < currentIndex;
          const isActive = i === currentIndex;
          return (
            <div key={step.key} className="flex-1 flex flex-col items-center relative">
              {i > 0 && (
                <div
                  className={cn(
                    "absolute top-4 right-1/2 w-full h-0.5 -z-10",
                    isDone || isActive ? "bg-primary" : "bg-border"
                  )}
                />
              )}
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  backgroundColor: isDone || isActive ? "hsl(var(--primary))" : "hsl(var(--background))",
                  borderColor: isDone || isActive ? "hsl(var(--primary))" : "hsl(var(--border))",
                }}
                transition={{ duration: 0.25 }}
                className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium"
                style={{ color: isDone || isActive ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))" }}
              >
                {isDone ? <Check size={14} /> : i + 1}
              </motion.div>
              <p
                className={cn(
                  "mt-2 text-[11px] text-center leading-tight px-1",
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
