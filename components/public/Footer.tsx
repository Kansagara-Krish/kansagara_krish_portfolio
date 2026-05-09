"use client";

import { ArrowUp } from "lucide-react";
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
    { href: "/blog", label: "Blog" },
    { href: "/experience", label: "Experience" },
    { href: "/contact", label: "Contact" }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="font-display text-2xl tracking-tight text-text">
              {settings.name}
            </Link>
            <p className="mt-4 max-w-sm leading-relaxed text-muted">
              Computer engineer making good digital products.
            </p>
            {socialLinks.length > 0 && (
              <div className="mt-8 flex items-center gap-4">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    className="text-muted transition-colors hover:text-text"
                    aria-label={label}
                  >
                    <Icon size={20} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted">Navigation</h3>
            <ul className="mt-6 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted transition-colors hover:text-text">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted">Contact</h3>
            <ul className="mt-6 space-y-3">
              <li>
                <Link href={`mailto:${settings.email}`} className="text-sm text-muted transition-colors hover:text-text">
                  {settings.email}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-primary transition-colors hover:text-primary-hover">
                  Get in touch
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {settings.name}. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-text"
          >
            Back to top
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
