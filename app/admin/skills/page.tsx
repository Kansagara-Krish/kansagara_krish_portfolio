"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Loader2, Zap, Code, Search, Sparkles, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Skill {
  id: string;
  name: string;
  category: string;
  iconUrl?: string;
  order: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch("/api/admin/skills");
        const json = await res.json() as { data?: Skill[] };
        setSkills(json.data || []);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSkills(skills.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
    } finally {
      setDeleting(null);
    }
  };

  const filteredSkills = skills.filter(s => 
    s.name.toLowerCase().includes(filter.toLowerCase()) || 
    s.category.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
        <p className="mt-4 text-sm font-black uppercase tracking-widest text-muted">Indexing skills...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            <Zap size={12} />
            Skill Matrix
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-text sm:text-6xl">Technical Arsenal</h1>
          <p className="text-lg text-muted max-w-2xl">Manage and categorize the technologies, frameworks, and tools that define your professional expertise.</p>
        </div>
        <Link href="/admin/skills/new">
          <Button size="lg" className="rounded-2xl px-8 py-7 text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <Plus className="mr-2 h-5 w-5" />
            Inject New Skill
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search across name or category..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-14 w-full rounded-2xl border border-border/50 bg-surface/30 pl-12 pr-4 text-sm font-medium text-text outline-none backdrop-blur-md transition-all focus:border-primary/50 focus:bg-surface/50 focus:ring-4 focus:ring-primary/5"
          />
        </div>
        <div className="flex h-14 items-center gap-2 rounded-2xl border border-border/50 bg-surface/30 px-4 backdrop-blur-md">
          <SlidersHorizontal size={18} className="text-muted" />
          <span className="text-xs font-black uppercase tracking-widest text-muted">{filteredSkills.length} Total</span>
        </div>
      </div>

      {/* Grid Section */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full"
            >
              <Card className="flex flex-col items-center justify-center border-dashed border-border/50 bg-surface/10 p-24 text-center backdrop-blur-sm">
                <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-primary/5 text-primary mb-6 animate-pulse">
                  <Zap size={40} />
                </div>
                <h3 className="font-display text-2xl font-bold">No results found</h3>
                <p className="mt-2 text-muted max-w-xs mx-auto">Try refining your search or add a fresh skill to your professional toolkit.</p>
                <Button variant="outline" className="mt-8 rounded-xl border-border/50 hover:bg-surface" onClick={() => setFilter("")}>
                  Clear Filters
                </Button>
              </Card>
            </motion.div>
          ) : (
            filteredSkills.map((skill) => (
              <motion.div
                key={skill.id}
                variants={item}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="group relative h-full overflow-hidden border-border/50 bg-surface/30 p-7 backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:bg-surface/60 hover:shadow-2xl hover:shadow-primary/5">
                  {/* Hover Decoration */}
                  <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/20" />
                  
                  <div className="flex items-start justify-between relative z-10">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[2rem] bg-bg border border-border/50 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      {skill.iconUrl ? (
                        <Image
                          src={skill.iconUrl}
                          alt={skill.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-primary">
                          <Code size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 opacity-0 -translate-y-2 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <Link href={`/admin/skills/edit/${skill.id}`}>
                        <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg border border-border/50 text-muted transition-all hover:bg-primary hover:text-bg hover:border-primary active:scale-90">
                          <Pencil size={16} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        disabled={deleting === skill.id}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg border border-border/50 text-muted transition-all hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-90"
                      >
                        {deleting === skill.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border",
                        skill.category.toLowerCase().includes("frontend") ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                        skill.category.toLowerCase().includes("backend") ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        "bg-primary/10 text-primary border-primary/20"
                      )}>
                        {skill.category}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted/40">
                        #{skill.order}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-bold tracking-tight text-text group-hover:text-primary transition-colors">{skill.name}</h3>
                  </div>

                  <div className="mt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted/60 opacity-0 transition-all duration-500 group-hover:opacity-100 relative z-10">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={12} className="text-primary" />
                      Active Skill
                    </span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
