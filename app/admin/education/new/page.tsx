"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface Education {
  id: string;
  degree: string;
}

export default function NewEducationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    slug: "",
    institution: "",
    degree: "",
    field: "",
    startYear: "",
    endYear: "",
    current: false,
    description: "",
    gpa: "",
    location: "",
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/admin/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json() as { data?: Education; error?: string; fields?: Record<string, string[]> };

      if (!res.ok) {
        if (json.fields) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(json.fields).forEach(([field, messages]) => {
            fieldErrors[field] = messages[0];
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: json.error || "Failed to create education entry" });
        }
        return;
      }

      router.push("/admin/education");
    } catch (error) {
      console.error("Error creating education:", error);
      setErrors({ general: "Failed to create education entry" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/education" className="inline-flex items-center text-sm text-muted hover:text-text">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Education
        </Link>
      </div>

      <h1 className="font-display text-2xl tracking-tight">New Education</h1>
      <p className="mt-1 text-sm text-muted">Add a new education entry</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Card>
          <CardHeader className="pb-4">
            <h3 className="font-medium">Basic Information</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="degree">Degree *</Label>
                <Input id="degree" value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} />
                {errors.degree && <p className="text-xs text-red-600">{errors.degree}</p>}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="institution">Institution *</Label>
                <Input id="institution" value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} />
                {errors.institution && <p className="text-xs text-red-600">{errors.institution}</p>}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="field">Field of Study</Label>
                <Input id="field" value={formData.field} onChange={(e) => setFormData({ ...formData, field: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="slug">Slug (optional)</Label>
                <Input id="slug" value={formData.slug} placeholder="auto-generated" onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="startYear">Start Year *</Label>
                <Input id="startYear" value={formData.startYear} onChange={(e) => setFormData({ ...formData, startYear: e.target.value })} />
                {errors.startYear && <p className="text-xs text-red-600">{errors.startYear}</p>}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="endYear">End Year</Label>
                <Input id="endYear" value={formData.endYear} onChange={(e) => setFormData({ ...formData, endYear: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="gpa">GPA</Label>
                <Input id="gpa" value={formData.gpa} onChange={(e) => setFormData({ ...formData, gpa: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.current} onChange={(e) => setFormData({ ...formData, current: e.target.checked })} className="h-4 w-4 rounded border-border" />
              Currently studying
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <h3 className="font-medium">Description</h3>
          </CardHeader>
          <CardContent>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} />
          </CardContent>
        </Card>

        {errors.general && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{errors.general}</div>}

        <div className="flex justify-end gap-3">
          <Link href="/admin/education"><Button variant="outline">Cancel</Button></Link>
          <Button type="submit" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : <><Save className="mr-2 h-4 w-4" /> Add Education</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
