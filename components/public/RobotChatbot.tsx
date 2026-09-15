"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, RefreshCw, Download, Mail, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  displayedText?: string;
  isStreaming?: boolean;
  timestamp: string;
  quickLinks?: { label: string; url: string; isDownload?: boolean }[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "Hello there! 👋 I'm Krish's AI Assistant. Ask me anything about Krish's machine learning projects, skills, hackathons, or how to get in touch!",
    displayedText: "Hello there! 👋 I'm Krish's AI Assistant. Ask me anything about Krish's machine learning projects, skills, hackathons, or how to get in touch!",
    timestamp: "Just now",
  },
];

const SUGGESTED_QUESTIONS = [
  "🚀 Top projects?",
  "⚡ Core skills?",
  "💼 Experience & roles?",
  "🏆 Hackathons?",
  "📬 How to contact?",
  "📄 Get Resume"
];

/**
 * Exact 3D Floating Robot (Compact Size, Without Legs, Transparent Background)
 * Featuring gentle floating physics, head tilt motion, and glowing thruster effect.
 */
function Exact3DRobot({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center pointer-events-none select-none", className)}>
      {/* Cyan Hovering Propulsion Glow */}
      <motion.div
        animate={{
          scale: [0.85, 1.2, 0.85],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 h-4 w-10 rounded-full bg-cyan-400/40 blur-md"
      />

      {/* Main Transparent 3D Robot Image with Bobbing & Waving Head Tilt */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          rotate: [-2, 2.5, -2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative h-16 w-16 sm:h-20 sm:w-20 filter drop-shadow-[0_6px_14px_rgba(6,182,212,0.35)]"
      >
        <Image
          src="/images/robot-assistant.png"
          alt="Krish AI Robot"
          fill
          priority
          className="object-contain"
          sizes="80px"
        />
      </motion.div>
    </div>
  );
}

export function RobotChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedBubbleText, setDisplayedBubbleText] = useState("");
  const [isTypingBubble, setIsTypingBubble] = useState(true);
  const [bubbleShake, setBubbleShake] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const chatModalRef = useRef<HTMLDivElement>(null);

  // Close chatbot when clicking outside anywhere on the website
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (chatModalRef.current && !chatModalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Character-by-character typewriter loop for speech bubble: "Hello... 👋" -> "Any Questions? 🤖"
  useEffect(() => {
    const phrases = ["Hello... 👋", "Any Questions? 🤖"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timer: NodeJS.Timeout;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];

      if (!isDeleting) {
        setDisplayedBubbleText(currentPhrase.slice(0, charIndex + 1));
        charIndex++;

        if (charIndex === currentPhrase.length) {
          setIsTypingBubble(false);
          if (phraseIndex === 1) {
            setBubbleShake(true);
            setTimeout(() => setBubbleShake(false), 600);
          }
          // Pause before deleting
          timer = setTimeout(() => {
            isDeleting = true;
            setIsTypingBubble(true);
            typeLoop();
          }, 2600);
          return;
        }
        timer = setTimeout(typeLoop, 80);
      } else {
        setDisplayedBubbleText(currentPhrase.slice(0, charIndex - 1));
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          timer = setTimeout(typeLoop, 250);
          return;
        }
        timer = setTimeout(typeLoop, 40);
      }
    }

    timer = setTimeout(typeLoop, 400);

    return () => clearTimeout(timer);
  }, []);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Handle stream typing for incoming bot messages
  const streamBotResponse = (fullText: string, quickLinks?: { label: string; url: string; isDownload?: boolean }[]) => {
    const messageId = `bot-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Initial message container with empty displayedText
    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        sender: "bot",
        text: fullText,
        displayedText: "",
        isStreaming: true,
        timestamp,
        quickLinks,
      },
    ]);

    let charIndex = 0;
    const interval = setInterval(() => {
      charIndex += 2; // Stream 2 characters at a time for fast, smooth cadence
      if (charIndex >= fullText.length) {
        clearInterval(interval);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, displayedText: fullText, isStreaming: false }
              : msg
          )
        );
      } else {
        const partial = fullText.slice(0, charIndex);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, displayedText: partial } : msg
          )
        );
      }
    }, 20);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query.trim(),
      displayedText: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Call Gemini-backed chat API with live portfolio website knowledge
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query.trim() }),
      });

      setIsTyping(false);

      if (res.ok) {
        const data = await res.json();
        streamBotResponse(data.reply, data.quickLinks);
      } else {
        streamBotResponse("I'm here to help you explore Krish's projects, machine learning work, and skills! Feel free to ask another question.");
      }
    } catch (err) {
      setIsTyping(false);
      streamBotResponse("Krish is a Machine Learning Developer specializing in Python, AI systems, and full-stack delivery. Check out his projects or contact him directly!");
    }
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setIsTyping(false);
  };

  return (
    <>
      {/* Ambient Backdrop Blur & Cinematic Spotlight Glow when Chatbot is Open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[990] bg-black/55 backdrop-blur-md cursor-pointer transition-all"
          >
            {/* Ambient Radial Theme Spotlight directed toward bottom right */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,rgba(6,182,212,0.18),transparent_55%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[999] pointer-events-auto select-none">
        {/* 1. Speech Bubble (Anchored above the robot button) */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.85 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                x: bubbleShake ? [0, -6, 6, -4, 4, -2, 2, 0] : 0 
              }}
              exit={{ opacity: 0, scale: 0.85, y: 6 }}
              transition={{
                x: { duration: 0.5, ease: "easeInOut" },
                default: { duration: 0.25 }
              }}
              onClick={() => setIsOpen(true)}
              className="absolute bottom-20 sm:bottom-24 right-0 mb-2 cursor-pointer whitespace-nowrap rounded-2xl border-2 border-primary/50 bg-surface/95 px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:border-primary hover:shadow-primary/30 flex items-center gap-2 group ring-1 ring-white/20"
            >
              {/* Pulsing Active Cyan Dot */}
              <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-primary shadow-[0_0_8px_var(--color-primary)]"></span>
              </span>

              {/* Typewriter Text with High Contrast & Crisp Typography */}
              <div className="flex items-center">
                <span className="text-xs sm:text-sm font-black text-text tracking-wide drop-shadow-sm">{displayedBubbleText}</span>
                {isTypingBubble && (
                  <span className="inline-block w-1.5 h-3 ml-1 bg-primary animate-pulse rounded-full" />
                )}
              </div>

              <span className="text-[10px] sm:text-[11px] font-black text-primary group-hover:underline uppercase tracking-wider ml-1">
                Ask AI &rarr;
              </span>
              
              {/* Speech bubble pointer notch */}
              <div className="absolute -bottom-2 right-8 sm:right-10 h-3 w-3 sm:h-3.5 sm:w-3.5 rotate-45 border-b-2 border-r-2 border-primary/50 bg-surface/95" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. Floating Robot Avatar Trigger (Independently Anchored at bottom-right) */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 right-0 flex items-center justify-center"
            >
              <button
                onClick={() => setIsOpen(true)}
                aria-label="Open AI Robot Chat"
                className="group relative flex items-center justify-center p-0 transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
              >
                {/* Exact 3D Robot Mascot (Transparent Background, Floating without legs) */}
                <Exact3DRobot />

                {/* Online Status Green Badge */}
                <span className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-emerald-500 border-2 border-surface shadow-md"></span>
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Enlarged Focus-Mode Chatbot Window Modal with Glowing Border & Atmospheric Lighting */}
        <AnimatePresence>
          {isOpen && (
            <div className="relative">
              {/* Theme Adaptive Radiant Halo Glow around modal */}
              <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-tr from-cyan-500/25 via-primary/30 to-blue-600/20 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

              <motion.div
                ref={chatModalRef}
                data-lenis-prevent
                onWheel={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 20 }}
                style={{ transformOrigin: "bottom right" }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-0 right-0 flex h-[600px] sm:h-[640px] max-h-[85vh] w-[calc(100vw-2rem)] sm:w-[440px] md:w-[480px] flex-col overflow-hidden rounded-3xl border border-primary/40 bg-surface/95 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(6,182,212,0.25)] backdrop-blur-3xl overscroll-contain ring-1 ring-white/15"
              >
                {/* Chatbot Header */}
                <div className="flex items-center justify-between border-b border-border/50 bg-gradient-to-r from-surface via-primary/10 to-surface px-4 py-3 sm:px-5 sm:py-3.5">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-full border border-primary/30 bg-primary/10 shadow-inner flex items-center justify-center">
                      <Image
                        src="/images/robot-assistant.png"
                        alt="Robot Avatar"
                        fill
                        className="object-contain p-0.5"
                        sizes="40px"
                      />
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-surface" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display text-sm font-bold text-text">Krish AI Robot</h3>
                        <Sparkles size={12} className="text-primary" />
                      </div>
                      <p className="text-[9px] sm:text-[10px] font-semibold text-emerald-500 uppercase tracking-wider">Gemini Powered • Live Data</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleReset}
                      title="Reset conversation"
                      className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-text transition-colors"
                    >
                      <RefreshCw size={13} />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      title="Close chat"
                      className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-text transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                {/* Chat Message History (Isolated Lenis Scroll Area) */}
                <div 
                  data-lenis-prevent
                  className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin overscroll-contain"
                >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col gap-1.5 max-w-[85%]",
                        msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed shadow-sm",
                          msg.sender === "user"
                            ? "bg-primary text-bg font-medium rounded-tr-none"
                            : "bg-surface border border-border/60 text-text rounded-tl-none shadow-sm"
                        )}
                      >
                        <p>
                          {msg.displayedText !== undefined ? msg.displayedText : msg.text}
                          {msg.isStreaming && (
                            <span className="inline-block w-1.5 h-3.5 ml-1 bg-primary animate-pulse rounded-full" />
                          )}
                        </p>

                        {/* Quick Link Buttons if present */}
                        {msg.quickLinks && msg.quickLinks.length > 0 && !msg.isStreaming && (
                          <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-border/40">
                            {msg.quickLinks.map((link) => (
                              <Link
                                key={link.label}
                                href={link.url}
                                target={link.url.startsWith("http") || link.url.startsWith("mailto") ? "_blank" : undefined}
                                onClick={() => {
                                  if (!link.url.startsWith("http") && !link.url.startsWith("mailto")) {
                                    setIsOpen(false);
                                  }
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary transition-all hover:bg-primary hover:text-bg shadow-sm"
                              >
                                {link.isDownload ? <Download size={12} /> : link.url.startsWith("mailto") ? <Mail size={12} /> : <ExternalLink size={12} />}
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] font-medium text-muted/60 px-1">{msg.timestamp}</span>
                    </div>
                  ))}

                  {/* Typing Animated Indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-none border border-border/60 bg-surface px-4 py-3 text-xs w-20">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Quick Suggestions Pills */}
                <div className="border-t border-border/40 bg-surface/50 p-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted/70 px-1 mb-1.5">Suggested Questions:</p>
                  <div 
                    data-lenis-prevent 
                    className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide overscroll-contain"
                  >
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSendMessage(q)}
                        className="shrink-0 rounded-full border border-border/60 bg-surface/80 px-2.5 py-1 text-[11px] font-semibold text-text/80 transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary active:scale-95"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2 border-t border-border/60 bg-surface p-2.5 sm:p-3"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask Krish's AI a question..."
                    className="flex-1 rounded-xl border border-border/60 bg-bg/50 px-3.5 py-2 text-xs sm:text-sm text-text placeholder:text-muted/50 focus:border-primary focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
                      inputValue.trim()
                        ? "bg-primary text-bg shadow-md shadow-primary/20 hover:scale-105 active:scale-95"
                        : "bg-surface border border-border/40 text-muted/40 cursor-not-allowed"
                    )}
                    aria-label="Send message"
                  >
                    <Send size={15} />
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
