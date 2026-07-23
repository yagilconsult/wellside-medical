import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export function Field({
  label,
  htmlFor,
  children,
  required,
  optional,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm text-muted-foreground">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
        {optional && (
          <span className="text-muted-foreground/60 ml-1 text-xs">(optional)</span>
        )}
      </label>
      {children}
    </div>
  );
}
