"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/public/ProjectCard";
import type { ProjectDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FilterableProjects({ projects }: { projects: ProjectDTO[] }) {
  const [active, setActive] = useState("All");
  const tags = ["All", ...new Set(projects.flatMap((project) => project.tags))];
  const visible = active === "All" ? projects : projects.filter((project) => project.tags.includes(active));

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActive(tag)}
            className={cn(
              "rounded-full px-4 py-2 text-sm transition-all",
              active === tag
                ? "bg-text text-bg"
                : "bg-surface text-muted border border-border hover:border-text/30"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>

      {visible.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
          <p className="text-lg font-medium text-muted">No projects found for this category.</p>
          <button onClick={() => setActive("All")} className="mt-4 text-sm text-primary hover:underline">View all projects</button>
        </div>
      )}
    </div>
  );
}
