"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Loader2, Award, Calendar, ShieldCheck, ExternalLink, Search, ArrowUpRight, SlidersHorizontal, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
  credentialId?: string;
  image?: string;
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

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const res = await fetch("/api/admin/certifications");
        const json = await res.json() as { data?: Certification[] };
        setCertifications(json.data || []);
      } catch (error) {
        console.error("Error fetching certifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertifications();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/certifications/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCertifications(certifications.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error("Error deleting certification:", error);
    } finally {
      setDeleting(null);
    }
  };

  const filteredCerts = certifications.filter(c => 
    c.name.toLowerCase().includes(filter.toLowerCase()) || 
    c.issuer.toLowerCase().includes(filter.toLowerCase()) ||
    (c.credentialId && c.credentialId.toLowerCase().includes(filter.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
        <p className="mt-4 text-sm font-black uppercase tracking-widest text-muted">Validating credentials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            <Award size={12} />
            Professional Validation
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-text sm:text-6xl">Certifications</h1>
          <p className="text-lg text-muted max-w-2xl">A curated collection of your verified technical skills, industry-standard credentials, and professional achievements.</p>
        </div>
        <Link href="/admin/certifications/new">
          <button className="group flex items-center gap-3 rounded-2xl bg-primary px-8 py-5 text-sm font-black uppercase tracking-widest text-bg shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <Plus size={20} className="transition-transform group-hover:rotate-90" />
            Add Credential
          </button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search certification names, issuers, or IDs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-14 w-full rounded-2xl border border-border/50 bg-surface/30 pl-12 pr-4 text-sm font-medium text-text outline-none backdrop-blur-md transition-all focus:border-primary/50 focus:bg-surface/50 focus:ring-4 focus:ring-primary/5"
          />
        </div>
        <div className="flex h-14 items-center gap-2 rounded-2xl border border-border/50 bg-surface/30 px-4 backdrop-blur-md">
          <SlidersHorizontal size={18} className="text-muted" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted">{filteredCerts.length} Badges</span>
        </div>
      </div>

      {/* Grid Section */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 sm:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {filteredCerts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full"
            >
              <Card className="flex flex-col items-center justify-center border-dashed border-border/50 bg-surface/10 p-24 text-center backdrop-blur-sm">
                <div className="flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-primary/5 text-primary mb-6 animate-pulse">
                  <Award size={40} />
                </div>
                <h3 className="font-display text-2xl font-bold">No credentials found</h3>
                <p className="mt-2 text-muted max-w-sm mx-auto">It seems your certification list is currently empty. Start uploading your professional badges today.</p>
                <Link href="/admin/certifications/new" className="mt-8">
                  <Button className="rounded-xl px-8">Add First Badge</Button>
                </Link>
              </Card>
            </motion.div>
          ) : (
            filteredCerts.map((cert) => (
              <motion.div
                key={cert.id}
                variants={item}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="group relative h-full overflow-hidden border-border/50 bg-surface/30 p-8 backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:bg-surface/50 hover:shadow-2xl hover:shadow-primary/5">
                  <div className="flex flex-col h-full gap-8">
                    <div className="flex items-start justify-between">
                      <div className="relative">
                        <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-bg border border-border/50 text-primary shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                          <ShieldCheck size={32} />
                        </div>
                        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 shadow-lg border-2 border-surface flex items-center justify-center">
                          <CheckCircle2 size={10} className="text-white" />
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link href={`/admin/certifications/edit/${cert.id}`}>
                          <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg border border-border/50 text-muted transition-all hover:bg-primary hover:text-bg hover:border-primary active:scale-95">
                            <Pencil size={18} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(cert.id)}
                          disabled={deleting === cert.id}
                          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg border border-border/50 text-muted transition-all hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-95"
                        >
                          {deleting === cert.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 flex-1">
                      <h3 className="font-display text-2xl font-bold tracking-tight text-text group-hover:text-primary transition-colors leading-tight">
                        {cert.name}
                      </h3>
                      <p className="text-lg font-bold text-muted/80 tracking-tight">{cert.issuer}</p>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[10px] font-black uppercase tracking-widest text-muted/60">
                        <span className="flex items-center gap-2">
                          <Calendar size={14} className="text-primary/60" />
                          {new Date(cert.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </span>
                        {cert.credentialId && (
                          <span className="flex items-center gap-2 font-mono">
                            <ExternalLink size={14} className="text-primary/60" />
                            ID: {cert.credentialId}
                          </span>
                        )}
                      </div>

                      {cert.url && (
                        <div className="pt-6 border-t border-border/50">
                          <a 
                            href={cert.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group/link inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary transition-all hover:gap-3"
                          >
                            View Digital Credential
                            <ArrowUpRight size={14} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                          </a>
                        </div>
                      )}
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
