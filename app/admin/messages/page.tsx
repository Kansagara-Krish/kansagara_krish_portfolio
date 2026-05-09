"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trash2, Loader2, Mail, Eye, EyeOff } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [markingRead, setMarkingRead] = useState<string | null>(null);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-tight">Messages</h1>
          <p className="mt-1 text-sm text-muted">
            {messages.filter((m) => !m.read).length} unread
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted">
              No messages yet. Check back later!
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <Card key={message.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{message.subject}</h3>
                      {!message.read && (
                        <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] text-white">
                          New
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                      <Mail size={12} />
                      <span>{message.name}</span>
                      <span>{message.email}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleMarkRead(message.id, !message.read)}
                      disabled={markingRead === message.id}
                      className="rounded-lg p-2 text-muted hover:bg-border/30 transition-colors"
                    >
                      {markingRead === message.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : message.read ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(message.id)}
                      disabled={deleting === message.id}
                      className="rounded-lg p-2 text-muted hover:bg-red-600/10 hover:text-red-600 transition-colors"
                    >
                      {deleting === message.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleExpand(message.id)}
                  >
                    {expandedMessage === message.id ? "Hide" : "View"}
                  </Button>
                </div>
                {expandedMessage === message.id && (
                  <div className="mt-4 rounded-xl border border-border bg-surface p-5">
                    <p className="whitespace-pre-wrap text-sm text-muted">
                      {message.message}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
