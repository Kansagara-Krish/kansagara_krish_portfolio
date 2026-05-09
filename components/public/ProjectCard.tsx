import { ExternalLink } from "lucide-react";
import { Github } from "@/components/ui/BrandIcons";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ProjectDTO } from "@/lib/types";

export function ProjectCard({ project }: { project: ProjectDTO }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link href={`/projects/${project.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        <Image
          src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute right-3 top-3 z-10">
          <Badge variant={project.status === "completed" ? "success" : "warning"}>
            {project.status}
          </Badge>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <Link href={`/projects/${project.slug}`} className="font-display text-xl tracking-tight transition-colors hover:text-primary">
          {project.title}
        </Link>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 3).map((tech, index) => (
              <Badge key={`${tech}-${index}`} variant="muted" className="text-[10px]">
                {tech}
              </Badge>
            ))}
            {project.techStack.length > 3 && (
              <span className="text-[10px] text-muted">+{project.techStack.length - 3}</span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-xs font-medium text-muted">{project.status}</span>
            <div className="flex items-center gap-2">
              {project.githubUrl ? (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  aria-label="GitHub repository"
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-border/50 hover:text-text"
                >
                  <Github size={16} />
                </Link>
              ) : null}
              {project.liveUrl ? (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  aria-label="Live project"
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-border/50 hover:text-text"
                >
                  <ExternalLink size={16} />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
