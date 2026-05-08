import { notFound } from "next/navigation";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { fetchApi } from "@/lib/server-data";
import type { ExperienceDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({ params }: { params: { id: string } }) {
  const experiences = await fetchApi<ExperienceDTO[]>("/experience", []);
  const experience = experiences.find((item) => item.id === params.id);
  if (!experience) notFound();
  return <ExperienceForm experience={experience} />;
}
