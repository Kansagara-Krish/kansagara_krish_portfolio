"use client";

import { Save } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { SiteSettingsDTO } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type SettingsState = {
  name: string;
  title: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  resumeUrl: string;
  avatarUrl: string;
  heroTagline: string;
  openToWork: boolean;
};

export function SettingsForm({ settings }: { settings: SiteSettingsDTO }) {
  const [state, setState] = useState<SettingsState>({
    name: settings.name,
    title: settings.title,
    bio: settings.bio,
    email: settings.email,
    github: settings.github ?? "",
    linkedin: settings.linkedin ?? "",
    twitter: settings.twitter ?? "",
    resumeUrl: settings.resumeUrl ?? "",
    avatarUrl: settings.avatarUrl ?? "",
    heroTagline: settings.heroTagline ?? "",
    openToWork: settings.openToWork
  });
  const [status, setStatus] = useState("");

  async function save(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setStatus("Saving...");
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state)
    });
    setStatus(response.ok ? "Saved." : "Unable to save.");
  }

  return (
    <form onSubmit={(event) => void save(event)} className="grid gap-5">
      <Card className="grid gap-4 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Name" value={state.name} onBlur={() => void save()} onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))} required />
          <Input placeholder="Title / Role" value={state.title} onBlur={() => void save()} onChange={(event) => setState((current) => ({ ...current, title: event.target.value }))} required />
          <Input placeholder="Email" type="email" value={state.email} onBlur={() => void save()} onChange={(event) => setState((current) => ({ ...current, email: event.target.value }))} required />
          <Input placeholder="Resume URL" value={state.resumeUrl} onBlur={() => void save()} onChange={(event) => setState((current) => ({ ...current, resumeUrl: event.target.value }))} />
        </div>
        <Textarea placeholder="Bio" value={state.bio} onBlur={() => void save()} onChange={(event) => setState((current) => ({ ...current, bio: event.target.value }))} required />
        <Input placeholder="Hero tagline" value={state.heroTagline} onBlur={() => void save()} onChange={(event) => setState((current) => ({ ...current, heroTagline: event.target.value }))} />
        <div className="grid gap-4 md:grid-cols-3">
          <Input placeholder="GitHub URL" value={state.github} onBlur={() => void save()} onChange={(event) => setState((current) => ({ ...current, github: event.target.value }))} />
          <Input placeholder="LinkedIn URL" value={state.linkedin} onBlur={() => void save()} onChange={(event) => setState((current) => ({ ...current, linkedin: event.target.value }))} />
          <Input placeholder="Twitter URL" value={state.twitter} onBlur={() => void save()} onChange={(event) => setState((current) => ({ ...current, twitter: event.target.value }))} />
        </div>
        <Input placeholder="Avatar URL" value={state.avatarUrl} onBlur={() => void save()} onChange={(event) => setState((current) => ({ ...current, avatarUrl: event.target.value }))} />
        <ImageUpload onUploaded={(avatarUrl) => setState((current) => ({ ...current, avatarUrl }))} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={state.openToWork} onChange={(event) => setState((current) => ({ ...current, openToWork: event.target.checked }))} onBlur={() => void save()} /> Open to work</label>
      </Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-muted">
          <p>Last updated: {formatDate(settings.updatedAt, "MMM d, yyyy h:mm a")}</p>
          {status ? <p>{status}</p> : null}
        </div>
        <Button type="submit" icon={<Save size={18} />}>Save Settings</Button>
      </div>
    </form>
  );
}
