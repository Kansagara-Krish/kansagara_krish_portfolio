import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-2xl border border-border/50 bg-bg/50 px-5 text-sm text-text outline-none backdrop-blur-sm transition-all placeholder:text-muted/40 focus:border-primary/50 focus:bg-bg focus:ring-4 focus:ring-primary/10 disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
});
