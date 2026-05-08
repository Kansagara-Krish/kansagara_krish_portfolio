import type { Metadata } from "next";
import { FilterableProjects } from "@/components/public/FilterableProjects";
import { fetchApi } from "@/lib/server-data";
import type { ProjectDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description: "A complete project gallery with tag filtering."
};

export default async function ProjectsPage() {
  const projects = await fetchApi<ProjectDTO[]>("/projects", []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Projects</p>
      <h1 className="mt-3 font-display text-4xl font-bold">{projects.length} shipped and in-progress builds</h1>
      <p className="mt-4 max-w-2xl leading-8 text-muted">Filter by domain, inspect the stack, and open the detailed write-up for each project.</p>
      <div className="mt-10">
        <FilterableProjects projects={projects} />
      </div>
    </section>
  );
}
