"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
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
        const message = data.error || "Error. Please try again.";
        throw new Error(message);
      }

      event.currentTarget.reset();
      setState("success");
      setTimeout(() => setState("idle"), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error. Please try again.");
      setState("error");
      setTimeout(() => setState("idle"), 5000);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative group">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted group-focus-within:text-primary transition-colors" htmlFor="name">Full Name</label>
          <Input
            id="name"
            name="name"
            required
            minLength={2}
            placeholder="John Doe"
            className="mt-2 h-12 bg-transparent border-0 border-b border-border rounded-none px-0 focus:ring-0 focus:border-primary transition-all text-lg placeholder:text-muted/30"
          />
        </div>

        <div className="relative group">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted group-focus-within:text-primary transition-colors" htmlFor="email">Email Address</label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="john@example.com"
            className="mt-2 h-12 bg-transparent border-0 border-b border-border rounded-none px-0 focus:ring-0 focus:border-primary transition-all text-lg placeholder:text-muted/30"
          />
        </div>
      </div>

      <div className="relative group">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted group-focus-within:text-primary transition-colors" htmlFor="subject">Subject</label>
        <Input
          id="subject"
          name="subject"
          required
          minLength={3}
          placeholder="How can I help you?"
          className="mt-2 h-12 bg-transparent border-0 border-b border-border rounded-none px-0 focus:ring-0 focus:border-primary transition-all text-lg placeholder:text-muted/30"
        />
      </div>

      <div className="relative group">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted group-focus-within:text-primary transition-colors" htmlFor="message">Message</label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={10}
          placeholder="Describe your project, timeline, or just say hi..."
          className="mt-2 bg-transparent border-0 border-b border-border rounded-none px-0 focus:ring-0 focus:border-primary transition-all text-lg min-h-[120px] resize-none placeholder:text-muted/30"
        />
      </div>

      <div className="pt-4">
        <AnimatePresence mode="wait">
          {state === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-500/10 p-4 text-emerald-500 border border-emerald-500/20"
            >
              <CheckCircle2 size={20} />
              <span className="font-medium text-sm">Message received! I&apos;ll get back to you shortly.</span>
            </motion.div>
          )}

          {state === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 p-4 text-red-500 border border-red-500/20"
            >
              <AlertCircle size={20} />
              <span className="font-medium text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          disabled={state === "loading"}
          size="lg"
          className={cn(
            "w-full md:w-auto min-w-[200px] h-14 rounded-2xl text-lg font-semibold transition-all duration-300",
            state === "loading" ? "opacity-70" : "hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1"
          )}
        >
          {state === "loading" ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={20} />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
