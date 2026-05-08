import type { Metadata } from "next";
import { Github, Linkedin, Mail, MapPin, Twitter } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/components/public/ContactForm";
import { Badge } from "@/components/ui/Badge";
import { defaultSettings } from "@/lib/defaults";
import { fetchApi } from "@/lib/server-data";
import type { SiteSettingsDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact form and social links."
};

export default async function ContactPage() {
  const settings = await fetchApi<SiteSettingsDTO>("/settings", defaultSettings);
  const socials = [
    settings.github ? { href: settings.github, label: "GitHub", icon: Github } : null,
    settings.linkedin ? { href: settings.linkedin, label: "LinkedIn", icon: Linkedin } : null,
    settings.twitter ? { href: settings.twitter, label: "Twitter", icon: Twitter } : null
  ].filter((item): item is { href: string; label: string; icon: typeof Github } => Boolean(item));

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Contact</p>
        <h1 className="mt-3 font-display text-4xl font-bold">Let&apos;s build something clear and useful.</h1>
        <p className="mt-4 leading-8 text-muted">Send a project brief, collaboration note, or engineering question. The form saves your message in the admin inbox and sends an email when Resend is configured.</p>
        <div className="mt-8 grid gap-4">
          <p className="flex items-center gap-3 text-muted"><Mail size={18} /> {settings.email}</p>
          <p className="flex items-center gap-3 text-muted"><MapPin size={18} /> India, remote-friendly</p>
          {settings.openToWork ? <Badge variant="success">Available for selected work</Badge> : <Badge variant="muted">Currently focused</Badge>}
        </div>
        <div className="mt-8 flex gap-2">
          {socials.map(({ href, label, icon: Icon }) => (
            <Link key={label} href={href} className="rounded-[6px] border border-border bg-surface p-3 text-muted hover:text-text" aria-label={label}>
              <Icon size={19} />
            </Link>
          ))}
        </div>
      </div>
      <ContactForm />
    </section>
  );
}
