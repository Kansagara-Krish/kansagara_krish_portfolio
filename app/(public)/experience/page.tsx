import type { Metadata } from "next";
import { Sparkles, GraduationCap, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ExperienceTimeline } from "@/components/public/ExperienceTimeline";
import { SkillsCloud } from "@/components/public/SkillsCloud";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getExperiences, getSkills, getHackathons, getCertifications } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Experience",
  description: "Professional experience, education, and technical skills overview.",
  alternates: {
    canonical: "/experience"
  }
};

export default async function ExperiencePage() {
  const [experiences, skills, hackathons, certifications] = await Promise.all([
    getExperiences(),
    getSkills(),
    getHackathons(),
    getCertifications()
  ]);

  return (
    <div className="relative overflow-hidden">
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Resume</p>
          <h1 className="mt-6 font-display text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            Professional <span className="text-gradient">trajectory.</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
            A chronicle of engineering roles, academic background, and the technical arsenal built over the years.
          </p>
        </div>

        <div className="mt-20 grid gap-16 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="mb-8 flex items-center gap-3 font-display text-2xl tracking-tight">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles size={16} />
              </span>
              Work Experience
            </h2>
            <ExperienceTimeline experiences={experiences} />
          </div>

          <div className="space-y-14">
            <div>
              <h2 className="mb-8 flex items-center gap-3 font-display text-2xl tracking-tight">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <GraduationCap size={16} />
                </span>
                Education
              </h2>
              <Link href="/education" className="block">
                <Card className="group relative overflow-hidden p-6 transition-all hover:shadow-md hover:border-text/20">
                  <h3 className="font-display text-lg tracking-tight">B.Tech in Computer Engineering</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Specialized in distributed systems, high-performance computing, and human-centered design.
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-primary">2020 — 2024</span>
                    <span className="text-xs text-muted group-hover:text-text transition-colors">View Details →</span>
                  </div>
                </Card>
              </Link>
            </div>

            <div>
              <h2 className="mb-8 flex items-center gap-3 font-display text-2xl tracking-tight">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles size={16} />
                </span>
                Top Skills
              </h2>
              <div className="grid gap-3">
                {skills.slice(0, 6).map((skill) => (
                  <div key={skill.id} className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-text/20">
                    {skill.iconUrl ? (
                      <div className="relative h-5 w-5 flex-shrink-0">
                        <Image src={skill.iconUrl} alt={skill.name} fill className="object-contain" />
                      </div>
                    ) : (
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-[9px] font-bold text-primary">
                        {skill.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex flex-1 items-center justify-between">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-[10px] text-muted">{skill.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <h2 className="mb-10 font-display text-2xl tracking-tight sm:text-3xl">My Skills</h2>
          <SkillsCloud skills={skills} />
        </div>

        {hackathons.length > 0 && (
          <div className="mt-24">
            <div className="mb-10">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">Competitions</p>
              <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">Hackathons</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hackathons.map((hackathon) => (
                <Link key={hackathon.id} href={`/hackathons/${hackathon.slug}`} className="block">
                  <Card className="group h-full overflow-hidden transition-all hover:shadow-md hover:border-text/20">
                    {hackathon.image && (
                      <div className="relative h-44 w-full overflow-hidden">
                        <Image
                          src={hackathon.image}
                          alt={hackathon.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <h3 className="font-display text-lg tracking-tight">{hackathon.title}</h3>
                        {hackathon.result && (
                          <Badge variant="default" className="shrink-0">{hackathon.result}</Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-primary">{hackathon.project}</p>
                      {hackathon.role && (
                        <p className="mt-1 text-xs text-muted">Role: {hackathon.role}</p>
                      )}
                      <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-3">{hackathon.description}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                        <span className="text-xs text-muted">
                          {new Date(hackathon.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </span>
                        <span className="text-xs text-muted group-hover:text-text transition-colors">View Details →</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div className="mt-24">
            <div className="mb-10">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">Credentials</p>
              <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">Certifications</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert) => (
                <Link key={cert.id} href={`/certifications/${cert.slug}`} className="block">
                  <Card className="group h-full overflow-hidden transition-all hover:shadow-md hover:border-text/20">
                    {cert.image && (
                      <div className="relative h-44 w-full overflow-hidden">
                        <Image
                          src={cert.image}
                          alt={cert.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="mb-3 flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Award size={18} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-lg tracking-tight">{cert.name}</h3>
                          <p className="text-sm font-medium text-primary">{cert.issuer}</p>
                        </div>
                      </div>
                      {cert.credentialId && (
                        <p className="text-xs text-muted">ID: {cert.credentialId}</p>
                      )}
                      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                        <span className="text-xs text-muted">
                          {new Date(cert.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </span>
                        <span className="text-xs text-muted group-hover:text-text transition-colors">View Details →</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

