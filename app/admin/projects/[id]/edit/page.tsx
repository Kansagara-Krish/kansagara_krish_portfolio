import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { fetchApi } from "@/lib/server-data";
import type { ProjectDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await fetchApi<ProjectDTO | null>(`/projects/${params.id}`, null);
  if (!project) notFound();
  return <ProjectForm project={project} />;
}
