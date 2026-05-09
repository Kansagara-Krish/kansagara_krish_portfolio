import type { Metadata } from "next";
import { Mail, Sparkles } from "lucide-react";
import { Github, Linkedin, X } from "@/components/ui/BrandIcons";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ContactForm } from "@/components/public/ContactForm";
import { getSiteSettings } from "@/lib/data";
import { defaultSettings } from "@/lib/defaults";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact me to talk about projects, jobs, or working together.",
  alternates: {
    canonical: "/contact"
  }
};

export default async function ContactPage() {
  const settings = await getSiteSettings().then(s => s || defaultSettings);
  const socials = [
    settings.github ? { href: settings.github, label: "GitHub", icon: Github } : null,
    settings.linkedin ? { href: settings.linkedin, label: "LinkedIn", icon: Linkedin } : null,
    settings.twitter ? { href: settings.twitter, label: "Twitter", icon: X } : null
  ].filter((item): item is { href: string; label: string; icon: typeof Github } => Boolean(item));

  return (
    <div className="relative overflow-hidden">
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary">Get in touch</p>
            <h1 className="mt-6 font-display text-4xl tracking-tight sm:text-5xl lg:text-6xl">
              Let&apos;s build <span className="text-gradient">something.</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
              I&apos;m always open to talking about new projects, ideas, or working together on your vision.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-5 rounded-xl border border-border bg-surface p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted">Email</p>
                  <p className="mt-0.5 text-sm font-medium">{settings.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-5 rounded-xl border border-border bg-surface p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted">Status</p>
                  <div className="mt-1">
                    {settings.openToWork ? (
                      <Badge variant="success">Available</Badge>
                    ) : (
                      <Badge variant="muted">Focused</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {socials.length > 0 && (
              <div className="mt-10">
                <p className="text-xs text-muted">Social</p>
                <div className="mt-4 flex gap-3">
                  {socials.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={label}
                      href={href}
                      target="_blank"
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-text/30 hover:text-text"
                      aria-label={label}
                    >
                      <Icon size={18} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
