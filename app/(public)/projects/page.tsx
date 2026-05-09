import type { Metadata } from "next";
import { FilterableProjects } from "@/components/public/FilterableProjects";
import { getProjects } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects",
  description: "A curated showcase of software projects spanning full-stack development, AI integration, and real-time systems.",
  alternates: {
    canonical: "/projects"
  }
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="relative overflow-hidden">
      {/* Background Visuals */}
      <div className="mesh-gradient absolute inset-0 opacity-10" />
      
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Portfolio</p>
          <h1 className="mt-6 font-display text-5xl font-black tracking-tight sm:text-7xl">
            Selected <span className="text-gradient">Builds.</span>
          </h1>
          <p className="mt-8 text-xl leading-relaxed text-muted/90">
            A collection of {projects.length} shipped and in-progress builds. I focus on technical excellence, performance, and building products that actually solve problems.
          </p>
        </div>

        <div className="mt-20">
          <FilterableProjects projects={projects} />
        </div>
      </section>
    </div>
  );
}
