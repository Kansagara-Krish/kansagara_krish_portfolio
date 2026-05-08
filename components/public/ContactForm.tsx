"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type State = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setError("");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    if (response.ok) {
      event.currentTarget.reset();
      setState("success");
    } else {
      const json = (await response.json()) as { error?: string };
      setError(json.error ?? "Something went wrong.");
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-[8px] border border-border bg-surface p-5">
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="name">Name</label>
        <Input id="name" name="name" required minLength={2} />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="email">Email</label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="subject">Subject</label>
        <Input id="subject" name="subject" required minLength={3} />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="message">Message</label>
        <Textarea id="message" name="message" required minLength={10} />
      </div>
      {state === "success" ? <p className="rounded-[6px] bg-emerald-500/10 p-3 text-sm text-emerald-500">Message sent. I&apos;ll get back to you soon.</p> : null}
      {state === "error" ? <p className="rounded-[6px] bg-red-500/10 p-3 text-sm text-red-500">{error}</p> : null}
      <Button type="submit" disabled={state === "loading"} icon={<Send size={18} />}>
        {state === "loading" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
