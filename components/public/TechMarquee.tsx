"use client";

import { motion } from "framer-motion";
import type { SkillDTO } from "@/lib/types";

export function TechMarquee({ skills }: { skills: SkillDTO[] }) {
  const duplicatedSkills = [...skills, ...skills, ...skills, ...skills];

  return (
    <div className="relative flex w-full overflow-hidden border-y border-border py-5">
      <div className="absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-bg to-transparent" />

      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 35, ease: "linear" } }}
      >
        {duplicatedSkills.map((skill, index) => (
          <div
            key={`${skill.id}-${index}`}
            className="flex items-center gap-2.5 text-sm font-medium tracking-tight text-muted/50"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
            {skill.name}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
