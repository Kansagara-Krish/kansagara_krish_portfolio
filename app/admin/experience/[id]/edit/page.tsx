import { notFound } from "next/navigation";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { getExperienceById } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({ params }: { params: { id: string } }) {
  const experience = await getExperienceById(params.id);
  if (!experience) notFound();
  return <ExperienceForm experience={experience} />;
}
