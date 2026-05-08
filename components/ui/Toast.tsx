"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toast({ message, type = "success" }: { message: string; type?: "success" | "error" }) {
  return (
    <div
      className={cn(
        "fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-[8px] border bg-surface px-4 py-3 text-sm shadow-lg",
        type === "success" ? "border-emerald-500/30" : "border-red-500/30"
      )}
    >
      {type === "success" ? <CheckCircle2 size={18} className="text-emerald-500" /> : <XCircle size={18} className="text-red-500" />}
      {message}
    </div>
  );
}
