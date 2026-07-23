import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function StepIndicator({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  return (
    <div className="flex justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: i + 1 === current ? 1.3 : 1,
            backgroundColor:
              i + 1 === current ? "hsl(var(--primary))" : "hsl(var(--border))",
          }}
          transition={{ duration: 0.25 }}
          className={cn("h-2 w-2 rounded-full")}
        />
      ))}
    </div>
  );
}
