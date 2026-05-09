"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import type { HackathonDTO } from "@/lib/types";

export function HackathonForm({ initialData }: { initialData?: HackathonDTO }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Partial<HackathonDTO>>(
    initialData || {
      title: "", project: "", role: "", date: new Date().toISOString(), location: "", result: "", link: "", description: "", image: ""
    }
  );

  function update(field: keyof HackathonDTO, value: string) {
    setData((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    await fetch(initialData ? `/api/hackathons/${initialData.id}` : "/api/hackathons", {
      method: initialData ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    router.push("/admin/hackathons");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-6">
      <div className="grid gap-4 rounded-[8px] border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-bold">{initialData ? "Edit" : "New"} Hackathon</h2>
        
        <div className="grid gap-2">
          <Label>Title</Label>
          <Input value={data.title || ""} onChange={(e) => update("title", e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label>Project Name</Label>
          <Input value={data.project || ""} onChange={(e) => update("project", e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label>Role</Label>
          <Input value={data.role || ""} onChange={(e) => update("role", e.target.value)}  />
        </div>
        <div className="grid gap-2">
          <Label>Date</Label>
          <Input type="date" value={data.date ? new Date(data.date).toISOString().split('T')[0] : ""} onChange={(e) => update("date", e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label>Location</Label>
          <Input value={data.location || ""} onChange={(e) => update("location", e.target.value)}  />
        </div>
        <div className="grid gap-2">
          <Label>Result (e.g., Winner)</Label>
          <Input value={data.result || ""} onChange={(e) => update("result", e.target.value)}  />
        </div>
        <div className="grid gap-2">
          <Label>Link</Label>
          <Input value={data.link || ""} onChange={(e) => update("link", e.target.value)}  />
        </div>
        <div className="grid gap-2">
          <Label>Image URL</Label>
          <Input value={data.image || ""} onChange={(e) => update("image", e.target.value)}  />
        </div>
        <div className="grid gap-2">
          <Label>Description</Label>
          <Textarea value={data.description || ""} onChange={(e) => update("description", e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
      </div>
    </form>
  );
}