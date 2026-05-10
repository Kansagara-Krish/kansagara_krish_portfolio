import type { Metadata } from "next";
import { ArrowRight, Code2, Globe, Sparkles, Zap } from "lucide-react";
import { BlogCard } from "@/components/public/BlogCard";
import { ExperienceTimeline } from "@/components/public/ExperienceTimeline";
import { HeroSection } from "@/components/public/HeroSection";
import { ProjectCard } from "@/components/public/ProjectCard";
import { TechMarquee } from "@/components/public/TechMarquee";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getSiteSettings, getProjects, getBlogPosts, getExperiences, getSkills, getEducation, getHackathons } from "@/lib/data";
import { defaultSettings } from "@/lib/defaults";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Home",
  description: "I build websites and web apps. Explore my projects, writing, and work history.",
  alternates: {
    canonical: "/"
  }
};

export default async function HomePage() {
  const [settings, projects, posts, experiences, skills, education, hackathons] = await Promise.all([
    getSiteSettings().then(s => s || defaultSettings),
    getProjects(),
    getBlogPosts(),
    getExperiences(),
    getSkills(),
    getEducation(),
    getHackathons()
  ]);
  const featured = projects.filter((project) => project.featured).slice(0, 3);

  return (
    <>
      <HeroSection settings={settings} />

      <TechMarquee skills={skills} />

      <section className="relative mx-auto max-w-6xl px-6 py-24 overflow-hidden">
        {/* Immersive Background Glows */}
        <div className="absolute -left-20 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] opacity-50" />
        <div className="absolute -right-20 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] opacity-30" />
        
        <div className="mb-16">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-primary">Who I am</p>
          <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-6xl lg:text-7xl">
            Building things <span className="text-gradient">that work well.</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-12 md:grid-rows-3">
          {/* 1. Main Mission Module */}
          <Card className="group relative col-span-full flex flex-col justify-between overflow-hidden border-border/50 bg-surface/30 p-8 backdrop-blur-md md:col-span-8 md:row-span-2 lg:p-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner mb-10">
              <Code2 size={32} />
            </div>
            <h3 className="font-display text-2xl font-bold tracking-tight mb-6 sm:text-3xl lg:text-4xl">My Goal</h3>
            <p className="text-lg leading-relaxed text-text/80 lg:text-2xl lg:leading-snug">
              I make websites that look great and work perfectly. I focus on building fast, easy-to-use apps that can grow with your needs.
            </p>
            
            <div className="mt-12 flex flex-wrap gap-12">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted/60 mb-2">Years of work</p>
                <p className="text-3xl font-display font-black text-text">2+ Years</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted/60 mb-2">Total projects</p>
                <p className="text-3xl font-display font-black text-text">{projects.length}+ Projects</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted/60 mb-2">Hackathons</p>
                <p className="text-3xl font-display font-black text-text">{hackathons.length}+ Hackathons</p>
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
              <div className="flex items-start gap-4">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                <div>
                  <p className="font-bold text-sm">Building whole websites</p>
                  <p className="text-xs text-muted mt-1 leading-relaxed">Designing end-to-end systems with Next.js and robust APIs.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                <div>
                  <p className="font-bold text-sm">Making things fast</p>
                  <p className="text-xs text-muted mt-1 leading-relaxed">Latency reduction, asset management, and core web vitals.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                <div>
                  <p className="font-bold text-sm">AI Integration</p>
                  <p className="text-xs text-muted mt-1 leading-relaxed">Implementing LLMs and intelligent features into modern apps.</p>
                </div>
              </div>
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
                <h4 className="font-bold text-lg">{education[0].degree}</h4>
                <p className="text-xs text-muted">{education[0].institution}</p>
              </div>
            </Card>
          )}

          {/* 4. Location/Availability */}
          <Card className="group col-span-full border-border/50 bg-surface/30 p-6 backdrop-blur-md md:col-span-4 transition-all hover:bg-surface/50 flex items-center gap-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-bg/50 border border-border/50 group-hover:border-primary/20 transition-all">
              <Globe className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted/60 mb-1">Home Base</p>
              <h4 className="font-bold text-lg">Surat, India</h4>
              <p className="text-xs text-muted">Remote / On-site</p>
            </div>
          </Card>

          {/* 5. Status Module */}
          <div className="col-span-full md:col-span-4 flex items-center justify-center rounded-[2rem] border border-primary/20 bg-primary/5 p-6 backdrop-blur-sm">
             <div className="flex items-center gap-4">
               <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
               </span>
               <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Available for work</span>
             </div>
          </div>
        </div>
      </section>

      <section id="featured-projects" className="border-y border-border bg-surface/50 py-24 dark:bg-surface/20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">My Work</p>
              <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">My Projects</h2>
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
              <p className="text-xs font-medium uppercase tracking-widest text-primary">History</p>
              <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">Work History</h2>
              <p className="mt-6 text-base leading-relaxed text-muted">
                A look at where I&apos;ve worked and what I&apos;ve learned along the way.
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
              <p className="text-xs font-medium uppercase tracking-widest text-primary">Blog</p>
              <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">Recent Posts</h2>
            </div>
            <Button href="/blog" variant="ghost" icon={<ArrowRight size={16} />}>
              Read All
            </Button>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => <BlogCard key={post.id} post={post} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
          Have a project in mind?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          I&apos;m currently open for freelance work and new jobs. Let&apos;s build something great together.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/contact" size="lg">Get In Touch</Button>
          <Button href={`mailto:${settings.email}`} size="lg" variant="secondary">Send Email</Button>
        </div>
      </section>
    </>
  );
}
