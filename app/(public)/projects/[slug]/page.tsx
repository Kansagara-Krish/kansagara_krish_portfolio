import type { Metadata } from "next";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ViewTracker } from "@/components/public/ViewTracker";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/server-data";
import type { ProjectDTO } from "@/lib/types";
import { sanitizeHtml } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await fetchApi<ProjectDTO | null>(`/projects/${params.slug}`, null);
  return {
    title: project?.title ?? "Project",
    description: project?.description ?? "Project detail",
    openGraph: {
      images: [`/api/og?title=${encodeURIComponent(project?.title ?? "Project")}&subtitle=Project`]
    }
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const [project, allProjects] = await Promise.all([
    fetchApi<ProjectDTO | null>(`/projects/${params.slug}`, null),
    fetchApi<ProjectDTO[]>("/projects", [])
  ]);
  if (!project) notFound();
  const tagNames = new Set(project.tags.map((tag) => tag.name));
  const related = allProjects.filter((item) => item.id !== project.id && item.tags.some((tag) => tagNames.has(tag.name))).slice(0, 3);

  return (
    <article>
      <ViewTracker path={`/api/projects/${project.id}`} />
      <div className="relative h-[45vh] min-h-80 bg-muted/10">
        <Image
          src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop"}
          alt={project.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
      </div>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Button href="/projects" variant="ghost" icon={<ArrowLeft size={18} />}>Back</Button>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge variant={project.status === "completed" ? "success" : "warning"}>{project.status}</Badge>
          {project.techStack.map((tech) => <Badge key={tech} variant="muted">{tech}</Badge>)}
        </div>
        <h1 className="mt-5 font-display text-4xl font-bold">{project.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted">{project.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {project.githubUrl ? <Button href={project.githubUrl} variant="secondary" icon={<Github size={18} />}>GitHub</Button> : null}
          {project.liveUrl ? <Button href={project.liveUrl} icon={<ExternalLink size={18} />}>Live URL</Button> : null}
        </div>
        <div className="prose-content mt-10" dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.content) }} />
      </div>
      {related.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-6 font-display text-3xl font-bold">Related projects</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((item) => <ProjectCard key={item.id} project={item} />)}
          </div>
        </section>
      ) : null}
    </article>
  );
}
