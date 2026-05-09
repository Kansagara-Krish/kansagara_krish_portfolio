import Image from "next/image";
import type { SkillDTO } from "@/lib/types";

const deviconMap: Record<string, string> = {
  "REST APIs": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg",
  "LangChain": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
};

function getSkillIcon(skill: SkillDTO): string | null {
  if (skill.iconUrl) return skill.iconUrl;
  return deviconMap[skill.name] ?? null;
}

export function SkillsCloud({ skills }: { skills: SkillDTO[] }) {
  const grouped = skills.reduce<Record<string, SkillDTO[]>>((acc, skill) => {
    acc[skill.category] = [...(acc[skill.category] ?? []), skill];
    return acc;
  }, {});

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="text-xs font-medium uppercase tracking-widest text-primary">
            {category}
          </h3>

          <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {items.map((skill) => {
              const iconUrl = getSkillIcon(skill);
              return (
                <div
                  key={skill.id}
                  className="group flex items-center gap-3 rounded-xl border border-border/50 bg-bg p-3 transition-all hover:border-border hover:shadow-sm"
                >
                  {iconUrl ? (
                    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface p-1.5">
                      <Image
                        src={iconUrl}
                        alt={skill.name}
                        fill
                        className="object-contain p-1.5 transition-transform group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-display text-sm text-primary">
                      {skill.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-muted transition-colors group-hover:text-text">
                    {skill.name}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
