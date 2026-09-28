"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  ArrowRight,
  Download,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ActionButton {
  label: string;
  url: string;
  targetElementId?: string;
  isDownload?: boolean;
}

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  displayedText?: string;
  isStreaming?: boolean;
  timestamp: string;
  actionButton?: ActionButton;
  quickLinks?: ActionButton[];
  followUpSuggestions?: string[];
  isError?: boolean;
}

/**
 * Formats message text: converts route links (like /about, /projects, etc.)
 * or markdown links [Label](/route) into stylish interactive buttons.
 */
function FormattedMessageText({
  text,
  onNavigate,
}: {
  text: string;
  onNavigate: (action: ActionButton) => void;
}) {
  const tokenRegex = /(\[([^\]]+)\]\((\/(?:about|projects|experience|education|contact|certifications|hackathons|blog|resume\.pdf)[^\)]*)\)|(\/(?:about|projects|experience|education|contact|certifications|hackathons|blog|resume\.pdf)(?:#[a-zA-Z0-9_-]+)?))/gi;

  const parts: {
    type: "text" | "button";
    content?: string;
    label?: string;
    url?: string;
    isDownload?: boolean;
  }[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }

    if (match[2] && match[3]) {
      // Markdown link [Label](/path)
      const label = match[2];
      const url = match[3];
      parts.push({
        type: "button",
        label,
        url,
        isDownload: url.toLowerCase().endsWith(".pdf"),
      });
    } else if (match[4]) {
      // Bare route path like /about
      const url = match[4];
      const clean = url.toLowerCase().split("#")[0].replace("/", "");
      const labelMap: Record<string, string> = {
        about: "About",
        projects: "Projects",
        experience: "Experience",
        education: "Education",
        contact: "Contact",
        certifications: "Certifications",
        hackathons: "Hackathons",
        blog: "Blog",
        "resume.pdf": "Resume",
      };
      const label = labelMap[clean] || (clean.charAt(0).toUpperCase() + clean.slice(1));
      parts.push({
        type: "button",
        label,
        url,
        isDownload: url.toLowerCase().endsWith(".pdf"),
      });
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  if (parts.length === 0) {
    return <>{text}</>;
  }

  return (
    <>
      {parts.map((part, idx) => {
        if (part.type === "text") {
          return <span key={idx}>{part.content}</span>;
        }
        return (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate({
                label: `${part.label} Page`,
                url: part.url!,
                isDownload: part.isDownload,
              });
            }}
            className="inline-flex items-center gap-1.5 mx-1 px-2.5 py-0.5 rounded-lg bg-blue-500/20 hover:bg-blue-600 border border-blue-400/40 hover:border-blue-500 text-blue-300 hover:text-white font-medium text-xs transition-all duration-200 shadow-sm align-middle group cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400"
            title={`Navigate to ${part.label}`}
          >
            <span>{part.label}</span>
            {part.isDownload ? (
              <Download size={11} className="transition-transform group-hover:translate-y-0.5 shrink-0" />
            ) : (
              <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5 shrink-0" />
            )}
          </button>
        );
      })}
    </>
  );
}

const INITIAL_WELCOME: Message = {
  id: "welcome-1",
  sender: "bot",
  text: "Hi, I'm Krish AI.\n\nI can help you explore Krish's projects, skills, experience, certifications, and more.",
  displayedText: "Hi, I'm Krish AI.\n\nI can help you explore Krish's projects, skills, experience, certifications, and more.",
  timestamp: "Just now",
  followUpSuggestions: [
    "Tell me about Krish's projects",
    "What technologies does Krish use?",
    "How can I contact Krish?",
  ],
};

const USER_NAME_STORAGE_KEY = "krish_ai_user_name";

/**
 * Floating 3D Robot Mascot with Breathing Aura Glow
 */
