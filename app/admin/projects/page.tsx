import { ProjectTable } from "@/components/admin/ProjectTable";
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/server-data";
import type { ProjectDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await fetchApi<ProjectDTO[]>("/projects", []);
  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted">{projects.length} projects</p>
        <Button href="/admin/projects/new">New Project</Button>
      </div>
      <ProjectTable projects={projects} />
    </div>
  );
}
