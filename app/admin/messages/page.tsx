"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Trash2, Loader2, Mail, Eye, EyeOff, MessageSquare, ChevronDown, ChevronUp, Search, SlidersHorizontal, Reply, Inbox, ArrowUpRight, AtSign, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [markingRead, setMarkingRead] = useState<string | null>(null);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/admin/messages");
        const json = await res.json();
        setMessages(json.data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    } finally {
      setDeleting(null);
    }
  };

  const handleMarkRead = async (id: string, read: boolean) => {
    setMarkingRead(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });

      if (res.ok) {
        setMessages(messages.map((m) => (m.id === id ? { ...m, read } : m)));
      }
    } catch (error) {
      console.error("Error marking message:", error);
    } finally {
      setMarkingRead(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedMessage(expandedMessage === id ? null : id);
    const message = messages.find((m) => m.id === id);
    if (message && !message.read) {
      handleMarkRead(id, true);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(filter.toLowerCase()) || 
    m.email.toLowerCase().includes(filter.toLowerCase()) ||
    m.subject.toLowerCase().includes(filter.toLowerCase()) ||
    m.message.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
        <p className="mt-4 text-sm font-black uppercase tracking-widest text-muted">Syncing inbox...</p>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            <Inbox size={12} />
            Communication Hub
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-text sm:text-6xl">Messages</h1>
          <p className="text-lg text-muted max-w-2xl">
            Manage incoming inquiries, collaboration requests, and networking opportunities. You have <span className="font-bold text-primary">{unreadCount}</span> unread conversations.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search by sender, email, or content..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-14 w-full rounded-2xl border border-border/50 bg-surface/30 pl-12 pr-4 text-sm font-medium text-text outline-none backdrop-blur-md transition-all focus:border-primary/50 focus:bg-surface/50 focus:ring-4 focus:ring-primary/5"
          />
        </div>
        <div className="flex h-14 items-center gap-2 rounded-2xl border border-border/50 bg-surface/30 px-4 backdrop-blur-md">
          <SlidersHorizontal size={18} className="text-muted" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted">{filteredMessages.length} Messages</span>
        </div>
      </div>

      {/* Message List */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredMessages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full"
            >
              <Card className="flex flex-col items-center justify-center border-dashed border-border/50 bg-surface/10 p-24 text-center backdrop-blur-sm">
                <div className="flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-primary/5 text-primary mb-6 animate-pulse">
                  <MessageSquare size={40} />
                </div>
                <h3 className="font-display text-2xl font-bold">Inbox is quiet</h3>
                <p className="mt-2 text-muted max-w-sm mx-auto">No messages match your current filter. When people contact you, their inquiries will appear here.</p>
              </Card>
            </motion.div>
          ) : (
            filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                variants={item}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className={cn(
                  "group relative overflow-hidden transition-all duration-500 border-border/50 backdrop-blur-md hover:bg-surface/50 hover:shadow-2xl hover:shadow-primary/5",
                  !message.read ? "bg-primary/[0.05] border-primary/20" : "bg-surface/30"
                )}>
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                      <div className={cn(
                        "relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] border shadow-inner transition-all duration-500 group-hover:scale-110",
                        !message.read ? "bg-primary text-bg border-primary/20" : "bg-bg border-border/50 text-muted"
                      )}>
                        <Mail size={28} />
                        {!message.read && (
                          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary border-2 border-surface animate-pulse shadow-lg" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0" onClick={() => toggleExpand(message.id)} role="button">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className={cn(
                            "font-display text-2xl font-bold tracking-tight transition-colors truncate leading-tight", 
                            !message.read ? "text-text" : "text-muted"
                          )}>
                            {message.subject}
                          </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted/60">
                          <span className="flex items-center gap-2 font-bold text-text/80">
                            <Reply size={14} className="text-primary/60" />
                            {message.name}
                          </span>
                          <span className="flex items-center gap-2">
                            <AtSign size={14} className="text-primary/60" />
                            {message.email}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock size={14} className="text-primary/60" />
                            {new Date(message.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 sm:shrink-0 lg:border-l lg:border-border/50 lg:pl-8">
                        <button
                          onClick={() => handleMarkRead(message.id, !message.read)}
                          disabled={markingRead === message.id}
                          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg border border-border/50 text-muted transition-all hover:bg-primary hover:text-bg hover:border-primary active:scale-95"
                          title={message.read ? "Mark as unread" : "Mark as read"}
                        >
                          {markingRead === message.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : message.read ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleDelete(message.id)}
                          disabled={deleting === message.id}
                          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg border border-border/50 text-muted transition-all hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-95"
                        >
                          {deleting === message.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>

                        <button
                          onClick={() => toggleExpand(message.id)}
                          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg border border-border/50 text-muted transition-all hover:bg-primary hover:text-bg hover:border-primary active:scale-95 ml-2"
                        >
                          {expandedMessage === message.id ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedMessage === message.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-10 rounded-[2.5rem] bg-bg/50 border border-border/50 p-8 sm:p-12 relative">
                            <div className="absolute right-10 top-10 text-muted/10">
                              <MessageSquare size={80} />
                            </div>
                            <div className="prose prose-invert max-w-none">
                              <p className="whitespace-pre-wrap text-lg leading-relaxed text-text/80">
                                {message.message}
                              </p>
                            </div>
                            <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
                              <div className="text-[10px] font-black uppercase tracking-widest text-muted/40">
                                Received {new Date(message.createdAt).toLocaleString()}
                              </div>
                              <a 
                                href={`mailto:${message.email}?subject=Re: ${message.subject}`} 
                                className="group/reply inline-flex items-center gap-3 rounded-2xl bg-primary px-8 py-5 text-sm font-black uppercase tracking-widest text-bg shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                              >
                                <Reply size={20} className="transition-transform group-hover/reply:-translate-x-1" />
                                Reply to {message.name.split(' ')[0]}
                                <ArrowUpRight size={18} className="opacity-40 group-hover/reply:translate-x-1 group-hover/reply:-translate-y-1 transition-transform" />
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
