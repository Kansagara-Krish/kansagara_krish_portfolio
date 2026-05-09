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
        "min-h-28 w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm text-text outline-none placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
});
