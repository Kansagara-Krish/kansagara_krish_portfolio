"use client";

import { motion } from "framer-motion";
import { FileText, Code2, Mail } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/animations";
import type { SiteSettingsDTO } from "@/lib/types";

const fallbackImage = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&h=900&fit=crop";

function splitHeroTitle(title: string | null) {
  const words = title?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (words.length <= 1) {
    return { leading: "", highlighted: words[0] ?? "" };
  }

  if (words.length === 2) {
    return { leading: words[0], highlighted: words[1] };
  }

  return {
    leading: words.slice(0, -2).join(" "),
    highlighted: words.slice(-2).join(" "),
  };
}

export function HeroSection({ settings }: { settings: SiteSettingsDTO }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const heroTitle = splitHeroTitle(settings.heroTitle);

  useEffect(() => {
    const defaultRoles = settings.heroTagline ? [settings.heroTagline] : [""];
    const rolesFromSettings = settings.heroRoles
      ? settings.heroRoles.split(",").map((r) => r.trim()).filter(Boolean)
      : [];
    const rolesToCycle = rolesFromSettings.length > 0 ? rolesFromSettings : defaultRoles;
    const role = rolesToCycle[roleIndex % rolesToCycle.length];
    if (text.length < role.length) {
      const timeout = window.setTimeout(() => setText(role.slice(0, text.length + 1)), 70);
      return () => window.clearTimeout(timeout);
    }
    const timeout = window.setTimeout(() => {
      setText("");
      setRoleIndex((current) => current + 1);
    }, 2000);
    return () => window.clearTimeout(timeout);
  }, [roleIndex, text, settings.heroTagline, settings.heroRoles]);

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden px-6 pt-12 lg:pt-16">
      {/* Background Layer: Clean & Minimal */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(var(--primary-rgb),0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="grid items-center gap-16 lg:grid-cols-12">
          {/* Left Side: Content Architecture */}
          <div className="lg:col-span-7">
            <motion.div variants={fadeInUp} className="mb-6 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  {settings.openToWork ? "Looking for work" : "Taking new projects"}
                </span>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tighter text-text sm:text-7xl lg:text-8xl">
                {heroTitle.leading ? <>{heroTitle.leading} <br /></> : null}
                <span className="text-gradient">{heroTitle.highlighted}</span>
              </h1>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
            >
              {settings.heroBio || ""}
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8">
              <div className="inline-flex h-10 items-center gap-3 rounded-xl border border-border/30 bg-surface/20 px-4 backdrop-blur-md">
                <Code2 size={16} className="text-primary/60" />
                <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-text/80">{text}</span>
                <span className="h-4 w-[1px] animate-pulse bg-primary/50" />
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-10 flex items-center gap-4">
              {settings.resumeUrl && (
                <div className="flex items-center gap-3">
                  <Button href={settings.resumeUrl} variant="secondary" size="lg" className="h-14 rounded-full border-border/50 bg-surface/30 px-8 text-base font-bold backdrop-blur-md" icon={<FileText size={18} />}>
                    Get my resume
                  </Button>

                  <div className="flex items-center gap-2">
                    <a
                      href="https://www.linkedin.com/in/krish-kansagara-6093352b4/?skipRedirect=true"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="group h-12 w-12 flex items-center justify-center rounded-full border border-border/30 bg-surface/20 text-text transition-all duration-300 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                    >
                      <Linkedin size={18} className="transition-transform duration-500 ease-in-out group-hover:-rotate-12 group-hover:scale-110" />
                    </a>

                    <a
                      href="https://github.com/Kansagara-Krish"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      className="group h-12 w-12 flex items-center justify-center rounded-full border border-border/30 bg-surface/20 text-text transition-all duration-300 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                    >
                      <Github size={18} className="transition-transform duration-500 ease-in-out group-hover:-rotate-12 group-hover:scale-110" />
                    </a>

                    <a
                      href="mailto:kansagara.krish2006@gmail.com"
                      aria-label="Email"
                      className="group h-12 w-12 flex items-center justify-center rounded-full border border-border/30 bg-surface/20 text-text transition-all duration-300 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                    >
                      <Mail size={18} className="transition-transform duration-500 ease-in-out group-hover:-rotate-12 group-hover:scale-110" />
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Side: Large Clean Circular Visual */}
          <div className="relative lg:col-span-5">
            <motion.div
              variants={scaleIn}
              className="relative mx-auto flex h-[400px] w-[400px] items-center justify-center sm:h-[500px] sm:w-[500px] lg:h-[550px] lg:w-[550px]"
            >
              {/* Perfect Circular Portrait */}
              <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-border bg-surface shadow-2xl">
                <Image
                  src={settings.avatarUrl || fallbackImage}
                  alt={settings.name}
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                  sizes="(min-width: 1024px) 600px, 100vw"
                  priority
                />
                
                {/* Subtle Visual Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg/20 via-transparent to-transparent" />
              </div>
              
              {/* Subtle Depth Shadow */}
              <div className="absolute -inset-4 -z-10 rounded-full bg-primary/5 blur-3xl opacity-50" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Background Gradient Bottom */}
      <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-bg to-transparent" />
    </section>
  );
}
