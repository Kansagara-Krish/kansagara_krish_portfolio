"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toast({ message, type = "success" }: { message: string; type?: "success" | "error" }) {
  return (
    <div
      className={cn(
        "fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border bg-surface px-4 py-3 text-sm shadow-lg",
        type === "success" ? "border-emerald-600/30" : "border-red-600/30"
      )}
    >
      {type === "success" ? <CheckCircle2 size={16} className="text-emerald-600" /> : <XCircle size={16} className="text-red-600" />}
      {message}
    </div>
  );
}
