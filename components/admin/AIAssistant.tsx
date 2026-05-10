"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, X, Loader2, Send, Bot, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type SupportedModule =
  | "experience"
  | "projects"
  | "blog"
  | "certifications"
  | "hackathons"
  | "education"
  | "skills";

interface AIAssistantProps<T> {
  module: SupportedModule;
  onFill: (data: Partial<T>) => void;
}

/**
 * Extracts all tool invocations carrying 'fill_form' data from the last
 * assistant message. In AI SDK v6, tool calls arrive as parts with a
 * type that starts with 'tool-'. We look for the 'input' or 'args'
 * property which holds the extracted form data.
 */
function extractFillFormData(parts: any[]): unknown | null {
  for (const part of parts) {
    if (typeof part.type !== "string") continue;

    // AI SDK v6 uses 'tool-invocation' as the part type
    if (part.type === "tool-invocation") {
      const inv = part.toolInvocation as any;
      if (inv?.toolName === "fill_form") {
        // The args are available once the call is confirmed or completed
        const args = inv.args ?? inv.input;
        if (args) return args;
      }
      continue;
    }

    // Fallback: older versions may use dynamic 'tool-{name}' types
    if (part.type.startsWith("tool-")) {
      const args = part.args ?? part.input ?? part.result?.data;
      if (args) return args;
    }
  }
  return null;
}

export function AIAssistant<T>({ module, onFill }: AIAssistantProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [filled, setFilled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/admin/ai-autofill",
      body: { module },
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Detect fill_form tool calls in the last assistant message
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role !== "assistant" || !Array.isArray(last.parts)) return;

    const data = extractFillFormData(last.parts);
    if (data) {
      onFill(data as Partial<T>);
      setFilled(true);
    }
  }, [messages, onFill]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const text = input.trim();
      if (!text || isLoading) return;

      setInput("");
      setFilled(false);
      try {
        await sendMessage({ text });
      } catch (err) {
        console.error("AI Assistant error:", err);
        setInput(text);
      }
    },
    [input, isLoading, sendMessage],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as any);
      }
    },
    [handleSubmit],
  );

  return (
    <div className="mb-8">
      {!isOpen ? (
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="w-full h-14 rounded-2xl border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-all group shadow-sm flex items-center justify-center gap-2"
        >
          <Sparkles className="h-5 w-5 group-hover:scale-110 transition-transform" />
          <span className="font-semibold tracking-wide">
            Auto-fill with AI Assistant
          </span>
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          className="rounded-2xl border border-primary/20 bg-surface/50 backdrop-blur-md overflow-hidden shadow-xl shadow-primary/5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-primary/10 bg-primary/5 px-6 py-4">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles size={18} />
              <h3 className="font-bold uppercase tracking-widest text-xs">
                AI Auto-fill
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-muted hover:text-text transition-colors p-1"
              aria-label="Close AI Assistant"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <p className="text-sm text-muted">
              Paste your raw notes, resume snippets, or describe the{" "}
              <span className="font-medium text-text capitalize">{module}</span>{" "}
              entry, and I&apos;ll fill out the form for you.
            </p>

            {/* Message Thread */}
            <AnimatePresence>
              {messages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-h-[300px] overflow-y-auto space-y-4 pr-1"
                >
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn(
                        "flex gap-3",
                        m.role === "user" ? "justify-end" : "justify-start",
                      )}
                    >
                      {m.role === "assistant" && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Bot size={16} />
                        </div>
                      )}
                      <div
                        className={cn(
                          "px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed",
                          m.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-bg/80 border border-border/50 rounded-tl-sm text-text",
                        )}
                      >
                        {/* Render text parts — UIMessage in AI SDK v6 always has parts */}
                        {m.parts.map((part: any, i) => {
                          if (part.type === "text" && part.text) {
                            return <div key={i}>{part.text}</div>;
                          }
                          // Show a success indicator for any tool call part
                          if (
                            part.type === "tool-invocation" ||
                            (typeof part.type === "string" &&
                              part.type.startsWith("tool-"))
                          ) {
                            return (
                              <div
                                key={i}
                                className="mt-2 text-xs flex items-center gap-1.5 text-emerald-500"
                              >
                                <CheckCircle2 size={12} />
                                Form fields populated!
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Bot size={16} />
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-bg/80 border border-border/50 rounded-tl-sm text-text flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-muted">Thinking…</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success banner */}
            <AnimatePresence>
              {filled && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-500"
                >
                  <CheckCircle2 size={16} />
                  Form auto-filled! Review and submit when ready.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="relative flex items-end gap-2"
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`e.g. Worked at Vercel as a SWE from Jan 2023 to present…`}
                className="min-h-[80px] w-full resize-none rounded-xl pr-14 focus:ring-primary/20 text-sm"
                disabled={isLoading}
              />
              <div className="absolute bottom-2 right-2">
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="h-10 w-10 rounded-lg shadow-md transition-all disabled:opacity-50"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
}
