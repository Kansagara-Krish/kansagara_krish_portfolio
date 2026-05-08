import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import type { SiteSettingsDTO } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettingsDTO }) {
  const links = [
    settings.github ? { href: settings.github, label: "GitHub", icon: Github } : null,
    settings.linkedin ? { href: settings.linkedin, label: "LinkedIn", icon: Linkedin } : null,
    settings.twitter ? { href: settings.twitter, label: "Twitter", icon: Twitter } : null,
    { href: `mailto:${settings.email}`, label: "Email", icon: Mail }
  ].filter((item): item is { href: string; label: string; icon: typeof Github } => Boolean(item));

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">© {new Date().getFullYear()} {settings.name}. Built with Next.js.</p>
        <div className="flex items-center gap-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={label} href={href} className="rounded-[6px] p-2 text-muted hover:bg-surface hover:text-text" aria-label={label}>
              <Icon size={18} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
