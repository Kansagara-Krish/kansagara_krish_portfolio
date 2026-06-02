"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "@/components/public/ProjectCard";
import type { ProjectDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0 }
};

export function FilterableProjects({ projects }: { projects: ProjectDTO[] }) {
  const [active, setActive] = useState("All");
  const tags = useMemo(() => ["All", ...new Set(projects.flatMap((project) => project.tags))], [projects]);
  const visible = useMemo(() => active === "All" ? projects : projects.filter((project) => project.tags.includes(active)), [active, projects]);

  return (
    <div className="space-y-12">
      <div className="scrollbar-hide flex w-full gap-3 overflow-x-auto pb-4 sm:flex-wrap sm:overflow-visible">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActive(tag)}
            className={cn(
              "whitespace-nowrap rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 sm:px-6 sm:py-2.5 sm:text-xs",
              active === tag
                ? "bg-text text-bg shadow-xl shadow-text/10 scale-105"
                : "bg-surface/50 text-muted border border-border/50 hover:border-primary/30 hover:bg-surface hover:text-text"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((project, i) => (
            <motion.div key={`${project.id}-${i}`} variants={item}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {visible.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 bg-surface/30 p-12 text-center backdrop-blur-sm"
        >
          <p className="text-xl font-medium text-muted">No projects found in this category.</p>
          <button 
            onClick={() => setActive("All")} 
            className="mt-6 text-sm font-bold uppercase tracking-widest text-primary hover:underline"
          >
            View all projects
          </button>
        </motion.div>
      )}
    </div>
  );
}
