"use client";

import { motion } from "framer-motion";
import { Download, FolderKanban } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { SiteSettingsDTO } from "@/lib/types";

const roles = ["Full-Stack Engineer", "Computer Engineer", "Product-minded Builder"];

export function HeroSection({ settings }: { settings: SiteSettingsDTO }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    const role = roles[roleIndex % roles.length];
    if (text.length < role.length) {
      const timeout = window.setTimeout(() => setText(role.slice(0, text.length + 1)), 70);
      return () => window.clearTimeout(timeout);
    }
    const timeout = window.setTimeout(() => {
      setText("");
      setRoleIndex((current) => current + 1);
    }, 1500);
    return () => window.clearTimeout(timeout);
  }, [roleIndex, text]);

  async function trackResume() {
    await fetch("/api/settings", { method: "PATCH" });
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl content-center gap-10 px-4 py-16">
      <motion.div className="max-w-3xl" variants={staggerContainer} initial="hidden" animate="visible">
        {settings.openToWork ? (
          <motion.div variants={fadeInUp}>
            <Badge variant="success">Open to Work</Badge>
          </motion.div>
        ) : null}
        <motion.h1 variants={fadeInUp} className="mt-5 font-display text-5xl font-bold leading-tight sm:text-6xl">
          Hi, I&apos;m {settings.name}
        </motion.h1>
        <motion.p variants={fadeInUp} className="mt-3 min-h-10 font-display text-2xl font-semibold text-primary sm:text-3xl">
          {text}
          <span className="animate-pulse">|</span>
        </motion.p>
        <motion.p variants={fadeInUp} className="mt-5 max-w-2xl text-lg leading-8 text-muted">
          {settings.heroTagline || settings.bio}
        </motion.p>
        <motion.div variants={fadeInUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="#featured-projects" size="lg" icon={<FolderKanban size={18} />}>
            View My Work
          </Button>
          {settings.resumeUrl ? (
            <Button href={settings.resumeUrl} size="lg" variant="secondary" icon={<Download size={18} />} onClick={trackResume}>
              Download Resume
            </Button>
          ) : null}
        </motion.div>
      </motion.div>
    </section>
  );
}
