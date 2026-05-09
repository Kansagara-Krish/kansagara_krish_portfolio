"use client";

import { motion } from "framer-motion";
import { ArrowDown, FileText } from "lucide-react";
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
    }, 2000);
    return () => window.clearTimeout(timeout);
  }, [roleIndex, text]);

  return (
    <section className="relative flex min-h-screen items-center px-6 pt-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/[0.02] blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl">
          {settings.openToWork ? (
            <motion.div variants={fadeInUp} className="mb-8">
              <Badge variant="success" className="px-4 py-1.5 text-xs font-medium tracking-wide">
                Available for new opportunities
              </Badge>
            </motion.div>
          ) : null}

          <motion.p
            variants={fadeInUp}
            className="mb-6 text-sm font-medium uppercase tracking-widest text-muted"
          >
            {settings.title}
          </motion.p>

          <motion.h1
            variants={fadeInUp}
            className="font-display text-5xl leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Hi, I&apos;m <span className="text-primary">{settings.name}</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-8 min-h-[1.5em] font-display text-xl text-muted sm:text-2xl lg:text-3xl"
          >
            I build <span className="text-gradient">{text}</span>
            <span className="ml-1 inline-block h-6 w-px animate-pulse bg-primary align-middle lg:h-8" />
          </motion.p>

          <motion.p
            variants={fadeInUp}
            className="mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {settings.heroTagline || settings.bio}
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
            <Button
              href="#featured-projects"
              size="lg"
              className="px-8"
            >
              View Projects
            </Button>
            {settings.resumeUrl ? (
              <Button
                href={settings.resumeUrl}
                size="lg"
                variant="secondary"
                className="px-8"
                icon={<FileText size={18} />}
              >
                Resume
              </Button>
            ) : null}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted"
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
