import type { Metadata } from "next";
import { MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { getEducation, getSiteSettings } from "@/lib/data";
import { defaultSettings } from "@/lib/defaults";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Education",
  description: "Academic background and educational journey.",
  alternates: {
    canonical: "/education"
  }
};

export default async function EducationPage() {
  const [educations, settings] = await Promise.all([
    getEducation(),
    getSiteSettings().then(s => s || defaultSettings),
  ]);

  return (
    <div className="relative overflow-hidden bg-bg/50">
      {/* Background Glows */}
      <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-24">
        <ScrollReveal animation="fade-up" className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Education</p>
          <h1 className="mt-6 font-display text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            Educational <span className="text-gradient">Journey</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
            {settings.educationHeroDesc || ""}
          </p>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.12} className="mt-14 space-y-8">
          {educations.map((edu) => (
            <StaggerItem key={edu.id}>
              <Card className="overflow-hidden border-border/50 bg-surface/40 backdrop-blur-md transition-all duration-500 hover:border-primary/30 hover:bg-surface/60 hover:shadow-xl">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <Calendar size={14} className="text-primary/60" />
                      {edu.startYear} — {edu.current ? "Now" : edu.endYear}
                    </span>
                    {edu.location && (
                      <span className="flex items-center gap-1.5 text-xs text-muted">
                        <MapPin size={14} className="text-primary/60" />
                        {edu.location}
                      </span>
                    )}
                    {edu.current && (
                      <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] text-white font-bold tracking-wider uppercase">Current</span>
                    )}
                  </div>

                  <h2 className="font-display text-xl tracking-tight sm:text-2xl font-bold">
                    {edu.degree}
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-primary">
                    {edu.institution}
                  </p>
                  {edu.field && (
                    <p className="mt-1 text-sm text-muted">Field: {edu.field}</p>
                  )}

                  {edu.description && (
                    <p className="mt-5 text-sm leading-relaxed text-muted">
                      {edu.description}
                    </p>
                  )}

                  {edu.gpa && (
                    <div className="mt-5 inline-flex items-center rounded-lg bg-surface border border-border px-3 py-2">
                      <span className="text-xs text-muted">GPA:</span>
                      <span className="ml-2 text-sm font-bold text-text">{edu.gpa}</span>
                    </div>
                  )}
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal animation="fade-up" delay={0.2} className="mt-12">
          <Button href="/experience" variant="secondary" size="lg">
            See my jobs & experience
          </Button>
        </ScrollReveal>
      </section>
    </div>
  );
}
