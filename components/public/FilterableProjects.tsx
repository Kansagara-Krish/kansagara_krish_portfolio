"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { ProjectCard } from "@/components/public/ProjectCard";
import type { ProjectDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FilterableProjects({ projects }: { projects: ProjectDTO[] }) {
  const [active, setActive] = useState("All");
  const tags = useMemo(() => ["All", ...Array.from(new Set(projects.flatMap((project) => project.tags.map((tag) => tag.name))))], [projects]);
  const visible = active === "All" ? projects : projects.filter((project) => project.tags.some((tag) => tag.name === active));

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button key={tag} onClick={() => setActive(tag)} className={cn("rounded-[4px]", active === tag && "ring-2 ring-primary")}>
            <Badge variant={active === tag ? "default" : "muted"}>{tag}</Badge>
          </button>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </div>
  );
}
