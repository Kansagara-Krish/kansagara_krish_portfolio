import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/public/BlogCard";
import { ExperienceTimeline } from "@/components/public/ExperienceTimeline";
import { HeroSection } from "@/components/public/HeroSection";
import { ProjectCard } from "@/components/public/ProjectCard";
import { SkillsCloud } from "@/components/public/SkillsCloud";
import { Button } from "@/components/ui/Button";
import { defaultSettings } from "@/lib/defaults";
import { fetchApi } from "@/lib/server-data";
import type { BlogPostDTO, ExperienceDTO, ProjectDTO, SiteSettingsDTO, SkillDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home",
  description: "Portfolio homepage for a computer engineer."
};

export default async function HomePage() {
  const [settings, projects, posts, experiences, skills] = await Promise.all([
    fetchApi<SiteSettingsDTO>("/settings", defaultSettings),
    fetchApi<ProjectDTO[]>("/projects", []),
    fetchApi<BlogPostDTO[]>("/blog", []),
    fetchApi<ExperienceDTO[]>("/experience", []),
    fetchApi<SkillDTO[]>("/skills", [])
  ]);
  const featured = projects.filter((project) => project.featured).slice(0, 3);

  return (
    <>
      <HeroSection settings={settings} />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">About Snapshot</p>
            <h2 className="mt-3 font-display text-3xl font-bold">Engineering with product sense and operational care.</h2>
            <p className="mt-4 leading-8 text-muted">{settings.bio}</p>
          </div>
          <SkillsCloud skills={skills.slice(0, 8)} />
        </div>
      </section>
      <section id="featured-projects" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Featured Projects</p>
            <h2 className="mt-3 font-display text-3xl font-bold">Selected builds</h2>
          </div>
          <Button href="/projects" variant="ghost" icon={<ArrowRight size={18} />}>All projects</Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Experience</p>
            <h2 className="mt-3 font-display text-3xl font-bold">Recent work</h2>
          </div>
          <Button href="/experience" variant="ghost" icon={<ArrowRight size={18} />}>See all experience</Button>
        </div>
        <ExperienceTimeline experiences={experiences.slice(0, 2)} />
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Latest Blog Posts</p>
            <h2 className="mt-3 font-display text-3xl font-bold">Writing and notes</h2>
          </div>
          <Button href="/blog" variant="ghost" icon={<ArrowRight size={18} />}>Read all posts</Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => <BlogCard key={post.id} post={post} />)}
        </div>
      </section>
      <section className="border-y border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold">Have a useful problem to solve?</h2>
            <p className="mt-2 text-muted">I’m available for thoughtful product engineering, dashboards, and platform work.</p>
          </div>
          <Button href="/contact" size="lg">Get In Touch</Button>
        </div>
      </section>
    </>
  );
}
