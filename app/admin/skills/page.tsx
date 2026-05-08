import { SkillsManager } from "@/components/admin/SkillsManager";
import { getSkills } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await getSkills();
  return (
    <div className="grid gap-5">
      <p className="text-muted">Inline edit skills, levels, categories, and display order.</p>
      <SkillsManager skills={skills} />
    </div>
  );
}
