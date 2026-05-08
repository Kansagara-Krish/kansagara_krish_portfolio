"use client";

import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

export function TagInput({ values, onChange, placeholder }: { values: string[]; onChange: (values: string[]) => void; placeholder: string }) {
  const [draft, setDraft] = useState("");

  function add(value: string) {
    const trimmed = value.trim();
    if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed]);
    setDraft("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      add(draft);
    }
  }

  return (
    <div className="rounded-[8px] border border-border bg-bg p-2">
      <div className="mb-2 flex flex-wrap gap-2">
        {values.map((value) => (
          <Badge key={value} variant="muted" className="gap-1">
            {value}
            <button type="button" onClick={() => onChange(values.filter((item) => item !== value))} aria-label={`Remove ${value}`}>
              <X size={12} />
            </button>
          </Badge>
        ))}
      </div>
      <Input className="border-0 bg-transparent focus:ring-0" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={onKeyDown} onBlur={() => add(draft)} placeholder={placeholder} />
    </div>
  );
}