function Exact3DRobot({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center pointer-events-none select-none", className)}>
      <motion.div
        animate={{
          scale: [0.85, 1.2, 0.85],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 h-4 w-10 rounded-full bg-cyan-400/40 blur-md"
      />
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
        className="relative h-16 w-16 sm:h-20 sm:w-20 filter drop-shadow-[0_6px_16px_rgba(6,182,212,0.4)]"
      >
        <img
          src="/images/robot-assistant.png"
          alt="Krish AI Mascot"
          className="h-full w-full object-contain"
        />
      </motion.div>
    </div>
  );
}

export function RobotChatbot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [displayedBubbleText, setDisplayedBubbleText] = useState("");
  const [isTypingBubble, setIsTypingBubble] = useState(true);
  const [bubbleShake, setBubbleShake] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastFailedQuery, setLastFailedQuery] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem(USER_NAME_STORAGE_KEY) || localStorage.getItem(USER_NAME_STORAGE_KEY);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Flexible width state for Laptop / Desktop (min 380px, max 820px)
  const [panelWidth, setPanelWidth] = useState(460);
  const [isResizing, setIsResizing] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const chatModalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Speech bubble typewriter loop (clean text, no emojis)
  useEffect(() => {
    const phrases = ["Hello...", "Any questions?"];
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
          timer = setTimeout(() => {
            isDeleting = true;
            setIsTypingBubble(true);
            typeLoop();
          }, 2800);
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

  // Laptop Left-Edge Drag Handle Resizing Handler
  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);

    const startX = mouseDownEvent.clientX;
    const startWidth = panelWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      // Since chatbot is anchored on right edge, moving mouse LEFT increases width
      const deltaX = startX - moveEvent.clientX;
      const newWidth = Math.min(Math.max(startWidth + deltaX, 380), 820);
      setPanelWidth(newWidth);
    };

    const onMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [panelWidth]);

  const handleNameUpdate = (name: string | null | undefined) => {
    if (name === null) {
      setUserName(null);
      try {
        sessionStorage.removeItem(USER_NAME_STORAGE_KEY);
        localStorage.removeItem(USER_NAME_STORAGE_KEY);
      } catch {}
    } else if (name) {
      setUserName(name);
      try {
        sessionStorage.setItem(USER_NAME_STORAGE_KEY, name);
        localStorage.setItem(USER_NAME_STORAGE_KEY, name);
      } catch {}
    }
  };

  // Close chatbot when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (chatModalRef.current && !chatModalRef.current.contains(event.target as Node) && !isResizing) {
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
  }, [isOpen, isResizing]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Stream typing response effect
  const streamBotResponse = (
    fullText: string,
    actionButton?: ActionButton,
    followUpSuggestions?: string[],
    isError = false,
    quickLinks?: ActionButton[]
  ) => {
    const messageId = `bot-${Math.random().toString(36).substring(2, 9)}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        sender: "bot",
        text: fullText,
        displayedText: "",
        isStreaming: true,
        timestamp,
        actionButton,
        quickLinks,
        followUpSuggestions,
        isError,
      },
    ]);

    let charIndex = 0;
    const interval = setInterval(() => {
      charIndex += 3;
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
    }, 18);
  };

  // Send message handler
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMessage: Message = {
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      sender: "user",
      text: query,
      displayedText: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setLastFailedQuery(null);

    const historyPayload = messages
      .filter((m) => m.id !== "welcome-1" && !m.isError)
      .slice(-6)
      .map((m) => ({
        sender: m.sender === "user" ? "user" : "assistant",
        text: m.text,
      }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          userName,
        }),
      });

      setIsTyping(false);

      if (res.ok) {
        const data = await res.json();
        if (data.rememberedName !== undefined) {
          handleNameUpdate(data.rememberedName);
        }
        const mainAction = data.actionButton || (data.quickLinks && data.quickLinks.length === 1 ? data.quickLinks[0] : undefined);
        streamBotResponse(data.reply, mainAction, data.followUpSuggestions, false, data.quickLinks);
      } else {
        // Smart client fallback if API route returned non-OK status
        const lower = query.toLowerCase();
        if (lower.includes("skill") || lower.includes("tech") || lower.includes("stack") || lower.includes("python")) {
          streamBotResponse(
            "Krish specializes in Machine Learning and Python engineering. His core stack includes Python, TensorFlow, PyTorch, Scikit-Learn, Next.js, and FastAPI.",
            { label: "View Experience & Skills", url: "/experience" },
            ["Tell me about Krish's projects", "How to contact Krish?"],
            false,
            [{ label: "View Skills", url: "/experience" }]
          );
        } else if (lower.includes("project") || lower.includes("work") || lower.includes("build")) {
          streamBotResponse(
            "Krish has developed key projects like Conference Chatbot Management System and AI HR Copilot. Explore full case studies on the Projects page!",
            { label: "Explore Projects", url: "/projects" },
            ["What technologies does Krish use?", "How can I contact Krish?"],
            false,
            [{ label: "Explore Projects", url: "/projects" }]
          );
        } else if (lower.includes("contact") || lower.includes("hire") || lower.includes("email")) {
          streamBotResponse(
            "You can reach Krish via email or by using the contact form on this site!",
            { label: "Contact Form", url: "/contact" },
            ["Tell me about Krish's projects"],
            false,
            [{ label: "Contact Form", url: "/contact" }]
          );
        } else {
          setLastFailedQuery(query);
          streamBotResponse(
            "I couldn't reach the AI service right now. Please try again in a moment.",
            undefined,
            [],
            true
          );
        }
      }
    } catch {
      setIsTyping(false);
      // Smart client fallback on network disconnect
      const lower = query.toLowerCase();
      if (lower.includes("skill") || lower.includes("tech") || lower.includes("stack") || lower.includes("python")) {
        streamBotResponse(
          "Krish specializes in Machine Learning and Python engineering. His core stack includes Python, TensorFlow, PyTorch, Scikit-Learn, Next.js, and FastAPI.",
          { label: "View Experience & Skills", url: "/experience" },
          ["Tell me about Krish's projects", "How to contact Krish?"],
          false,
          [{ label: "View Skills", url: "/experience" }]
        );
      } else if (lower.includes("project") || lower.includes("work") || lower.includes("build")) {
        streamBotResponse(
          "Krish has developed key projects like Conference Chatbot Management System and AI HR Copilot. Explore full case studies on the Projects page!",
          { label: "Explore Projects", url: "/projects" },
          ["What technologies does Krish use?", "How can I contact Krish?"],
          false,
          [{ label: "Explore Projects", url: "/projects" }]
        );
      } else {
        setLastFailedQuery(query);
        streamBotResponse(
          "I couldn't reach the AI service right now. Please try again in a moment.",
          undefined,
          [],
          true
        );
      }
    }
  };

  // Smart Contextual Navigation Click Handler
  const handleActionNavigation = (action: ActionButton) => {
    if (action.isDownload || action.url.startsWith("http") || action.url.startsWith("mailto:")) {
      window.open(action.url, "_blank");
      return;
    }

    setIsOpen(false);
    setTimeout(() => {
      router.push(action.url);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 200);
    }, 250);
  };

  // Reset conversation
  const handleReset = () => {
    setMessages([INITIAL_WELCOME]);
    setIsTyping(false);
    setLastFailedQuery(null);
  };

  // Wide layout breakpoint condition (> 520px)
  const isWideLayout = panelWidth > 520;

  return (
    <>
      {/* 1. Controlled Backdrop Blur & Dim */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[990] bg-black/60 backdrop-blur-md cursor-pointer transition-all"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_90%,rgba(37,99,235,0.18),transparent_60%)] pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[999] pointer-events-auto select-none">
        {/* 2. Floating Speech Bubble (Anchored above robot) */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.85 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                x: bubbleShake ? [0, -6, 6, -4, 4, -2, 2, 0] : 0,
              }}
              exit={{ opacity: 0, scale: 0.85, y: 6 }}
              transition={{
                x: { duration: 0.5, ease: "easeInOut" },
                default: { duration: 0.25 },
              }}
              onClick={() => setIsOpen(true)}
              className="absolute bottom-20 sm:bottom-24 right-0 mb-2 cursor-pointer whitespace-nowrap rounded-2xl border border-primary/40 bg-surface/95 px-4 py-2 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:border-primary flex items-center group ring-1 ring-white/15"
            >
              <div className="flex items-center">
                <span className="text-xs sm:text-sm font-bold text-text tracking-wide drop-shadow-sm">{displayedBubbleText}</span>
                {isTypingBubble && (
                  <span className="inline-block w-1.5 h-3 ml-1 bg-primary animate-pulse rounded-full" />
                )}
              </div>
              <div className="absolute -bottom-2 right-8 sm:right-10 h-3 w-3 sm:h-3.5 sm:w-3.5 rotate-45 border-b border-r border-primary/40 bg-surface/95" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Floating Robot Trigger with Breathing Aura Glow */}
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
                aria-label="Open Krish AI Chat"
                className="group relative flex items-center justify-center p-0 transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none"
              >
                {/* Robot Aura Breathing Glow & Shadow Effect */}
                <motion.div
                  animate={{
                    scale: [0.85, 1.25, 0.85],
                    opacity: [0.35, 0.8, 0.35],
                  }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 -m-2 rounded-full bg-gradient-to-tr from-cyan-400/35 via-primary/30 to-blue-500/35 blur-xl pointer-events-none"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.35, 1],
                    opacity: [0.15, 0.45, 0.15],
                  }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                  className="absolute -inset-4 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none"
                />

                <Exact3DRobot />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Ultra Glassmorphic Chatbot Window Modal (Flexible Resizable Width for Laptop/Desktop) */}
        <AnimatePresence>
          {isOpen && (
            <div className="relative">
              {/* Theme Adaptive Radiant Halo Glow around modal */}
              <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-tr from-cyan-500/20 via-primary/25 to-blue-600/20 blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

              <motion.div
                ref={chatModalRef}
                data-lenis-prevent
                onWheel={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 15 }}
                style={{
                  transformOrigin: "bottom right",
                  width: typeof window !== "undefined" && window.innerWidth >= 768 ? `${panelWidth}px` : undefined,
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "relative flex h-[580px] sm:h-[620px] max-h-[85vh] w-[calc(100vw-2rem)] md:w-auto flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#080c16]/80 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(37,99,235,0.2)] backdrop-blur-3xl overscroll-contain transition-[width] duration-75 ease-out",
                  isResizing && "select-none transition-none border-blue-500/40"
                )}
              >
                {/* Left-Edge Drag Handle for Laptop / Desktop Resizing */}
                <div
                  onMouseDown={startResizing}
                  onDoubleClick={() => setPanelWidth(460)}
                  title="Drag to resize chatbot width (Double-click to reset)"
                  className="hidden md:flex absolute left-0 top-0 bottom-0 w-3.5 cursor-ew-resize hover:bg-blue-500/20 group/resize z-50 items-center justify-center transition-colors"
                >
                  <div className="h-8 w-1 rounded-full bg-white/20 group-hover/resize:bg-blue-400 group-hover/resize:scale-y-125 transition-all" />
                </div>

                {/* Chat Header */}
                <div className="relative z-10 flex items-center justify-between border-b border-white/10 bg-[#0e1424]/75 px-5 py-3.5 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 shadow-inner overflow-hidden">
                      <img
                        src="/images/robot-assistant.png"
                        alt="Krish AI Robot Avatar"
                        className="h-full w-full object-contain p-0.5"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0e1424]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-sm font-bold tracking-tight text-white">
                          Krish AI
                        </h3>
                        {userName && (
                          <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.2 text-[9px] font-medium text-blue-400">
                            {userName}
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/50">
                        PORTFOLIO ASSISTANT • LIVE DATA
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Width Indicator Badge on Laptop when expanded */}
                    <span className="hidden md:inline-block text-[9px] font-mono font-medium text-white/30 px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                      {panelWidth}px
                    </span>
                    <button
                      onClick={handleReset}
                      title="Reset conversation"
                      aria-label="Reset conversation"
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                    >
                      <RotateCcw size={14} />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      title="Close chat"
                      aria-label="Close chat"
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Chat Message History */}
                <div
                  data-lenis-prevent
                  className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin overscroll-contain"
                >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col gap-1.5 transition-all duration-300",
                        isWideLayout ? "max-w-[80%]" : "max-w-[88%]",
                        msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed",
                          msg.sender === "user"
                            ? "bg-blue-600 text-white font-normal rounded-tr-xs shadow-md shadow-blue-600/20"
                            : msg.isError
                            ? "bg-red-500/10 border border-red-500/20 text-red-200 rounded-tl-xs backdrop-blur-md"
                            : "bg-white/[0.06] border border-white/10 text-white/95 rounded-tl-xs backdrop-blur-md shadow-sm"
                        )}
                      >
                        <div className="whitespace-pre-line">
                          {msg.sender === "bot" ? (
                            <FormattedMessageText
                              text={msg.displayedText !== undefined ? msg.displayedText : msg.text}
                              onNavigate={handleActionNavigation}
                            />
                          ) : (
                            msg.displayedText !== undefined ? msg.displayedText : msg.text
                          )}
                          {msg.isStreaming && (
                            <span className="inline-block w-1.5 h-3.5 ml-1 bg-blue-400 animate-pulse rounded-full align-middle" />
                          )}
                        </div>

                        {/* Error Retry Button */}
                        {msg.isError && lastFailedQuery && (
                          <div className="mt-3 pt-2 border-t border-red-500/20">
                            <button
                              onClick={() => handleSendMessage(lastFailedQuery)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/20 border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-200 transition-all hover:bg-red-500/30 cursor-pointer"
                            >
                              <AlertCircle size={12} />
                              Try Again
                            </button>
                          </div>
                        )}

                        {/* Contextual Action / Quick Link Buttons */}
                        {((msg.quickLinks && msg.quickLinks.length > 0) || msg.actionButton) && !msg.isStreaming && (
                          <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                            {(msg.quickLinks && msg.quickLinks.length > 0
                              ? msg.quickLinks
                              : msg.actionButton
                              ? [msg.actionButton]
                              : []
                            ).map((action, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleActionNavigation(action)}
                                className="group/btn inline-flex items-center gap-2 rounded-xl bg-blue-500/15 border border-blue-500/30 px-3.5 py-2 text-xs font-medium text-blue-300 transition-all hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm active:scale-95 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 cursor-pointer"
                              >
                                {action.isDownload ? (
                                  <Download size={13} className="transition-transform group-hover/btn:translate-y-0.5" />
                                ) : (
                                  <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
                                )}
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Dynamic Clickable Recommendation Chips (Fluid arrangement based on panel width) */}
                        {msg.followUpSuggestions &&
                          msg.followUpSuggestions.length > 0 &&
                          !msg.isStreaming && (
                            <div className="mt-3.5 pt-3 flex flex-col gap-2 border-t border-white/10">
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400/80">Recommended Questions</p>
                              <div className={cn(
                                "gap-2 transition-all duration-300",
                                isWideLayout ? "grid grid-cols-2" : "flex flex-col"
                              )}>
                                {msg.followUpSuggestions.map((suggestion) => (
                                  <button
                                    key={suggestion}
                                    onClick={() => handleSendMessage(suggestion)}
                                    className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/80 transition-all hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-300 active:scale-[0.99] text-left"
                                  >
                                    <span className="line-clamp-2">{suggestion}</span>
                                    <ArrowRight size={12} className="text-white/30 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                      <span className="text-[9px] font-normal text-white/40 px-1">{msg.timestamp}</span>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-2 rounded-2xl rounded-tl-xs border border-white/10 bg-white/[0.06] px-4 py-3 text-xs text-white/70 backdrop-blur-md w-fit">
                      <span className="flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: "180ms" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: "360ms" }} />
                      </span>
                      <span className="text-[11px] text-white/60">Krish AI is thinking...</span>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="relative z-10 flex items-center gap-2 border-t border-white/10 bg-[#0e1424]/80 p-3 sm:p-3.5 backdrop-blur-xl"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask Krish AI a question..."
                    className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/40 focus:border-blue-500/50 focus:bg-white/[0.08] focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all",
                      inputValue.trim() && !isTyping
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 hover:bg-blue-500 hover:scale-105 active:scale-95"
                        : "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
                    )}
                    aria-label="Send message"
                  >
                    <Send size={14} />
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
