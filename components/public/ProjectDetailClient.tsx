"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ExternalLink, LinkIcon, Sparkles } from "lucide-react";
import { Github } from "@/components/ui/BrandIcons";
import Image from "next/image";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import type { ProjectDTO } from "@/lib/types";
import { sanitizeHtml } from "@/lib/utils";

export function ProjectDetailClient({ project, related }: { project: ProjectDTO; related: ProjectDTO[] }) {
  const projectLinks = Array.isArray(project.projectLinks) ? project.projectLinks : [];
  const overviewItems = [
    ["Role", project.role],
    ["Client", project.client],
    ["Category", project.category],
    ["Timeline", project.timeline],
    ["Year", project.year]
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <article className="relative min-h-screen bg-bg/50 pb-24 overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute left-[-10%] top-[-5%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />
      <div className="absolute right-[-10%] top-[20%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />

      {/* Header & Meta Section - Crisp and Clear */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pt-12 lg:pt-16 pb-12">
        <ScrollReveal animation="fade-up" className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-6">
          <Button 
            href="/projects" 
            variant="ghost" 
            className="group -ml-3 text-muted hover:text-text" 
            icon={<ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />}
          >
            Back to Projects
          </Button>

          <div className="flex flex-wrap items-center gap-3">
            {project.githubUrl ? (
              <Button href={project.githubUrl} variant="secondary" size="md" icon={<Github size={16} />}>
                Source Code
              </Button>
            ) : null}
            {project.liveUrl ? (
              <Button href={project.liveUrl} size="md" icon={<ExternalLink size={16} />}>
                Live Demo
              </Button>
            ) : null}
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={0.05}>
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <Badge 
              variant={project.status === "completed" ? "success" : "warning"} 
              className="text-[10px] font-bold uppercase tracking-wider"
            >
              {project.status}
            </Badge>
            {project.category && (
              <Badge variant="default" className="bg-primary/10 border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                {project.category}
              </Badge>
            )}
            {project.year && (
              <span className="text-xs font-semibold text-muted/80">
                {project.year}
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl leading-[1.1]">
            {project.title}
          </h1>

          {project.subtitle ? (
            <p className="mt-5 max-w-3xl text-lg text-muted lg:text-xl leading-relaxed">
              {project.subtitle}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech} variant="muted" className="bg-surface/60 border-border/60 text-text/80 text-xs py-1 px-3">
                {tech}
              </Badge>
            ))}
          </div>
        </ScrollReveal>

        {/* Featured Project Showcase Card Frame */}
        <ScrollReveal animation="zoom-in" delay={0.1} className="relative mt-12">
          <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-surface/40 p-2 sm:p-3 shadow-2xl backdrop-blur-xl">
            {/* Top Browser Dots Bar */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border/40 mb-2">
              <span className="h-3 w-3 rounded-full bg-red-500/60" />
              <span className="h-3 w-3 rounded-full bg-amber-500/60" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/60" />
              <span className="ml-2 text-[11px] font-mono text-muted/50 truncate max-w-xs">{project.slug}</span>
            </div>

            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-surface">
              <Image
                src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop"}
                alt={project.title}
                fill
                priority
                className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                sizes="(min-width: 1024px) 1024px, 100vw"
              />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Main Content & Details */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-16 lg:grid-cols-[1fr_300px]">
          <div>
            <ScrollReveal animation="fade-up" delay={0.05}>
              <h2 className="font-display text-2xl font-bold tracking-tight mb-4">About the Project</h2>
              <p className="text-lg leading-relaxed text-muted sm:text-xl">
                {project.description}
              </p>
            </ScrollReveal>

            {project.problem || project.solution || project.impact ? (
              <ScrollReveal animation="fade-up" delay={0.1} className="mt-14 grid gap-5 md:grid-cols-3">
                {project.problem ? (
                  <section className="rounded-2xl border border-border/60 bg-surface/50 p-6 shadow-sm backdrop-blur-sm">
                    <p className="text-xs font-black uppercase tracking-wider text-primary">Problem</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{project.problem}</p>
                  </section>
                ) : null}
                {project.solution ? (
                  <section className="rounded-2xl border border-border/60 bg-surface/50 p-6 shadow-sm backdrop-blur-sm">
                    <p className="text-xs font-black uppercase tracking-wider text-primary">Solution</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{project.solution}</p>
                  </section>
                ) : null}
                {project.impact ? (
                  <section className="rounded-2xl border border-border/60 bg-surface/50 p-6 shadow-sm backdrop-blur-sm">
                    <p className="text-xs font-black uppercase tracking-wider text-primary">Impact</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{project.impact}</p>
                  </section>
                ) : null}
              </ScrollReveal>
            ) : null}

            {project.features.length > 0 || project.outcomes.length > 0 ? (
              <div className="mt-14 grid gap-8 md:grid-cols-2">
                {project.features.length > 0 ? (
                  <ScrollReveal animation="fade-up" delay={0.1}>
                    <h2 className="font-display text-xl font-bold tracking-tight">Key Features</h2>
                    <div className="mt-5 grid gap-3">
                      {project.features.map((feature) => (
                        <div key={feature} className="flex gap-3 rounded-xl border border-border/60 bg-surface/50 p-4 backdrop-blur-sm">
                          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                          <span className="text-sm text-text/80 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollReveal>
                ) : null}
                {project.outcomes.length > 0 ? (
                  <ScrollReveal animation="fade-up" delay={0.15}>
                    <h2 className="font-display text-xl font-bold tracking-tight">Outcomes</h2>
                    <div className="mt-5 grid gap-3">
                      {project.outcomes.map((outcome) => (
                        <div key={outcome} className="flex gap-3 rounded-xl border border-border/60 bg-surface/50 p-4 backdrop-blur-sm">
                          <Sparkles size={18} className="mt-0.5 shrink-0 text-primary" />
                          <span className="text-sm text-text/80 leading-relaxed">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollReveal>
                ) : null}
              </div>
            ) : null}

            {project.content ? (
              <ScrollReveal animation="fade-up" delay={0.1} className="mt-16">
                <div
                  className="prose-content max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.content) }}
                />
              </ScrollReveal>
            ) : null}

            {project.galleryImages.length > 0 ? (
              <ScrollReveal animation="fade-up" className="mt-16">
                <h2 className="font-display text-2xl font-bold tracking-tight">Project Gallery</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {project.galleryImages.map((imageUrl) => (
                    <div key={imageUrl} className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-md">
                      <Image src={imageUrl} alt={`${project.title} screenshot`} fill className="object-cover transition-transform duration-500 hover:scale-105" sizes="(min-width: 1024px) 320px, 100vw" />
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            ) : null}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <ScrollReveal animation="fade-left" delay={0.1} className="rounded-2xl border border-border/60 bg-surface/50 p-6 backdrop-blur-sm shadow-sm">
              <h3 className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                <Sparkles size={14} />
                Overview
              </h3>
              <div className="space-y-5">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted/70">Phase</span>
                  <span className="mt-1 text-base font-bold capitalize text-text">{project.status}</span>
                </div>
                {overviewItems.map(([label, value]) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted/70">{label}</span>
                    <span className="mt-1 text-sm font-semibold text-text">{value}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left" delay={0.15} className="rounded-2xl border border-border/60 bg-surface/50 p-6 backdrop-blur-sm shadow-sm">
              <h3 className="mb-5 text-xs font-black uppercase tracking-widest text-primary">Core Tech</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="default" className="bg-primary/5 border-primary/10 text-primary text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </ScrollReveal>

            {projectLinks.length > 0 ? (
              <ScrollReveal animation="fade-left" delay={0.2} className="rounded-2xl border border-border/60 bg-surface/50 p-6 backdrop-blur-sm shadow-sm">
                <h3 className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                  <LinkIcon size={14} />
                  Links
                </h3>
                <div className="grid gap-2">
                  {projectLinks.map((link) => (
                    <Button key={`${link.label}-${link.url}`} href={link.url} target="_blank" variant="secondary" className="justify-between text-sm" icon={<ExternalLink size={14} />}>
                      {link.label}
                    </Button>
                  ))}
                </div>
              </ScrollReveal>
            ) : null}
          </aside>
        </div>
      </div>

      {/* Similar Projects Section */}
      {related.length > 0 ? (
        <section className="border-t border-border/60 bg-surface/30 py-20 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-6">
            <ScrollReveal animation="fade-up" className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">More Work</p>
                <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">Similar Projects</h2>
              </div>
              <Button href="/projects" variant="ghost" icon={<ArrowLeft size={16} className="rotate-180" />}>
                All projects
              </Button>
            </ScrollReveal>
            <StaggerContainer staggerDelay={0.1} className="grid gap-8 md:grid-cols-3">
              {related.map((item) => (
                <StaggerItem key={item.id}>
                  <ProjectCard project={item} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      ) : null}
    </article>
  );
}
