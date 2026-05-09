"use client";

import { Mail, Reply, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ContactMessageDTO } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

type Filter = "all" | "unread" | "read";

export function MessagesInbox({ messages }: { messages: ContactMessageDTO[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = messages.filter((message) => filter === "all" || message.read === (filter === "read"));
  const [selectedId, setSelectedId] = useState(filtered.at(0)?.id ?? "");
  const selected = messages.find((message) => message.id === selectedId) ?? filtered.at(0);

  async function open(id: string) {
    setSelectedId(id);
    await fetch(`/api/messages/${id}`, { method: "PATCH" });
    router.refresh();
  }

  async function remove(id: string) {
    if (window.confirm("Delete this message?")) {
      await fetch(`/api/messages/${id}`, { method: "DELETE" });
      router.refresh();
    }
  }

  return (
    <div className="grid min-h-[620px] overflow-hidden rounded-[8px] border border-border bg-surface lg:grid-cols-[360px_1fr]">
      <aside className="border-b border-border lg:border-b-0 lg:border-r">
        <div className="flex gap-2 border-b border-border p-3">
          {(["all", "unread", "read"] as Filter[]).map((item) => (
            <Button key={item} size="sm" variant={filter === item ? "primary" : "secondary"} onClick={() => setFilter(item)}>
              {item[0].toUpperCase() + item.slice(1)}
            </Button>
          ))}
        </div>
        <div className="max-h-[560px] overflow-y-auto">
          {filtered.map((message) => (
            <button
              key={message.id}
              onClick={() => void open(message.id)}
              className={cn("block w-full border-b border-border p-4 text-left hover:bg-bg", selected?.id === message.id && "bg-bg")}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{message.name}</p>
                {!message.read ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
              </div>
              <p className="mt-1 truncate text-sm text-muted">{message.subject}</p>
              <p className="mt-2 text-xs text-muted">{formatDate(message.createdAt)}</p>
            </button>
          ))}
        </div>
      </aside>
      <section className="p-5">
        {selected ? (
          <div>
            <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl font-semibold">{selected.subject}</h2>
                  <Badge variant={selected.read ? "muted" : "default"}>{selected.read ? "Read" : "Unread"}</Badge>
                </div>
                <p className="mt-2 text-muted">{selected.name} · {selected.email}</p>
                <p className="mt-1 text-sm text-muted">{formatDate(selected.createdAt, "MMM d, yyyy h:mm a")}</p>
              </div>
              <div className="flex gap-2">
                <Button href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`} variant="secondary" icon={<Reply size={16} />}>Reply</Button>
                <Button variant="danger" size="icon" onClick={() => void remove(selected.id)} aria-label="Delete message"><Trash2 size={16} /></Button>
              </div>
            </div>
            <p className="mt-6 whitespace-pre-wrap leading-8 text-muted">{selected.message}</p>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-muted">
            <Mail size={28} />
            <p>No messages match this filter.</p>
            <Link className="text-primary" href="/contact">Open contact page</Link>
          </div>
        )}
      </section>
    </div>
  );
}
