"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trash2, Loader2, Mail, MailOpen, Check } from "lucide-react";

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
  const [marking, setMarking] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      const json = await res.json() as { data?: ContactMessage[] };
      setMessages(json.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleMarkAsRead = async (id: string) => {
    setMarking(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });

      if (res.ok) {
        setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    } finally {
      setMarking(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className="font-display text-3xl font-bold">Messages</h1>
        <p className="mt-2 text-muted">View contact messages from visitors</p>
      </div>

      <div className="mt-8 grid gap-4">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted">
              No messages yet.
            </CardContent>
          </Card>
        ) : (
          messages.map((msg) => (
            <Card key={msg.id} className={!msg.read ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-semibold">{msg.subject}</h3>
                      {!msg.read && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                          New
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      From: {msg.name} ({msg.email})
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!msg.read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(msg.id)}
                        disabled={marking === msg.id}
                      >
                        {marking === msg.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(msg.id)}
                      disabled={deleting === msg.id}
                    >
                      {deleting === msg.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <button
                  onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">
                      {expanded === msg.id ? "Hide message" : "View message"}
                    </span>
                    {expanded === msg.id ? (
                      <MailOpen size={16} />
                    ) : (
                      <Mail size={16} />
                    )}
                  </div>
                  {expanded === msg.id && (
                    <div className="mt-4 rounded-lg bg-surface p-4 text-sm">
                      {msg.message}
                    </div>
                  )}
                </button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
