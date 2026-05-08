import type { Metadata } from "next";
import { ExperienceTimeline } from "@/components/public/ExperienceTimeline";
import { SkillsCloud } from "@/components/public/SkillsCloud";
import { Card } from "@/components/ui/Card";
import { fetchApi } from "@/lib/server-data";
import type { ExperienceDTO, SkillDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Experience",
  description: "Professional experience and education timeline."
};

export default async function ExperiencePage() {
  const [experiences, skills] = await Promise.all([
    fetchApi<ExperienceDTO[]>("/experience", []),
    fetchApi<SkillDTO[]>("/skills", [])
  ]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Experience</p>
      <h1 className="mt-3 font-display text-4xl font-bold">Engineering roles, education, and skills</h1>
      <div className="mt-10">
        <ExperienceTimeline experiences={experiences} />
      </div>
      <div className="mt-16">
        <h2 className="font-display text-3xl font-bold">Education</h2>
        <Card className="mt-6 p-5">
          <h3 className="font-display text-xl font-semibold">B.Tech in Computer Engineering</h3>
          <p className="mt-2 text-muted">Focused on distributed systems, databases, algorithms, and human-centered software design.</p>
        </Card>
      </div>
      <div className="mt-16">
        <h2 className="mb-6 font-display text-3xl font-bold">Skills</h2>
        <SkillsCloud skills={skills} />
      </div>
    </section>
  );
}
