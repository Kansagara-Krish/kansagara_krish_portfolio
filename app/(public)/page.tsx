import type { Metadata } from "next";
import { ArrowRight, Code2, Globe, MapPin, Sparkles, Zap } from "lucide-react";
import { CertificationCard } from "@/components/public/CertificationCard";
import { ExperienceTimeline } from "@/components/public/ExperienceTimeline";
import { HeroSection } from "@/components/public/HeroSection";
import { ProjectCard } from "@/components/public/ProjectCard";
import { TechMarquee } from "@/components/public/TechMarquee";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { getSiteSettings, getProjects, getCertifications, getExperiences, getSkills, getEducation, getHackathons, getServices } from "@/lib/data";
import { defaultSettings } from "@/lib/defaults";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Kansagara Krish | Machine Learning Portfolio",
  description: "Static portfolio showcasing machine learning projects, writing, and experience.",
  alternates: {
    canonical: "/"
  }
};

export default async function HomePage() {
  const [settings, projects, posts, experiences, skills, education, hackathons, services] = await Promise.all([
    getSiteSettings().then(s => s || defaultSettings),
    getProjects(),
    getCertifications(),
    getExperiences(),
    getSkills(),
    getEducation(),
    getHackathons(),
    getServices()
  ]);
  const featured = projects.slice(0, 3);
  const hackathonCount = Math.max(hackathons.length, 7);

  return (
    <>
      <HeroSection settings={settings} />

      <TechMarquee skills={skills} />

      <section className="relative mx-auto max-w-6xl px-6 py-16 overflow-hidden">
        {/* Immersive Background Glows */}
        <div className="absolute -left-20 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] opacity-50" />
        <div className="absolute -right-20 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] opacity-30" />
        
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Who I am</p>
          <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-6xl lg:text-7xl">
            {settings.aboutTitle?.split(" ").slice(0, -3).join(" ")} <span className="text-gradient">{settings.aboutTitle?.split(" ").slice(-3).join(" ")}</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-12 md:grid-rows-3">
          {/* 1. Main Mission Module */}
          <Card className="group relative col-span-full flex flex-col justify-between overflow-hidden border-border/50 bg-surface/30 p-8 backdrop-blur-md md:col-span-8 md:row-span-2 lg:p-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner mb-10">
              <Code2 size={32} />
            </div>
            <h3 className="font-display text-2xl font-bold tracking-tight mb-6 sm:text-3xl lg:text-4xl">{settings.aboutGoalTitle || "My Goal"}</h3>
            <p className="text-lg leading-relaxed text-text/80 lg:text-2xl lg:leading-snug">
              {settings.aboutGoalDesc || ""}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border/50 bg-surface/50 p-6">
                <p className="text-xs font-black uppercase tracking-widest text-primary">AI & Product Delivery</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Building real-world AI and automation solutions with Python, FastAPI, and Next.js for practical product impact.
                </p>
              </div>
              <div className="rounded-3xl border border-border/50 bg-surface/50 p-6">
                <p className="text-xs font-black uppercase tracking-widest text-primary">Certificates & Competitions</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Proven participation in national and international hackathons, plus certificates across AI, web, and automation.
                </p>
              </div>
              <div className="rounded-3xl border border-border/50 bg-surface/50 p-6">
                <p className="text-xs font-black uppercase tracking-widest text-primary">Data-Driven Work</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Focused on data analysis, visualization, and model evaluation to turn insights into reliable solutions.
                </p>
              </div>
              <div className="rounded-3xl border border-border/50 bg-surface/50 p-6">
                <p className="text-xs font-black uppercase tracking-widest text-primary">Rapid Prototyping</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Experience delivering fast, polished prototypes under pressure during hackathons and internship work.
                </p>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-12">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted/60 mb-2">Years of work</p>
                <p className="text-3xl font-display font-black text-text">{settings.aboutStatsWork}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted/60 mb-2">Total projects</p>
                <p className="text-3xl font-display font-black text-text">{settings.aboutStatsProjects}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted/60 mb-2">Hackathons</p>
                <p className="text-3xl font-display font-black text-text">{hackathonCount}+ Hackathons</p>
              </div>
            </div>
          </Card>

          {/* 2. Technical Focus List */}
          <Card className="group col-span-full border-border/50 bg-surface/30 p-8 backdrop-blur-md md:col-span-4 md:row-span-2 flex flex-col">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-8">
              <Zap size={22} />
            </div>
            <h3 className="font-display text-xl font-bold mb-8">What I use</h3>
            <div className="space-y-6 flex-1">
              {services.length > 0 ? services.map(service => (
                <div key={service.id} className="flex items-start gap-4">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  <div>
                    <p className="font-bold text-sm">{service.title}</p>
                    <p className="text-xs text-muted mt-1 leading-relaxed">{service.description}</p>
                  </div>
                </div>
              )) : (
                <div className="flex items-start gap-4">
                  <p className="text-xs text-muted">No services configured.</p>
                </div>
              )}
            </div>
            <div className="mt-8 pt-6 border-t border-border/50">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Always Improving</p>
            </div>
          </Card>

          {/* 3. Education */}
          {education.length > 0 && (
            <Card className="group col-span-full border-border/50 bg-surface/30 p-6 backdrop-blur-md md:col-span-4 transition-all hover:bg-surface/50 flex items-center gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-bg/50 border border-border/50 group-hover:border-primary/20 transition-all">
                <Sparkles className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted/60 mb-1">Education</p>
                <h4 className="font-bold text-lg truncate max-w-[200px]">{education[0].degree}</h4>
                <p className="text-xs text-muted truncate max-w-[200px]">{education[0].institution}</p>
              </div>
            </Card>
          )}

          {/* 4. Location/Availability */}
          <Card className="group col-span-full border-border/50 bg-surface/30 p-6 backdrop-blur-md md:col-span-4 transition-all hover:bg-surface/50 flex items-center gap-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-bg/50 border border-border/50 group-hover:border-primary/20 transition-all">
              <Globe className="text-primary" size={24} />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted/60 mb-1">Home Base</p>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-lg">{settings.location || ""}</h4>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Mehsana+Gujarat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface border border-border/50 text-primary transition hover:bg-primary/10"
                  aria-label="Open Mehsana location on Google Maps"
                >
                  <MapPin size={18} />
                </a>
              </div>
              <p className="text-xs text-muted">Remote / On-site</p>
            </div>
          </Card>

          {/* 5. Status Module */}
          <div className="col-span-full md:col-span-4 flex items-center justify-center rounded-[2rem] border border-primary/20 bg-primary/5 p-6 backdrop-blur-sm">
             <div className="flex items-center gap-4">
               <span className="relative flex h-3 w-3">
                 {settings.openToWork && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>}
                 <span className={cn("relative inline-flex rounded-full h-3 w-3", settings.openToWork ? "bg-primary" : "bg-muted")}></span>
               </span>
               <span className={cn("text-sm font-bold uppercase tracking-[0.2em]", settings.openToWork ? "text-primary" : "text-muted")}>
                 {settings.openToWork ? "Available for work" : "Not looking for work"}
               </span>
             </div>
          </div>
        </div>
      </section>

      <section id="featured-projects" className="border-y border-border bg-surface/50 py-24 dark:bg-surface/20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">{settings.projectsSubtitle}</p>
              <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">{settings.projectsTitle}</h2>
            </div>
            <Button href="/projects" variant="ghost" icon={<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}>
              View All
            </Button>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <div className="sticky top-32">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">{settings.homeWorkSubtitle}</p>
              <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">{settings.homeWorkTitle}</h2>
              <p className="mt-6 text-base leading-relaxed text-muted">
                {settings.homeWorkDesc || ""}
              </p>
              <div className="mt-10">
                <Button href="/experience" size="lg" variant="secondary" icon={<Zap size={16} />} className="group">
                  View My Resume
                </Button>
              </div>
            </div>
          </div>
          <div className="relative">
            <ExperienceTimeline experiences={experiences.slice(0, 3)} />
          </div>
        </div>
      </section>

      <section className="border-y border-border py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">{settings.blogSubtitle}</p>
                <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">{settings.blogTitle}</h2>
            </div>
              <Button href="/blog" variant="ghost" icon={<ArrowRight size={16} />}>
                View All Certificates
              </Button>
          </div>
            <div className="grid gap-8 md:grid-cols-3">
              {posts.slice(0, 3).map((cert) => <CertificationCard key={cert.id} cert={cert} />)}
            </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
          {settings.contactCtaTitle}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {settings.contactCtaDesc}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/contact" size="lg">Get In Touch</Button>
          <Button href={`mailto:${settings.email}`} size="lg" variant="secondary">Send Email</Button>
        </div>
      </section>
    </>
  );
}
