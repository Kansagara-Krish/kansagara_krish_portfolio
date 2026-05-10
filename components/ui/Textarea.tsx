import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-32 w-full rounded-2xl border border-border/50 bg-bg/50 px-5 py-4 text-sm text-text outline-none backdrop-blur-sm transition-all placeholder:text-muted/40 focus:border-primary/50 focus:bg-bg focus:ring-4 focus:ring-primary/10 disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
});
