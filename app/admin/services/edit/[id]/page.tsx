"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Save, ArrowLeft, Loader2, Settings2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AIAssistant } from "@/components/admin/AIAssistant";
import { IconSelector } from "@/components/admin/IconSelector";
import { normalize } from "@/lib/ai-autofill";
import type { ServiceDTO } from "@/lib/types";

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    order: 0,
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`/api/admin/services/${resolvedParams.id}`);
        if (!res.ok) throw new Error("Failed to fetch service");
        
        const json = await res.json() as { data: ServiceDTO };
        setFormData({
          title: json.data.title,
          description: json.data.description,
          icon: json.data.icon || "",
          order: json.data.order,
        });
      } catch (error) {
        console.error("Error fetching service:", error);
        router.push("/admin/services");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [resolvedParams.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const res = await fetch(`/api/admin/services/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json() as { data?: ServiceDTO; error?: string; fields?: Record<string, string[]> };

      if (!res.ok) {
        if (json.fields) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(json.fields).forEach(([field, messages]) => {
            fieldErrors[field] = messages[0];
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: json.error || "Failed to update service" });
        }
        return;
      }

      router.push("/admin/services");
    } catch (error) {
      console.error("Error updating service:", error);
      setErrors({ general: "Failed to update service" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-50" />
        <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-muted">Loading service...</p>
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
        <div className="flex flex-col gap-4">
          <Link href="/admin/services" className="group inline-flex items-center text-xs font-black uppercase tracking-[0.3em] text-muted hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Services
          </Link>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-4xl font-bold tracking-tight text-text sm:text-5xl">Edit Service</h1>
            <p className="text-lg text-muted">Modify the details of your offering.</p>
          </div>
        </div>

        <AIAssistant<ServiceDTO>
          module="services"
          onFill={(data) => setFormData(prev => ({ ...prev, ...normalize("services", data) }))}
        />

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="overflow-hidden border-border/50 bg-surface/30 backdrop-blur-md">
            <div className="flex items-center gap-3 border-b border-border/50 bg-bg/30 px-8 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Settings2 size={18} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-text/80">Service Details</h2>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Building whole websites"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={cn(errors.title && "border-red-500/50 focus:ring-red-500/10")}
                />
                {errors.title && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  placeholder="Designing end-to-end systems with Next.js and robust APIs."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={cn(
                    "w-full min-h-[120px] rounded-2xl border bg-bg/50 p-4 text-sm font-medium text-text outline-none transition-all",
                    errors.description ? "border-red-500/50 focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10" : "border-border/50 focus:border-primary/50"
                  )}
                />
                {errors.description && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <IconSelector
                  value={formData.icon || ""}
                  onChange={(url) => setFormData({ ...formData, icon: url })}
                  label="Service Icon"
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
            <Link href="/admin/services">
              <Button variant="outline" size="lg" className="rounded-2xl px-8">Cancel</Button>
            </Link>
            <Button type="submit" disabled={saving} size="lg" className="rounded-2xl px-8 shadow-xl shadow-primary/20 min-w-[160px]">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Update Service
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
