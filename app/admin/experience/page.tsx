import { ExperienceList } from "@/components/admin/ExperienceList";
import { Button } from "@/components/ui/Button";
import { fetchApi } from "@/lib/server-data";
import type { ExperienceDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const experiences = await fetchApi<ExperienceDTO[]>("/experience", []);
  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted">{experiences.length} experience entries</p>
        <Button href="/admin/experience/new">Add Experience</Button>
      </div>
      <ExperienceList experiences={experiences} />
    </div>
  );
}
