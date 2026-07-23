import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg bg-card text-card-foreground border border-border shadow-sm transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    />
  );
}

export function SoftCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg bg-muted", className)}
      {...props}
    />
  );
}
