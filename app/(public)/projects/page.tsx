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
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Portfolio</p>
          <h1 className="mt-6 font-display text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            Selected <span className="text-gradient">builds.</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
            A collection of {projects.length} shipped and in-progress builds. Focus on technical excellence, performance, and building products that solve problems.
          </p>
        </div>

        <div className="mt-16">
          <FilterableProjects projects={projects} />
        </div>
      </section>
    </div>
  );
}
