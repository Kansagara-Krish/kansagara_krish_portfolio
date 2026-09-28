import type { Metadata } from "next";
import { Mail, Sparkles, MapPin, MessageSquare, ArrowUpRight } from "lucide-react";
import { Github, Linkedin, X } from "@/components/ui/BrandIcons";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ContactForm } from "@/components/public/ContactForm";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { getSiteSettings } from "@/lib/data";
import { defaultSettings } from "@/lib/defaults";
import { Card } from "@/components/ui/Card";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for collaborations, projects, or inquiries.",
  alternates: {
    canonical: "/contact"
  }
};

export default async function ContactPage() {
  const settings = await getSiteSettings().then(s => s || defaultSettings);
  const socials = [
    settings.github ? { href: settings.github, label: "GitHub", icon: Github, color: "hover:text-[#24292e]" } : null,
    settings.linkedin ? { href: settings.linkedin, label: "LinkedIn", icon: Linkedin, color: "hover:text-[#0077b5]" } : null,
    settings.twitter ? { href: settings.twitter, label: "Twitter", icon: X, color: "hover:text-[#1da1f2]" } : null
  ].filter((item): item is { href: string; label: string; icon: typeof Github; color: string } => Boolean(item));

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg/50">
      {/* Background Decorative Elements */}
      <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:py-32">
        <ScrollReveal animation="fade-up" className="mb-16 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Contact me</p>
          <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl lg:text-7xl">
            Say <span className="text-gradient">hello.</span>
          </h1>
        </ScrollReveal>

        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:grid-rows-6">
          {/* Main Contact Form Card */}
          <StaggerItem className="lg:col-span-7 lg:row-span-6">
            <div className="relative h-full rounded-3xl border border-border/70 bg-surface/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl transition-all duration-300">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-3">
                  <MessageSquare size={13} />
                  <span>Direct Inbox</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text">
                  Send me a message
                </h2>
                <p className="mt-2 text-sm sm:text-base text-muted">
                  Have a project in mind, a question, or want to collaborate? Fill out the form below.
                </p>
              </div>
              <ContactForm email={settings.email} />
            </div>
          </StaggerItem>

          {/* Contact Details Card */}
          <StaggerItem className="lg:col-span-5 lg:row-span-2">
            <Card className="h-full flex flex-col justify-between p-7 sm:p-8 group hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 rounded-3xl bg-surface/90">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <h3 className="text-xl font-bold text-text">Email me directly</h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">For opportunities, questions, or partnerships.</p>
              </div>
              <a
                href={`mailto:${settings.email}`}
                className="mt-6 flex items-center justify-between rounded-2xl border border-border/80 bg-bg/50 px-4 py-3 text-sm sm:text-base font-semibold text-text group-hover:border-primary/50 group-hover:bg-primary/5 transition-all"
              >
                <span className="truncate">{settings.email}</span>
                <ArrowUpRight size={18} className="text-muted group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
              </a>
            </Card>
          </StaggerItem>

          {/* Social Links Card */}
          <StaggerItem className="lg:col-span-3 lg:row-span-2">
            <Card className="h-full p-7 sm:p-8 flex flex-col justify-between rounded-3xl bg-surface/90">
              <div>
                <h3 className="text-lg font-bold text-text">Socials</h3>
                <p className="mt-1 text-xs text-muted">Connect across developer profiles.</p>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {socials.map(({ href, label, icon: Icon, color }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    className={`flex h-12 sm:h-14 w-full items-center justify-center rounded-2xl border border-border/80 bg-bg/50 text-muted transition-all duration-300 hover:border-primary/40 ${color} hover:bg-surface hover:shadow-lg hover:shadow-primary/10 hover:scale-105 active:scale-95`}
                    aria-label={label}
                    title={label}
                  >
                    <Icon size={20} />
                  </Link>
                ))}
              </div>
            </Card>
          </StaggerItem>

          {/* Status/Availability Card */}
          <StaggerItem className="lg:col-span-2 lg:row-span-2">
            <Card className="h-full p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden rounded-3xl bg-surface/90 group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="relative mb-4 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface border border-border shadow-inner">
                  <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${settings.openToWork ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <Sparkles size={24} className={settings.openToWork ? 'text-emerald-500' : 'text-amber-500'} />
                </div>
                <h3 className="font-bold text-sm text-text">Work status</h3>
                <div className="mt-2.5">
                  {settings.openToWork ? (
                    <Badge variant="success" className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider">Available</Badge>
                  ) : (
                    <Badge variant="muted" className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider">Busy</Badge>
                  )}
                </div>
              </div>
            </Card>
          </StaggerItem>

          {/* Location Card */}
          <StaggerItem className="lg:col-span-5 lg:row-span-2">
            <Card className="h-full p-7 sm:p-8 flex items-center gap-5 sm:gap-6 group hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 rounded-3xl bg-surface/90">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-500">
                <MapPin size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text">Location</h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">
                  {settings.location ? `Based in ${settings.location}. Open to remote opportunities worldwide.` : "Open to remote opportunities worldwide."}
                </p>
              </div>
            </Card>
          </StaggerItem>
        </StaggerContainer>
      </section>
    </div>
  );
}
