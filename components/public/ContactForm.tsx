"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";

type State = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setError("");
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.error || "Something went wrong. Please try again.";
        throw new Error(message);
      }

      event.currentTarget.reset();
      setState("success");
      setTimeout(() => setState("idle"), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
      setTimeout(() => setState("idle"), 5000);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 rounded-2xl border border-border bg-surface p-8 md:p-10">
      <div className="grid gap-2">
        <label className="text-xs font-medium text-muted" htmlFor="name">Name</label>
        <Input
          id="name"
          name="name"
          required
          minLength={2}
          placeholder="Your name"
          className="bg-bg"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-xs font-medium text-muted" htmlFor="email">Email</label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="bg-bg"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-xs font-medium text-muted" htmlFor="subject">Subject</label>
        <Input
          id="subject"
          name="subject"
          required
          minLength={3}
          placeholder="What's this about?"
          className="bg-bg"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-xs font-medium text-muted" htmlFor="message">Message</label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={10}
          placeholder="Tell me about your project..."
          className="bg-bg min-h-[140px]"
        />
      </div>

      <AnimatePresence mode="wait">
        {state === "success" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 rounded-lg bg-emerald-600/10 p-4 text-sm text-emerald-700 dark:text-emerald-400"
          >
            <CheckCircle2 size={16} />
            Message sent! I&apos;ll get back to you soon.
          </motion.div>
        )}

        {state === "error" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 rounded-lg bg-red-600/10 p-4 text-sm text-red-700 dark:text-red-400"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        disabled={state === "loading"}
        size="lg"
        className="mt-2"
        icon={<Send size={16} className={cn("transition-transform", state === "loading" && "animate-pulse")} />}
      >
        {state === "loading" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
