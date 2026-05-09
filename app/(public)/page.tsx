import type { Metadata } from "next";
import { ArrowRight, Code2, Globe, Sparkles, Zap } from "lucide-react";
import { BlogCard } from "@/components/public/BlogCard";
import { ExperienceTimeline } from "@/components/public/ExperienceTimeline";
import { HeroSection } from "@/components/public/HeroSection";
import { ProjectCard } from "@/components/public/ProjectCard";
import { TechMarquee } from "@/components/public/TechMarquee";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getSiteSettings, getProjects, getBlogPosts, getExperiences, getSkills } from "@/lib/data";
import { defaultSettings } from "@/lib/defaults";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Home",
  description: "Full-stack engineer building scalable, user-centric digital solutions. Explore projects, writing, and professional experience.",
  alternates: {
    canonical: "/"
  }
};

export default async function HomePage() {
  const [settings, projects, posts, experiences, skills] = await Promise.all([
    getSiteSettings().then(s => s || defaultSettings),
    getProjects(),
    getBlogPosts(),
    getExperiences(),
    getSkills()
  ]);
  const featured = projects.filter((project) => project.featured).slice(0, 3);

  return (
    <>
      <HeroSection settings={settings} />

      <TechMarquee skills={skills} />

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">About</p>
          <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
            Engineering with product sense.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-6 md:grid-rows-2">
          <Card className="group col-span-full flex flex-col justify-center p-8 md:col-span-4 md:row-span-2">
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Code2 size={22} />
            </div>
            <p className="text-lg leading-relaxed text-muted sm:text-xl">
              {settings.bio}
            </p>
            <div className="mt-8 flex gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-medium text-text">2+</span>
                <span className="mt-1 text-xs text-muted">Years Exp.</span>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="flex flex-col">
                <span className="text-2xl font-medium text-text">{projects.length}+</span>
                <span className="mt-1 text-xs text-muted">Projects</span>
              </div>
            </div>
          </Card>

          <Card className="group col-span-full flex flex-col items-start p-6 md:col-span-2">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles size={18} />
            </div>
            <h3 className="font-medium">Product Focused</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">Building solutions that solve real-world problems, not just writing code.</p>
          </Card>

          <Card className="group col-span-full flex flex-col items-start p-6 md:col-span-2">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Globe size={18} />
            </div>
            <h3 className="font-medium">Global Standards</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">Clean code, high performance, and accessible designs are priorities.</p>
          </Card>
        </div>
      </section>

      <section id="featured-projects" className="border-y border-border bg-surface/50 py-24 dark:bg-surface/20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">Portfolio</p>
              <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">Selected Builds</h2>
            </div>
            <Button href="/projects" variant="ghost" icon={<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}>
              View All
            </Button>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary">Experience</p>
            <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">Work Journey</h2>
            <p className="mt-6 text-base leading-relaxed text-muted">
              A timeline of professional growth, key roles, and the impact made at various organizations.
            </p>
            <div className="mt-8">
              <Button href="/experience" size="lg" variant="secondary" icon={<Zap size={16} />}>Full Resume</Button>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <ExperienceTimeline experiences={experiences.slice(0, 3)} />
          </div>
        </div>
      </section>

      <section className="border-y border-border py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">Blog</p>
              <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">Latest Writing</h2>
            </div>
            <Button href="/blog" variant="ghost" icon={<ArrowRight size={16} />}>
              Read All
            </Button>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => <BlogCard key={post.id} post={post} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
          Have a project in mind?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          I&apos;m currently available for freelance work and new opportunities. Let&apos;s build something amazing together.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/contact" size="lg">Get In Touch</Button>
          <Button href={`mailto:${settings.email}`} size="lg" variant="secondary">Send Email</Button>
        </div>
      </section>
    </>
  );
}
