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
        "h-11 w-full rounded-lg border border-border bg-bg px-4 text-sm text-text outline-none placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
});
