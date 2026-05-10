"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Loader2, GraduationCap, Calendar, MapPin, Building2, Search, ArrowUpRight, SlidersHorizontal, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startYear: string;
  endYear?: string;
  current: boolean;
  location?: string;
}

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

export default function EducationPage() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await fetch("/api/admin/education");
        const json = await res.json() as { data?: Education[] };
        setEducationList(json.data || []);
      } catch (error) {
        console.error("Error fetching education:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEducation();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/education/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEducationList(educationList.filter((e) => e.id !== id));
      }
    } catch (error) {
      console.error("Error deleting education:", error);
    } finally {
      setDeleting(null);
    }
  };

  const filteredEdu = educationList.filter(e => 
    e.institution.toLowerCase().includes(filter.toLowerCase()) || 
    e.degree.toLowerCase().includes(filter.toLowerCase()) ||
    (e.field && e.field.toLowerCase().includes(filter.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
        <p className="mt-4 text-sm font-black uppercase tracking-widest text-muted">Scanning credentials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            <GraduationCap size={12} />
            Academic Records
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-text sm:text-6xl">Education</h1>
          <p className="text-lg text-muted max-w-2xl">A professional record of your academic foundation, specialized degrees, and lifelong learning journey.</p>
        </div>
        <Link href="/admin/education/new">
          <button className="group flex items-center gap-3 rounded-2xl bg-primary px-8 py-5 text-sm font-black uppercase tracking-widest text-bg shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <Plus size={20} className="transition-transform group-hover:rotate-90" />
            Add Education
          </button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search institutions, degrees, or fields..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-14 w-full rounded-2xl border border-border/50 bg-surface/30 pl-12 pr-4 text-sm font-medium text-text outline-none backdrop-blur-md transition-all focus:border-primary/50 focus:bg-surface/50 focus:ring-4 focus:ring-primary/5"
          />
        </div>
        <div className="flex h-14 items-center gap-2 rounded-2xl border border-border/50 bg-surface/30 px-4 backdrop-blur-md">
          <SlidersHorizontal size={18} className="text-muted" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted">{filteredEdu.length} Entries</span>
        </div>
      </div>

      {/* Grid Section */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredEdu.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full"
            >
              <Card className="flex flex-col items-center justify-center border-dashed border-border/50 bg-surface/10 p-24 text-center backdrop-blur-sm">
                <div className="flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-primary/5 text-primary mb-6 animate-pulse">
                  <GraduationCap size={40} />
                </div>
                <h3 className="font-display text-2xl font-bold">No education found</h3>
                <p className="mt-2 text-muted max-w-sm mx-auto">It seems your academic record is currently empty. Start building your foundation today.</p>
                <Link href="/admin/education/new" className="mt-8">
                  <Button className="rounded-xl px-8">Add Academic Entry</Button>
                </Link>
              </Card>
            </motion.div>
          ) : (
            filteredEdu.map((edu) => (
              <motion.div
                key={edu.id}
                variants={item}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="group relative overflow-hidden border-border/50 bg-surface/30 p-8 backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:bg-surface/50 hover:shadow-2xl hover:shadow-primary/5">
                  <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                    {/* Institution Icon Placeholder */}
                    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-[2rem] bg-bg border border-border/50 text-primary shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <GraduationCap size={36} />
                      {edu.current && (
                        <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-lg animate-pulse border-2 border-surface" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-4 mb-2">
                        <h3 className="font-display text-2xl font-bold tracking-tight text-text group-hover:text-primary transition-colors truncate">
                          {edu.degree}
                        </h3>
                        <div className="flex items-center gap-2">
                          {edu.current && (
                            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-primary shadow-sm">
                              <Sparkles size={10} />
                              In Progress
                            </span>
                          )}
                          <span className="rounded-full bg-surface border border-border/50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-muted">
                            Graduated {edu.endYear || "TBD"}
                          </span>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-text/80 tracking-tight group-hover:translate-x-1 transition-transform duration-300">{edu.institution}</p>
                      
                      <div className="mt-6 flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted/60">
                          <Calendar size={14} className="text-primary/60" />
                          {edu.startYear} — {edu.current ? "Present" : edu.endYear}
                        </div>
                        {edu.location && (
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted/60">
                            <MapPin size={14} className="text-primary/60" />
                            {edu.location}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted/60">
                          <Building2 size={14} className="text-primary/60" />
                          Full Time
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 lg:shrink-0 lg:border-l lg:border-border/50 lg:pl-8">
                      <Link href={`/admin/education/edit/${edu.id}`}>
                        <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg border border-border/50 text-muted transition-all hover:bg-primary hover:text-bg hover:border-primary active:scale-95 shadow-lg group/btn">
                          <Pencil size={18} className="transition-transform group-hover/btn:scale-110 group-hover/btn:rotate-12" />
                        </button>
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(edu.id)}
                        disabled={deleting === edu.id}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg border border-border/50 text-muted transition-all hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-95 shadow-lg"
                      >
                        {deleting === edu.id ? (
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
