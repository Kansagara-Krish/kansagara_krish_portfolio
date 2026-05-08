"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { TagInput } from "@/components/admin/TagInput";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { ExperienceDTO } from "@/lib/types";

type ExperienceState = {
  company: string;
  role: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  skills: string[];
  logoUrl: string;
  order: number;
};

function dateInput(value?: string | null) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

export function ExperienceForm({ experience }: { experience?: ExperienceDTO }) {
  const router = useRouter();
  const [state, setState] = useState<ExperienceState>({
    company: experience?.company ?? "",
    role: experience?.role ?? "",
    location: experience?.location ?? "",
    type: experience?.type ?? "full-time",
    startDate: dateInput(experience?.startDate),
    endDate: dateInput(experience?.endDate),
    current: experience?.current ?? false,
    description: experience?.description ?? "",
    skills: experience?.skills ?? [],
    logoUrl: experience?.logoUrl ?? "",
    order: experience?.order ?? 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch(experience ? `/api/experience/${experience.id}` : "/api/experience", {
      method: experience ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...state, endDate: state.current ? null : state.endDate })
    });
    setLoading(false);
    if (response.ok) {
      router.push("/admin/experience");
      router.refresh();
    } else {
      const json = (await response.json()) as { error?: string };
      setError(json.error ?? "Unable to save experience.");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      {error ? <p className="rounded-[6px] bg-red-500/10 p-3 text-sm text-red-500">{error}</p> : null}
      <Card className="grid gap-4 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Company" value={state.company} onChange={(event) => setState((current) => ({ ...current, company: event.target.value }))} required />
          <Input placeholder="Role" value={state.role} onChange={(event) => setState((current) => ({ ...current, role: event.target.value }))} required />
          <Input placeholder="Location" value={state.location} onChange={(event) => setState((current) => ({ ...current, location: event.target.value }))} />
          <select className="h-10 rounded-[6px] border border-border bg-bg px-3 text-sm" value={state.type} onChange={(event) => setState((current) => ({ ...current, type: event.target.value }))}>
            <option value="full-time">Full-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
          <Input type="date" value={state.startDate} onChange={(event) => setState((current) => ({ ...current, startDate: event.target.value }))} required />
          <Input type="date" value={state.endDate} disabled={state.current} onChange={(event) => setState((current) => ({ ...current, endDate: event.target.value }))} />
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={state.current} onChange={(event) => setState((current) => ({ ...current, current: event.target.checked }))} /> Current role</label>
        <Textarea placeholder="Description" value={state.description} onChange={(event) => setState((current) => ({ ...current, description: event.target.value }))} required />
        <TagInput values={state.skills} onChange={(skills) => setState((current) => ({ ...current, skills }))} placeholder="Add a skill" />
        <Input placeholder="Logo URL" value={state.logoUrl} onChange={(event) => setState((current) => ({ ...current, logoUrl: event.target.value }))} />
        <ImageUpload onUploaded={(logoUrl) => setState((current) => ({ ...current, logoUrl }))} />
        <Input type="number" placeholder="Order" value={state.order} onChange={(event) => setState((current) => ({ ...current, order: Number(event.target.value) }))} />
      </Card>
      <Button type="submit" disabled={loading} icon={<Save size={18} />}>{loading ? "Saving..." : "Save Experience"}</Button>
    </form>
  );
}
