import { ExternalLink, ArrowRight } from "lucide-react";
import { Github } from "@/components/ui/BrandIcons";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ProjectDTO } from "@/lib/types";

export function ProjectCard({ project }: { project: ProjectDTO }) {
  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border-border/50 bg-surface/30 transition-all duration-500 hover:border-primary/30 hover:bg-surface/50 hover:shadow-2xl hover:shadow-primary/5">
      <Link href={`/projects/${project.slug}`} className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute right-4 top-4 z-10">
          <Badge 
            variant={project.status === "completed" ? "success" : "warning"}
            className="backdrop-blur-md bg-bg/80 border-border/50 shadow-sm"
          >
            {project.status}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </Link>

      <div className="flex flex-1 flex-col p-8">
        <div className="mb-4 flex items-center justify-between">
           <Link href={`/projects/${project.slug}`} className="group/title">
             <h3 className="font-display text-2xl leading-tight tracking-tight transition-colors duration-300 group-hover/title:text-primary">
               {project.title}
             </h3>
           </Link>
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-muted/80">
          {project.description}
        </p>

        <div className="mt-auto pt-8">
          <div className="flex flex-wrap gap-2 mb-8">
            {project.techStack.slice(0, 4).map((tech, index) => (
              <Badge 
                key={`${tech}-${index}`} 
                variant="default" 
                className="bg-primary/5 border-primary/10 text-[10px] font-bold uppercase tracking-wider text-primary/80"
              >
                {tech}
              </Badge>
            ))}
            {project.techStack.length > 4 && (
              <span className="flex items-center text-[10px] font-bold text-muted/40 uppercase tracking-widest">
                +{project.techStack.length - 4} More
              </span>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border/50 pt-6">
            <div className="flex items-center gap-1.5">
               {project.githubUrl && (
                 <Link
                   href={project.githubUrl}
                   target="_blank"
                   className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface/50 border border-border/50 text-muted transition-all duration-300 hover:border-primary/30 hover:bg-surface hover:text-primary hover:shadow-lg hover:shadow-primary/5"
                 >
                   <Github size={18} />
                 </Link>
               )}
               {project.liveUrl && (
                 <Link
                   href={project.liveUrl}
                   target="_blank"
                   className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface/50 border border-border/50 text-muted transition-all duration-300 hover:border-primary/30 hover:bg-surface hover:text-primary hover:shadow-lg hover:shadow-primary/5"
                 >
                   <ExternalLink size={18} />
                 </Link>
               )}
            </div>
            
            <Link 
              href={`/projects/${project.slug}`} 
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary group-hover:gap-3 transition-all"
            >
              Case Study <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
