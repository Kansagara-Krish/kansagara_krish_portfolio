import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "muted" | "warning";

const variants: Record<BadgeVariant, string> = {
  default: "border-primary/20 bg-primary/10 text-primary",
  success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
  muted: "border-border bg-bg text-muted",
  warning: "border-amber-500/20 bg-amber-500/10 text-amber-600"
};

export function Badge({ className, variant = "default", ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-[4px] border px-2 py-1 text-xs font-medium", variants[variant], className)}
      {...props}
    />
  );
}
