"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { TagInput } from "@/components/admin/TagInput";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { ProjectDTO } from "@/lib/types";
import { slugify } from "@/lib/utils";

type ProjectState = {
  title: string;
  slug: string;
  description: string;
  content: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  imageUrl: string;
  featured: boolean;
  status: "completed" | "in-progress" | "archived";
  tags: string[];
};

export function ProjectForm({ project }: { project?: ProjectDTO }) {
  const router = useRouter();
  const [state, setState] = useState<ProjectState>({
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    description: project?.description ?? "",
    content: project?.content ?? "<p></p>",
    techStack: project?.techStack ?? [],
    liveUrl: project?.liveUrl ?? "",
    githubUrl: project?.githubUrl ?? "",
    imageUrl: project?.imageUrl ?? "",
    featured: project?.featured ?? false,
    status: (project?.status as ProjectState["status"]) ?? "completed",
    tags: project?.tags.map((tag) => tag.name) ?? []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch(project ? `/api/projects/${project.id}` : "/api/projects", {
      method: project ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state)
    });
    setLoading(false);
    if (response.ok) {
      router.push("/admin/projects");
      router.refresh();
    } else {
      const json = (await response.json()) as { error?: string };
      setError(json.error ?? "Unable to save project.");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      {error ? <p className="rounded-[6px] bg-red-500/10 p-3 text-sm text-red-500">{error}</p> : null}
      <Card className="grid gap-4 p-5">
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="title">Title</label>
          <Input id="title" value={state.title} onChange={(event) => setState((current) => ({ ...current, title: event.target.value, slug: current.slug || slugify(event.target.value) }))} required />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="slug">Slug</label>
          <Input id="slug" value={state.slug} onChange={(event) => setState((current) => ({ ...current, slug: slugify(event.target.value) }))} required />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="description">Description</label>
          <Textarea id="description" value={state.description} onChange={(event) => setState((current) => ({ ...current, description: event.target.value }))} required />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Content</label>
          <RichTextEditor value={state.content} onChange={(content) => setState((current) => ({ ...current, content }))} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Tech Stack</label>
          <TagInput values={state.techStack} onChange={(techStack) => setState((current) => ({ ...current, techStack }))} placeholder="Type and press Enter" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Live URL" value={state.liveUrl} onChange={(event) => setState((current) => ({ ...current, liveUrl: event.target.value }))} />
          <Input placeholder="GitHub URL" value={state.githubUrl} onChange={(event) => setState((current) => ({ ...current, githubUrl: event.target.value }))} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Image</label>
          <Input value={state.imageUrl} onChange={(event) => setState((current) => ({ ...current, imageUrl: event.target.value }))} placeholder="Image URL" />
          <ImageUpload onUploaded={(imageUrl) => setState((current) => ({ ...current, imageUrl }))} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Tags</label>
          <TagInput values={state.tags} onChange={(tags) => setState((current) => ({ ...current, tags }))} placeholder="Add a tag" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={state.featured} onChange={(event) => setState((current) => ({ ...current, featured: event.target.checked }))} /> Featured</label>
          <select className="h-10 rounded-[6px] border border-border bg-bg px-3 text-sm" value={state.status} onChange={(event) => setState((current) => ({ ...current, status: event.target.value as ProjectState["status"] }))}>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </Card>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading} icon={<Save size={18} />}>{loading ? "Saving..." : "Save Project"}</Button>
        <Button type="button" variant="secondary" onClick={() => setState((current) => ({ ...current, status: "in-progress" }))}>Save as Draft</Button>
        <Button type="button" variant="secondary" onClick={() => setState((current) => ({ ...current, status: "completed" }))}>Publish</Button>
      </div>
    </form>
  );
}
