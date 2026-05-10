"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Loader2, Save, AlertCircle, CheckCircle2, User, Share2, Image as ImageIcon, Settings2, Globe, Monitor, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SiteSettings {
  name: string;
  title: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  avatarUrl: string;
  resumeUrl: string;
  heroTagline: string;
  openToWork: boolean;
}

const defaultForm: SiteSettings = {
  name: "",
  title: "",
  bio: "",
  email: "",
  github: "",
  linkedin: "",
  twitter: "",
  avatarUrl: "",
  resumeUrl: "",
  heroTagline: "",
  openToWork: false,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const json = await res.json();
        if (json.data) {
          setSettings(json.data);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to save settings");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
        <p className="mt-4 text-sm font-black uppercase tracking-widest text-muted">Configuring console...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            <Settings2 size={12} />
            System Control
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-text sm:text-6xl">Settings</h1>
          <p className="text-lg text-muted max-w-2xl">Refine your digital identity, update global metadata, and manage the core configuration of your portfolio platform.</p>
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="hidden md:flex items-center gap-2 text-sm font-bold text-emerald-500"
              >
                <CheckCircle2 size={18} />
                Changes Applied
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={handleSubmit} 
            disabled={saving} 
            className="group flex items-center gap-3 rounded-2xl bg-primary px-8 py-5 text-sm font-black uppercase tracking-widest text-bg shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save size={20} className="transition-transform group-hover:-translate-y-0.5" />
                Publish Changes
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-10">
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm font-bold text-red-500 backdrop-blur-md">
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Identity Section */}
          <Card className="border-border/50 bg-surface/30 p-10 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 text-muted/5 transition-colors group-hover:text-primary/5">
              <User size={120} />
            </div>
            <div className="relative z-10">
              <div className="mb-10 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight">Personal Identity</h3>
                  <p className="text-sm text-muted">How you are presented across the site.</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted/60">Display Name</Label>
                    <Input id="name" name="name" value={settings.name} onChange={handleChange} required className="h-14 rounded-2xl border-border/50 bg-bg/40 px-6 font-bold text-text focus:bg-bg focus:ring-4 focus:ring-primary/5 transition-all" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-muted/60">Professional Title</Label>
                    <Input id="title" name="title" value={settings.title} onChange={handleChange} required className="h-14 rounded-2xl border-border/50 bg-bg/40 px-6 font-bold text-text focus:bg-bg focus:ring-4 focus:ring-primary/5 transition-all" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted/60">Public Email Address</Label>
                  <Input id="email" name="email" type="email" value={settings.email} onChange={handleChange} required className="h-14 rounded-2xl border-border/50 bg-bg/40 px-6 font-bold text-text focus:bg-bg focus:ring-4 focus:ring-primary/5 transition-all" />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="bio" className="text-[10px] font-black uppercase tracking-widest text-muted/60">Narrative Biography</Label>
                  <Textarea id="bio" name="bio" value={settings.bio} onChange={handleChange} rows={5} required className="rounded-3xl border-border/50 bg-bg/40 p-6 font-medium leading-relaxed text-text focus:bg-bg focus:ring-4 focus:ring-primary/5 transition-all" />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="heroTagline" className="text-[10px] font-black uppercase tracking-widest text-muted/60">Global Hero Tagline</Label>
                  <Input id="heroTagline" name="heroTagline" value={settings.heroTagline} onChange={handleChange} placeholder="Innovating at the intersection of..." className="h-14 rounded-2xl border-border/50 bg-bg/40 px-6 font-bold text-text focus:bg-bg focus:ring-4 focus:ring-primary/5 transition-all" />
                </div>
              </div>
            </div>
          </Card>

          {/* Social Presence */}
          <Card className="border-border/50 bg-surface/30 p-10 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 text-muted/5 transition-colors group-hover:text-primary/5">
              <Globe size={120} />
            </div>
            <div className="relative z-10">
              <div className="mb-10 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                  <Share2 size={24} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight">Social Presence</h3>
                  <p className="text-sm text-muted">Connect your external professional profiles.</p>
                </div>
              </div>
              
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="github" className="text-[10px] font-black uppercase tracking-widest text-muted/60">GitHub URL</Label>
                  <Input id="github" name="github" value={settings.github} onChange={handleChange} placeholder="https://github.com/..." className="h-14 rounded-2xl border-border/50 bg-bg/40 px-6 font-bold text-text focus:bg-bg focus:ring-4 focus:ring-primary/5 transition-all" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="linkedin" className="text-[10px] font-black uppercase tracking-widest text-muted/60">LinkedIn URL</Label>
                  <Input id="linkedin" name="linkedin" value={settings.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="h-14 rounded-2xl border-border/50 bg-bg/40 px-6 font-bold text-text focus:bg-bg focus:ring-4 focus:ring-primary/5 transition-all" />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="twitter" className="text-[10px] font-black uppercase tracking-widest text-muted/60">X (Twitter) URL</Label>
                  <Input id="twitter" name="twitter" value={settings.twitter} onChange={handleChange} placeholder="https://twitter.com/..." className="h-14 rounded-2xl border-border/50 bg-bg/40 px-6 font-bold text-text focus:bg-bg focus:ring-4 focus:ring-primary/5 transition-all" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-10">
          {/* Media Assets */}
          <Card className="border-border/50 bg-surface/30 p-8 backdrop-blur-md relative overflow-hidden group">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <ImageIcon size={24} />
              </div>
              <h3 className="font-display text-xl font-bold tracking-tight">Media Assets</h3>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="avatarUrl" className="text-[10px] font-black uppercase tracking-widest text-muted/60">Profile Photo URL</Label>
                <Input id="avatarUrl" name="avatarUrl" value={settings.avatarUrl} onChange={handleChange} className="h-12 rounded-xl border-border/50 bg-bg/40 px-4 font-bold text-text focus:bg-bg transition-all" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="resumeUrl" className="text-[10px] font-black uppercase tracking-widest text-muted/60">Resume / CV URL</Label>
                <Input id="resumeUrl" name="resumeUrl" value={settings.resumeUrl} onChange={handleChange} className="h-12 rounded-xl border-border/50 bg-bg/40 px-4 font-bold text-text focus:bg-bg transition-all" />
              </div>
              {settings.avatarUrl && (
                <div className="relative h-32 w-32 mx-auto rounded-full overflow-hidden border-4 border-surface shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={settings.avatarUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </Card>

          {/* Status Section */}
          <Card className="border-border/50 bg-surface/30 p-8 backdrop-blur-md relative overflow-hidden group">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-display text-xl font-bold tracking-tight">Availability</h3>
            </div>
            
            <label className="group relative flex cursor-pointer items-center justify-between gap-4 rounded-[2rem] border border-border/50 bg-bg/40 p-8 transition-all hover:border-primary/30 hover:bg-primary/5">
              <div className="space-y-1">
                <span className="block text-sm font-black uppercase tracking-widest text-text">Open to Work</span>
                <span className="block text-xs text-muted">Show hiring status on profile</span>
              </div>
              <div className="relative flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full bg-muted/20 transition-colors group-hover:bg-muted/30 has-[:checked]:bg-emerald-500 shadow-inner">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={settings.openToWork}
                  onChange={(e) => setSettings({ ...settings, openToWork: e.target.checked })}
                />
                <div className="absolute left-1.5 h-5 w-5 rounded-full bg-white shadow-lg transition-all peer-checked:left-7" />
              </div>
            </label>
          </Card>

          {/* Platform Info */}
          <Card className="border-border/50 bg-surface/10 p-8 backdrop-blur-md border-dashed">
            <div className="flex items-center gap-4 mb-4 text-muted/60">
              <Monitor size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">System Info</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted/40">
                <span>Core Version</span>
                <span>v2.4.0-premium</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted/40">
                <span>Last Deployment</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted/40">
                <span>Database Status</span>
                <span className="text-emerald-500 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Synchronized
                </span>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
