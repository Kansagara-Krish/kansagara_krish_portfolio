import { ExternalLink, Eye, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ProjectDTO } from "@/lib/types";

export function ProjectCard({ project }: { project: ProjectDTO }) {
  return (
    <Card className="group overflow-hidden">
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="relative aspect-[16/10] bg-muted/10">
          <Image
            src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/projects/${project.slug}`} className="font-display text-xl font-semibold hover:text-primary">
            {project.title}
          </Link>
          <Badge variant={project.status === "completed" ? "success" : "warning"}>{project.status}</Badge>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="muted">{tech}</Badge>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <Eye size={14} /> {project.views}
          </span>
          <div className="flex items-center gap-2">
            {project.githubUrl ? (
              <Link href={project.githubUrl} aria-label="GitHub repository" className="rounded-[6px] p-2 text-muted hover:bg-bg hover:text-text">
                <Github size={18} />
              </Link>
            ) : null}
            {project.liveUrl ? (
              <Link href={project.liveUrl} aria-label="Live project" className="rounded-[6px] p-2 text-muted hover:bg-bg hover:text-text">
                <ExternalLink size={18} />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
