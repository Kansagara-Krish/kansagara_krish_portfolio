"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Save, ArrowLeft, Loader2, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Skill {
  id: string;
  name: string;
  category: string;
  iconUrl?: string;
  order: number;
}

export default function EditSkillPage() {
  const router = useRouter();
  const params = useParams<{ adminId: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [skill, setSkill] = useState<Skill | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    iconUrl: "",
    order: 0,
  });

  useEffect(() => {
    if (params.adminId) {
      const fetchSkill = async () => {
        try {
          const res = await fetch(`/api/admin/skills/${params.adminId}`);
          const json = await res.json() as { data?: Skill };
          const data = json.data;

          if (data) {
            setSkill(data);
            setFormData({
              name: data.name,
              category: data.category,
              iconUrl: data.iconUrl || "",
              order: data.order,
            });
          }
        } catch (error) {
          console.error("Error fetching skill:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSkill();
    }
  }, [params.adminId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const res = await fetch(`/api/admin/skills/${params.adminId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json() as { data?: Skill; error?: string; fields?: Record<string, string[]> };

      if (!res.ok) {
        if (json.fields) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(json.fields).forEach(([field, messages]) => {
            fieldErrors[field] = messages[0];
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: json.error || "Failed to update skill" });
        }
        return;
      }

      router.push("/admin/skills");
    } catch (error) {
      console.error("Error updating skill:", error);
      setErrors({ general: "Failed to update skill" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
        <p className="mt-4 text-sm font-medium text-muted">Loading skill details...</p>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/10 text-red-500 mb-6">
          <Zap size={32} className="opacity-50" />
        </div>
        <h2 className="text-2xl font-bold">Skill not found</h2>
        <p className="mt-2 text-muted">The skill you are trying to edit does not exist.</p>
        <Link href="/admin/skills" className="mt-8">
          <Button variant="outline" className="rounded-2xl">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Skills
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link href="/admin/skills" className="group inline-flex items-center text-xs font-black uppercase tracking-[0.3em] text-muted hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Skills
          </Link>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-4xl font-bold tracking-tight text-text sm:text-5xl">Edit Skill</h1>
            <p className="text-lg text-muted">Update your technical expertise details.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
            <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap size={18} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Skill Details</h2>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Skill Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g. React"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={cn(errors.name && "border-red-500/50 focus:ring-red-500/10")}
                  />
                  {errors.name && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    placeholder="e.g. Frontend"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={cn(errors.category && "border-red-500/50 focus:ring-red-500/10")}
                  />
                  {errors.category && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.category}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="iconUrl">Icon URL (SVG or Image)</Label>
                <Input
                  id="iconUrl"
                  placeholder="https://..."
                  value={formData.iconUrl}
                  onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted/60">Higher numbers appear later.</p>
              </div>
            </div>
          </Card>

          {errors.general && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm font-bold text-red-500"
            >
              {errors.general}
            </motion.div>
          )}

          <div className="flex items-center justify-end gap-4">
            <Link href="/admin/skills">
              <Button variant="outline" size="lg" className="rounded-2xl px-8">Cancel</Button>
            </Link>
            <Button type="submit" disabled={saving} size="lg" className="rounded-2xl px-8 shadow-xl shadow-primary/20 min-w-[160px]">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
