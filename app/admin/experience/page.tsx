"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Loader2, Briefcase, MapPin, Calendar, Building2, Search, ArrowUpRight, SlidersHorizontal, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type { ExperienceDTO } from "@/lib/types";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<ExperienceDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch("/api/admin/experience");
        const json = await res.json() as { data?: ExperienceDTO[] };
        setExperiences(json.data || []);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/experience/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setExperiences(experiences.filter((e) => e.id !== id));
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
    } finally {
      setDeleting(null);
    }
  };

  const filteredExp = experiences.filter(e => 
    e.company.toLowerCase().includes(filter.toLowerCase()) || 
    e.role.toLowerCase().includes(filter.toLowerCase()) ||
    (e.location && e.location.toLowerCase().includes(filter.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
        <p className="mt-4 text-sm font-black uppercase tracking-widest text-muted">Tracing career timeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            <Briefcase size={12} />
            Professional Journey
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-text sm:text-6xl">Experience</h1>
          <p className="text-lg text-muted max-w-2xl">Document your evolution, from foundational roles to senior leadership milestones.</p>
        </div>
        <Link href="/admin/experience/new">
          <button className="group flex items-center gap-3 rounded-2xl bg-primary px-8 py-5 text-sm font-black uppercase tracking-widest text-bg shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <Plus size={20} className="transition-transform group-hover:rotate-90" />
            Add Position
          </button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search companies, roles, or locations..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-14 w-full rounded-2xl border border-border/50 bg-surface/30 pl-12 pr-4 text-sm font-medium text-text outline-none backdrop-blur-md transition-all focus:border-primary/50 focus:bg-surface/50 focus:ring-4 focus:ring-primary/5"
          />
        </div>
        <div className="flex h-14 items-center gap-2 rounded-2xl border border-border/50 bg-surface/30 px-4 backdrop-blur-md">
          <SlidersHorizontal size={18} className="text-muted" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted">{filteredExp.length} Entries</span>
        </div>
      </div>

      {/* Experience List */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredExp.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="flex flex-col items-center justify-center border-dashed border-border/50 bg-surface/10 p-24 text-center backdrop-blur-sm">
                <div className="flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-primary/5 text-primary mb-6 animate-pulse">
                  <Briefcase size={40} />
                </div>
                <h3 className="font-display text-2xl font-bold">No history found</h3>
                <p className="mt-2 text-muted max-w-sm mx-auto">It seems your professional timeline is currently empty. Start building your journey today.</p>
                <Link href="/admin/experience/new" className="mt-8">
                  <Button className="rounded-xl px-8">Add First Position</Button>
                </Link>
              </Card>
            </motion.div>
          ) : (
            filteredExp.map((exp) => (
              <motion.div
                key={exp.id}
                variants={item}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="group relative overflow-hidden border-border/50 bg-surface/30 p-8 backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:bg-surface/50 hover:shadow-2xl hover:shadow-primary/5">
                  <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                    {/* Company Icon Placeholder */}
                    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-[2rem] bg-bg border border-border/50 text-primary shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Building2 size={36} />
                      {exp.current && (
                        <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 shadow-lg animate-pulse border-2 border-surface" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-4 mb-2">
                        <h3 className="font-display text-2xl font-bold tracking-tight text-text group-hover:text-primary transition-colors truncate">
                          {exp.company}
                        </h3>
                        <div className="flex items-center gap-2">
                          {exp.current && (
                            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/20">
                              <Sparkles size={10} />
                              Current Role
                            </span>
                          )}
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-primary border border-primary/20">
                            {exp.type}
                          </span>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-text/80 tracking-tight group-hover:translate-x-1 transition-transform duration-300">{exp.role}</p>
                      
                      <div className="mt-6 flex flex-wrap items-center gap-6">
                        {exp.location && (
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted/60">
                            <MapPin size={14} className="text-primary/60" />
                            {exp.location}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted/60">
                          <Calendar size={14} className="text-primary/60" />
                          {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} — {exp.current ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 lg:shrink-0 lg:border-l lg:border-border/50 lg:pl-8">
                      <Link href={`/admin/experience/edit/${exp.id}`}>
                        <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg border border-border/50 text-muted transition-all hover:bg-primary hover:text-bg hover:border-primary active:scale-95">
                          <Pencil size={18} />
                        </button>
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(exp.id)}
                        disabled={deleting === exp.id}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg border border-border/50 text-muted transition-all hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-95"
                      >
                        {deleting === exp.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>

                      <div className="hidden lg:block ml-2 text-muted/20">
                        <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform group-hover:text-primary group-hover:opacity-100" />
                      </div>
                    </div>
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
