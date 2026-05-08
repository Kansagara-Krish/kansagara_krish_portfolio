import { SkillsManager } from "@/components/admin/SkillsManager";
import { fetchApi } from "@/lib/server-data";
import type { SkillDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await fetchApi<SkillDTO[]>("/skills", []);
  return (
    <div className="grid gap-5">
      <p className="text-muted">Inline edit skills, levels, categories, and display order.</p>
      <SkillsManager skills={skills} />
    </div>
  );
}
