"use client";

import { ArrowUp, Mail } from "lucide-react";
import { Github, Linkedin, X } from "@/components/ui/BrandIcons";
import Link from "next/link";
import type { SiteSettingsDTO } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettingsDTO }) {
  const socialLinks = [
    settings.github ? { href: settings.github, label: "GitHub", icon: Github } : null,
    settings.linkedin ? { href: settings.linkedin, label: "LinkedIn", icon: Linkedin } : null,
    settings.twitter ? { href: settings.twitter, label: "Twitter", icon: X } : null,
  ].filter((item): item is { href: string; label: string; icon: typeof Github } => Boolean(item));

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Certificates" },
    { href: "/experience", label: "Experience" },
    { href: "/contact", label: "Contact" }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-border/50 bg-bg pt-20 pb-12 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top Section: CTA */}
        <div className="mb-16 flex flex-col items-start justify-between gap-8 border-b border-border/50 pb-16 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {settings.footerTitle?.split(" ").slice(0, -3).join(" ")} <br className="hidden sm:block" />
              <span className="text-gradient">{settings.footerTitle?.split(" ").slice(-3).join(" ")}</span>
            </h2>
          </div>
          <div className="flex shrink-0">
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-primary px-7 py-3.5 text-sm sm:text-base font-bold text-bg shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-primary/30 active:scale-95"
            >
              <span className="relative z-10">Let&apos;s talk</span>
              <ArrowUp className="relative z-10 rotate-45 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={18} />
              <div className="absolute inset-0 z-0 bg-gradient-to-tr from-primary via-primary to-primary-hover opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          </div>
        </div>

        {/* Middle Section: Navigation & Info */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-bg shadow-md shadow-primary/10">
                 <span className="font-display text-sm font-black uppercase">{settings.name?.[0]}</span>
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                {settings.name}
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm sm:text-base leading-relaxed text-muted">
              {settings.footerBio}
            </p>
            <div className="mt-8 flex items-center gap-2">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-all duration-300 hover:bg-surface hover:text-primary hover:scale-110"
                  aria-label={label}
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Explore</p>
            <ul className="mt-6 space-y-3.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-base font-medium text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Contact</p>
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted/70">Email me at</p>
              <Link 
                href={`mailto:${settings.email}`} 
                className="inline-flex items-center gap-2 text-sm sm:text-base lg:text-lg font-bold text-text break-all transition-colors hover:text-primary underline decoration-primary/30 decoration-2 underline-offset-4 hover:decoration-primary"
              >
                <span>{settings.email}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-xs sm:text-sm text-muted">
            &copy; {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:text-text"
            >
              Back to top 
              <ArrowUp size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
