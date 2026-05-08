import { Badge } from "@/components/ui/Badge";
import type { SkillDTO } from "@/lib/types";
import { skillDots } from "@/lib/utils";

export function SkillsCloud({ skills }: { skills: SkillDTO[] }) {
  const grouped = skills.reduce<Record<string, SkillDTO[]>>((acc, skill) => {
    acc[skill.category] = [...(acc[skill.category] ?? []), skill];
    return acc;
  }, {});

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="rounded-[8px] border border-border bg-surface p-5">
          <h3 className="font-display text-lg font-semibold">{category}</h3>
          <div className="mt-4 grid gap-3">
            {items.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between gap-3">
                <Badge variant="muted">{skill.name}</Badge>
                <span className="whitespace-nowrap text-xs tracking-normal text-primary">{skillDots(skill.level)}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
