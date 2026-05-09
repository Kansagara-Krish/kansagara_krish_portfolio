"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface Education {
  id: string;
  slug: string;
  institution: string;
  degree: string;
  field?: string;
  startYear: string;
  endYear?: string;
  current: boolean;
  description?: string;
  gpa?: string;
  location?: string;
}

export default function EditEducationPage() {
  const router = useRouter();
  const params = useParams<{ adminId: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [education, setEducation] = useState<Education | null>(null);

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

  useEffect(() => {
    if (params.adminId) {
      const fetchEducation = async () => {
        try {
          const res = await fetch(`/api/admin/education/${params.adminId}`);
          const json = await res.json() as { data?: Education };
          const data = json.data;
          if (data) {
            setEducation(data);
            setFormData({
              slug: data.slug || "",
              institution: data.institution,
              degree: data.degree,
              field: data.field || "",
              startYear: data.startYear,
              endYear: data.endYear || "",
              current: data.current,
              description: data.description || "",
              gpa: data.gpa || "",
              location: data.location || "",
              order: 0,
            });
          }
        } catch (error) {
          console.error("Error fetching education:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchEducation();
    }
  }, [params.adminId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const res = await fetch(`/api/admin/education/${params.adminId}`, {
        method: "PUT",
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
          setErrors({ general: json.error || "Failed to update education" });
        }
        return;
      }

      router.push("/admin/education");
    } catch (error) {
      console.error("Error updating education:", error);
      setErrors({ general: "Failed to update education" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!education) {
    return <div>Education entry not found</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/education" className="inline-flex items-center text-sm text-muted hover:text-text">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Education
        </Link>
      </div>

      <h1 className="font-display text-2xl tracking-tight">Edit Education</h1>
      <p className="mt-1 text-sm text-muted">Update education details</p>

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
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
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
          <Button type="submit" disabled={saving}>
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
