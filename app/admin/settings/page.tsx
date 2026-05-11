"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { 
  Save, 
  Loader2, 
  Sparkles, 
  Globe, 
  User, 
  Layout, 
  ShieldCheck, 
  Mail,
  MapPin,
  Briefcase,
  FileText,
  Search
} from "lucide-react";
import { Github, Linkedin, X as XIcon } from "@/components/ui/BrandIcons";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SiteSettingsDTO } from "@/lib/types";
import { ImageUpload } from "@/components/admin/ImageUpload";

const tabs = [
  { id: "hero", label: "Hero Section", icon: Layout },
  { id: "about", label: "About Me", icon: User },
  { id: "pages", label: "Page Content", icon: FileText },
  { id: "seo", label: "SEO & Meta", icon: Search },
  { id: "social", label: "Social & Footer", icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SiteSettingsDTO>({
    id: "singleton",
    name: "",
    email: "",
    location: "",
    heroTitle: "",
    heroTagline: "",
    heroBio: "",
    avatarUrl: "",
    resumeUrl: "",
    aboutTitle: "",
    aboutGoalTitle: "",
    aboutGoalDesc: "",
    yearsOfExperience: "",
    aboutStatsWork: "",
    aboutStatsProjects: "",
    aboutStatsCommitment: "",
    projectsTitle: "",
    projectsSubtitle: "",
    projectsDesc: "",
    homeWorkTitle: "",
    homeWorkSubtitle: "",
    homeBlogTitle: "",
    homeBlogSubtitle: "",
    contactCtaTitle: "",
    contactCtaDesc: "",
    github: "",
    linkedin: "",
    twitter: "",
    footerTitle: "",
    footerBio: "",
    openToWork: true,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    ogImage: "",
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const json = await res.json();
        if (json.success && json.data) {
          setFormData(json.data);
        }
      } catch (_err) {
        console.error("Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Settings updated successfully!");
      }
    } catch (_err) {
      alert("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
        <p className="mt-8 text-xs font-black uppercase tracking-[0.4em] text-muted">Loading Configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary w-fit">
          <ShieldCheck size={12} />
          Global Configuration
        </div>
        <h1 className="font-display text-5xl font-bold tracking-tight text-text sm:text-6xl text-gradient">Site Settings</h1>
        <p className="text-lg text-muted max-w-2xl leading-relaxed">Customize your portfolio&apos;s identity, hero content, and professional links in one place.</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Tabs */}
        <div className="flex flex-col gap-2 lg:w-64 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 text-left",
                  isActive 
                    ? "bg-primary text-bg shadow-xl shadow-primary/20 scale-105" 
                    : "text-muted hover:text-text hover:bg-surface/50"
                )}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-8">
          <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
            <div className="p-8">
              <AnimatePresence mode="wait">
                {activeTab === "hero" && (
                  <motion.div
                    key="hero"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input 
                          value={formData.name || ""}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hero Tagline</Label>
                        <Input 
                          value={formData.heroTagline || ""}
                          onChange={(e) => setFormData({ ...formData, heroTagline: e.target.value })}
                          placeholder="e.g. FULL-STACK ENGINEER"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Hero Main Heading</Label>
                      <Input 
                        value={formData.heroTitle || ""}
                        onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                        placeholder="e.g. Engineering Great Websites."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Hero Bio</Label>
                      <textarea
                        value={formData.heroBio || ""}
                        onChange={(e) => setFormData({ ...formData, heroBio: e.target.value })}
                        placeholder="A short, impactful introduction..."
                        className="w-full min-h-[120px] rounded-2xl border border-border/50 bg-bg/50 p-4 text-sm font-medium text-text outline-none focus:border-primary/50 transition-all"
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <ImageUpload
                        value={formData.avatarUrl || ""}
                        onChange={(val) => setFormData({ ...formData, avatarUrl: val })}
                        label="Profile Avatar Image"
                      />
                      <div className="space-y-2">
                        <Label>Resume Link (URL)</Label>
                        <Input 
                          value={formData.resumeUrl || ""}
                          onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                          placeholder="Link to your PDF resume"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "about" && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>About Heading</Label>
                        <Input 
                          value={formData.aboutTitle || ""}
                          onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                          placeholder="e.g. Building things that work well."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Years of Experience</Label>
                        <Input 
                          value={formData.yearsOfExperience || ""}
                          onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                          placeholder="e.g. 2+"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Goal Title</Label>
                      <Input 
                        value={formData.aboutGoalTitle || ""}
                        onChange={(e) => setFormData({ ...formData, aboutGoalTitle: e.target.value })}
                        placeholder="e.g. My Goal"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Goal Description</Label>
                      <textarea
                        value={formData.aboutGoalDesc || ""}
                        onChange={(e) => setFormData({ ...formData, aboutGoalDesc: e.target.value })}
                        placeholder="Describe your professional mission..."
                        className="w-full min-h-[120px] rounded-2xl border border-border/50 bg-bg/50 p-4 text-sm font-medium text-text outline-none focus:border-primary/50 transition-all"
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Stats Work</Label>
                        <Input 
                          value={formData.aboutStatsWork || ""}
                          onChange={(e) => setFormData({ ...formData, aboutStatsWork: e.target.value })}
                          placeholder="e.g. 2+"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Stats Projects</Label>
                        <Input 
                          value={formData.aboutStatsProjects || ""}
                          onChange={(e) => setFormData({ ...formData, aboutStatsProjects: e.target.value })}
                          placeholder="e.g. 15+"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Stats Commitment</Label>
                        <Input 
                          value={formData.aboutStatsCommitment || ""}
                          onChange={(e) => setFormData({ ...formData, aboutStatsCommitment: e.target.value })}
                          placeholder="e.g. 100%"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-6 p-6 rounded-2xl bg-primary/5 border border-primary/20">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-bg">
                        <Briefcase size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-text">Availability Status</p>
                        <p className="text-xs text-muted">Show a &quot;Looking for work&quot; badge on your hero section.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, openToWork: !formData.openToWork })}
                        className={cn(
                          "relative h-7 w-12 rounded-full transition-colors",
                          formData.openToWork ? "bg-primary" : "bg-muted"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 h-5 w-5 rounded-full bg-white transition-all",
                          formData.openToWork ? "right-1" : "left-1"
                        )} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === "pages" && (
                  <motion.div
                    key="pages"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Home Work Title</Label>
                        <Input 
                          value={formData.homeWorkTitle || ""}
                          onChange={(e) => setFormData({ ...formData, homeWorkTitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Home Work Subtitle</Label>
                        <Input 
                          value={formData.homeWorkSubtitle || ""}
                          onChange={(e) => setFormData({ ...formData, homeWorkSubtitle: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Home Blog Title</Label>
                        <Input 
                          value={formData.homeBlogTitle || ""}
                          onChange={(e) => setFormData({ ...formData, homeBlogTitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Home Blog Subtitle</Label>
                        <Input 
                          value={formData.homeBlogSubtitle || ""}
                          onChange={(e) => setFormData({ ...formData, homeBlogSubtitle: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-border/50">
                      <h3 className="text-sm font-black uppercase tracking-widest text-text/80">Projects Page</h3>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Projects Title</Label>
                          <Input 
                            value={formData.projectsTitle || ""}
                            onChange={(e) => setFormData({ ...formData, projectsTitle: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Projects Subtitle</Label>
                          <Input 
                            value={formData.projectsSubtitle || ""}
                            onChange={(e) => setFormData({ ...formData, projectsSubtitle: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Projects Description</Label>
                        <textarea
                          value={formData.projectsDesc || ""}
                          onChange={(e) => setFormData({ ...formData, projectsDesc: e.target.value })}
                          className="w-full min-h-[80px] rounded-2xl border border-border/50 bg-bg/50 p-4 text-sm font-medium text-text outline-none focus:border-primary/50 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-border/50">
                      <h3 className="text-sm font-black uppercase tracking-widest text-text/80">Contact CTA</h3>
                      <div className="space-y-2">
                        <Label>Contact CTA Title</Label>
                        <Input 
                          value={formData.contactCtaTitle || ""}
                          onChange={(e) => setFormData({ ...formData, contactCtaTitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact CTA Description</Label>
                        <textarea
                          value={formData.contactCtaDesc || ""}
                          onChange={(e) => setFormData({ ...formData, contactCtaDesc: e.target.value })}
                          className="w-full min-h-[80px] rounded-2xl border border-border/50 bg-bg/50 p-4 text-sm font-medium text-text outline-none focus:border-primary/50 transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "social" && (
                  <motion.div
                    key="social"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Mail size={14} className="text-muted" />
                          <Label>Professional Email</Label>
                        </div>
                        <Input 
                          value={formData.email || ""}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="hello@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin size={14} className="text-muted" />
                          <Label>Location</Label>
                        </div>
                        <Input 
                          value={formData.location || ""}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="e.g. Surat, India"
                        />
                      </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-border/50">
                      <h3 className="text-sm font-black uppercase tracking-widest text-text/80">Social Matrix</h3>
                      
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-1">
                            <Github size={14} className="text-muted" />
                            <Label>GitHub URL</Label>
                          </div>
                          <Input 
                            value={formData.github || ""}
                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                            placeholder="https://github.com/..."
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-1">
                            <Linkedin size={14} className="text-muted" />
                            <Label>LinkedIn URL</Label>
                          </div>
                          <Input 
                            value={formData.linkedin || ""}
                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                            placeholder="https://linkedin.com/in/..."
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-1">
                            <XIcon size={14} className="text-muted" />
                            <Label>Twitter (X) URL</Label>
                          </div>
                          <Input 
                            value={formData.twitter || ""}
                            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                            placeholder="https://twitter.com/..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-border/50">
                      <h3 className="text-sm font-black uppercase tracking-widest text-text/80">Footer Configuration</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Footer Title</Label>
                          <Input 
                            value={formData.footerTitle || ""}
                            onChange={(e) => setFormData({ ...formData, footerTitle: e.target.value })}
                            placeholder="e.g. Ready to bring your ideas to life?"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Footer Description</Label>
                          <textarea
                            value={formData.footerBio || ""}
                            onChange={(e) => setFormData({ ...formData, footerBio: e.target.value })}
                            placeholder="A short description for the footer..."
                            className="w-full min-h-[100px] rounded-2xl border border-border/50 bg-bg/50 p-4 text-sm font-medium text-text outline-none focus:border-primary/50 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "seo" && (
                  <motion.div
                    key="seo"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-6">
                      <h3 className="text-sm font-black uppercase tracking-widest text-text/80">Global SEO Settings</h3>
                      
                      <div className="space-y-2">
                        <Label>Meta Title</Label>
                        <Input 
                          value={formData.seoTitle || ""}
                          onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                          placeholder="e.g. Pratham Rajbhar | Full-Stack Engineer"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Meta Description</Label>
                        <textarea
                          value={formData.seoDescription || ""}
                          onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                          placeholder="Short, keyword-rich description for search engines..."
                          className="w-full min-h-[100px] rounded-2xl border border-border/50 bg-bg/50 p-4 text-sm font-medium text-text outline-none focus:border-primary/50 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Keywords (Comma separated)</Label>
                        <Input 
                          value={formData.seoKeywords || ""}
                          onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                          placeholder="e.g. React, Next.js, Portfolio, Engineer"
                        />
                      </div>

                      <div className="space-y-2 pt-4">
                        <ImageUpload
                          value={formData.ogImage || ""}
                          onChange={(val) => setFormData({ ...formData, ogImage: val })}
                          label="Default Open Graph Image (for social sharing)"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between border-t border-border/50 bg-bg/30 px-8 py-6">
              <div className="flex items-center gap-3 text-xs font-bold text-muted">
                <Sparkles size={16} className="text-primary animate-pulse" />
                Changes auto-save only on Inject
              </div>
              <Button 
                type="submit" 
                disabled={saving} 
                size="lg" 
                className="rounded-2xl px-10 shadow-xl shadow-primary/20 min-w-[180px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Inject Settings
                  </>
                )}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
