"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Loader2, Trophy, MapPin, Calendar, Award, Search, ArrowUpRight, SlidersHorizontal, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Hackathon {
  id: string;
  title: string;
  project: string;
  role?: string;
  date: string;
  location?: string;
  result?: string;
  description: string;
  createdAt: string;
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

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await fetch("/api/admin/hackathons");
        const json = await res.json() as { data?: Hackathon[] };
        setHackathons(json.data || []);
      } catch (error) {
        console.error("Error fetching hackathons:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hackathon?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/hackathons/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setHackathons(hackathons.filter((h) => h.id !== id));
      }
    } catch (error) {
      console.error("Error deleting hackathon:", error);
    } finally {
      setDeleting(null);
    }
  };

  const filteredHackathons = hackathons.filter(h => 
    h.title.toLowerCase().includes(filter.toLowerCase()) || 
    h.project.toLowerCase().includes(filter.toLowerCase()) ||
    (h.result && h.result.toLowerCase().includes(filter.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
        <p className="mt-4 text-sm font-black uppercase tracking-widest text-muted">Retrieving achievements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            <Trophy size={12} />
            Competitive Arena
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-text sm:text-6xl">Hackathons</h1>
          <p className="text-lg text-muted max-w-2xl">A gallery of your competitive coding triumphs, innovation marathons, and collaborative engineering feats.</p>
        </div>
        <Link href="/admin/hackathons/new">
          <button className="group flex items-center gap-3 rounded-2xl bg-primary px-8 py-5 text-sm font-black uppercase tracking-widest text-bg shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <Plus size={20} className="transition-transform group-hover:rotate-90" />
            Add Achievement
          </button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search by title, project name, or result..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-14 w-full rounded-2xl border border-border/50 bg-surface/30 pl-12 pr-4 text-sm font-medium text-text outline-none backdrop-blur-md transition-all focus:border-primary/50 focus:bg-surface/50 focus:ring-4 focus:ring-primary/5"
          />
        </div>
        <div className="flex h-14 items-center gap-2 rounded-2xl border border-border/50 bg-surface/30 px-4 backdrop-blur-md">
          <SlidersHorizontal size={18} className="text-muted" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted">{filteredHackathons.length} Entries</span>
        </div>
      </div>

      {/* Grid Section */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredHackathons.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full"
            >
              <Card className="flex flex-col items-center justify-center border-dashed border-border/50 bg-surface/10 p-24 text-center backdrop-blur-sm">
                <div className="flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-primary/5 text-primary mb-6 animate-pulse">
                  <Trophy size={40} />
                </div>
                <h3 className="font-display text-2xl font-bold">No achievements found</h3>
                <p className="mt-2 text-muted max-w-sm mx-auto">It seems your competitive record is currently blank. Time to join a hackathon and show off your skills!</p>
                <Link href="/admin/hackathons/new" className="mt-8">
                  <Button className="rounded-xl px-8">Add First Track</Button>
                </Link>
              </Card>
            </motion.div>
          ) : (
            filteredHackathons.map((hackathon) => (
              <motion.div
                key={hackathon.id}
                variants={item}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="group relative overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:bg-surface/50 hover:shadow-2xl hover:shadow-primary/5">
                  <div className="p-8 sm:p-10 relative z-10">
                    <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1 space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-8">
                          <div className="relative">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[2rem] bg-bg border border-border/50 text-primary shadow-inner transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                              <Trophy size={36} />
                            </div>
                            {hackathon.result && (
                              <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-bg shadow-lg border-2 border-surface">
                                <Award size={16} />
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-4">
                              <h3 className="font-display text-3xl font-bold tracking-tight text-text group-hover:text-primary transition-colors">
                                {hackathon.title}
                              </h3>
                              {hackathon.result && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-emerald-500 shadow-sm">
                                  <Sparkles size={12} />
                                  {hackathon.result}
                                </span>
                              )}
                            </div>
                            <p className="text-xl font-bold text-muted/80 tracking-tight">{hackathon.project}</p>
                          </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          <div className="flex items-center gap-4 rounded-2xl bg-bg/50 border border-border/30 p-4 transition-colors group-hover:bg-bg/80">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary border border-primary/10">
                              <Calendar size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted/60">Timeline</p>
                              <p className="text-sm font-bold text-text truncate">{new Date(hackathon.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                            </div>
                          </div>
                          {hackathon.location && (
                            <div className="flex items-center gap-4 rounded-2xl bg-bg/50 border border-border/30 p-4 transition-colors group-hover:bg-bg/80">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary border border-primary/10">
                                <MapPin size={18} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted/60">Venue</p>
                                <p className="text-sm font-bold text-text truncate">{hackathon.location}</p>
                              </div>
                            </div>
                          )}
                          {hackathon.role && (
                            <div className="flex items-center gap-4 rounded-2xl bg-bg/50 border border-border/30 p-4 transition-colors group-hover:bg-bg/80">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary border border-primary/10">
                                <Plus size={18} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted/60">Responsibility</p>
                                <p className="text-sm font-bold text-text truncate">{hackathon.role}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="rounded-[2rem] bg-bg/40 border border-border/50 p-8 relative overflow-hidden group/desc">
                          <div className="absolute right-6 top-6 text-muted/10 transition-colors group-hover/desc:text-primary/10">
                            <Trophy size={48} />
                          </div>
                          <p className="text-base leading-relaxed text-muted max-w-3xl">
                            {hackathon.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:shrink-0 lg:flex-col lg:border-l lg:border-border/50 lg:pl-10">
                        <Link href={`/admin/hackathons/edit/${hackathon.id}`} className="flex-1 sm:flex-none">
                          <button className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bg border border-border/50 text-muted transition-all hover:bg-primary hover:text-bg hover:border-primary active:scale-95 shadow-lg group/btn">
                            <Pencil size={20} className="transition-transform group-hover/btn:scale-110 group-hover/btn:rotate-12" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(hackathon.id)}
                          disabled={deleting === hackathon.id}
                          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bg border border-border/50 text-muted transition-all hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-95 shadow-lg"
                        >
                          {deleting === hackathon.id ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                          ) : (
                            <Trash2 size={20} />
                          )}
                        </button>
                        <div className="hidden lg:block mt-2 text-muted/20">
                          <ArrowUpRight size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform group-hover:text-primary group-hover:opacity-100" />
                        </div>
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
