"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Tag,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

type State = "idle" | "loading" | "success" | "error";

const SUBJECT_OPTIONS = [
  { label: "💼 Project Inquiry", value: "New Project Inquiry" },
  { label: "🤝 Collaboration", value: "Collaboration Opportunity" },
  { label: "🚀 Freelance / Contract", value: "Freelance Work Request" },
  { label: "☕ Say Hello", value: "Just Saying Hello!" },
];

export function ContactForm({ email }: { email: string }) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [subjectValue, setSubjectValue] = useState("");
  const [messageLength, setMessageLength] = useState(0);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setError("");
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: (formData.get("subject") as string) || subjectValue,
      message: formData.get("message") as string,
    };

    try {
      const subject = encodeURIComponent(payload.subject || "Portfolio inquiry");
      const body = encodeURIComponent(
        `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`
      );

      // Open mailto link
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      event.currentTarget.reset();
      setSubjectValue("");
      setMessageLength(0);
      setState("success");
      setTimeout(() => setState("idle"), 6000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error sending message. Please try again.");
      setState("error");
      setTimeout(() => setState("idle"), 5000);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Quick Topic Selection Chips */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text/80">
          <Sparkles size={13} className="text-primary animate-pulse" />
          <span>Quick Topic</span>
          <span className="text-[10px] font-normal normal-case text-muted">(optional preset)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SUBJECT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSubjectValue(opt.value)}
              className={cn(
                "rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer border",
                subjectValue === opt.value
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/25 scale-[1.02]"
                  : "bg-surface/80 border-border/80 text-text/80 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Full Name Field */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text/80"
          >
            <User size={13} className="text-primary" />
            <span>Full Name</span>
            <span className="text-primary">*</span>
          </label>
          <div className="relative group">
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              placeholder="e.g. Alex Morgan"
              className="w-full rounded-xl border border-border/80 bg-surface/90 px-4 py-3.5 text-sm sm:text-base text-text placeholder:text-muted/60 transition-all duration-200 outline-none focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/15 shadow-sm group-hover:border-border"
            />
          </div>
        </div>

        {/* Email Address Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text/80"
          >
            <Mail size={13} className="text-primary" />
            <span>Email Address</span>
            <span className="text-primary">*</span>
          </label>
          <div className="relative group">
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="e.g. alex@example.com"
              className="w-full rounded-xl border border-border/80 bg-surface/90 px-4 py-3.5 text-sm sm:text-base text-text placeholder:text-muted/60 transition-all duration-200 outline-none focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/15 shadow-sm group-hover:border-border"
            />
          </div>
        </div>
      </div>

      {/* Subject Field */}
      <div className="space-y-2">
        <label
          htmlFor="subject"
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text/80"
        >
          <Tag size={13} className="text-primary" />
          <span>Subject</span>
          <span className="text-primary">*</span>
        </label>
        <div className="relative group">
          <input
            id="subject"
            name="subject"
            type="text"
            required
            minLength={3}
            value={subjectValue}
            onChange={(e) => setSubjectValue(e.target.value)}
            placeholder="e.g. Building an AI recommendation engine"
            className="w-full rounded-xl border border-border/80 bg-surface/90 px-4 py-3.5 text-sm sm:text-base text-text placeholder:text-muted/60 transition-all duration-200 outline-none focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/15 shadow-sm group-hover:border-border"
          />
        </div>
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="message"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text/80"
          >
            <MessageSquare size={13} className="text-primary" />
            <span>Message</span>
            <span className="text-primary">*</span>
          </label>
          <span className="text-[11px] font-mono text-muted">
            {messageLength > 0 ? `${messageLength} chars` : "min 10 chars"}
          </span>
        </div>
        <div className="relative group">
          <textarea
            id="message"
            name="message"
            required
            minLength={10}
            rows={5}
            onChange={(e) => setMessageLength(e.target.value.length)}
            placeholder="Tell me about your project, timeline, goals, or just say hello..."
            className="w-full rounded-xl border border-border/80 bg-surface/90 p-4 text-sm sm:text-base text-text placeholder:text-muted/60 transition-all duration-200 outline-none focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/15 shadow-sm resize-y min-h-[130px] group-hover:border-border leading-relaxed"
          />
        </div>
      </div>

      {/* Alerts and Submit Button */}
      <div className="pt-2">
        <AnimatePresence mode="wait">
          {state === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-5 flex items-center gap-3 rounded-2xl bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-md backdrop-blur-md"
            >
              <CheckCircle2 size={22} className="shrink-0 text-emerald-500" />
              <div className="text-sm">
                <p className="font-bold">Email draft created successfully!</p>
                <p className="text-xs opacity-90">Your email client has opened with your message ready to send.</p>
              </div>
            </motion.div>
          )}

          {state === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-5 flex items-center gap-3 rounded-2xl bg-red-500/10 p-4 text-red-600 dark:text-red-400 border border-red-500/20 shadow-md backdrop-blur-md"
            >
              <AlertCircle size={22} className="shrink-0 text-red-500" />
              <span className="font-semibold text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={state === "loading"}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className={cn(
            "group relative flex w-full sm:w-auto min-w-[220px] items-center justify-center gap-2.5 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/35 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed",
            state === "loading" && "cursor-wait"
          )}
        >
          {state === "loading" ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Preparing draft...</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <Send
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
              />
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}
