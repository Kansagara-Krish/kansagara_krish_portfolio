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
import { FileUpload } from "@/components/ui/FileUpload";

interface Experience {
  id: string;
  company: string;
}

export default function NewExperiencePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    type: "Full-time",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    skills: "",
    logoUrl: "",
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const data = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      skills: formData.skills.split("\n").filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json() as { data?: Experience; error?: string; fields?: Record<string, string[]> };

      if (!res.ok) {
        if (json.fields) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(json.fields).forEach(([field, messages]) => {
            fieldErrors[field] = messages[0];
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: json.error || "Failed to create experience" });
        }
        return;
      }

      router.push("/admin/experience");
    } catch (error) {
      console.error("Error creating experience:", error);
      setErrors({ general: "Failed to create experience" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/experience" className="inline-flex items-center text-muted hover:text-text">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Experience
        </Link>
      </div>

      <h1 className="font-display text-3xl font-bold">New Experience</h1>
      <p className="mt-2 text-muted">Add a new work experience</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <h2 className="font-display text-xl font-semibold">Basic Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
                {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
              </div>
              <div>
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="h-10 w-full rounded-[6px] border border-border bg-bg px-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={formData.current}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="current"
                checked={formData.current}
                onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: e.target.checked ? "" : formData.endDate })}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <Label htmlFor="current">Currently working here</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-display text-xl font-semibold">Description & Skills</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
            <div>
              <Label htmlFor="skills">Skills (one per line)</Label>
              <Textarea
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-display text-xl font-semibold">Media</h2>
          </CardHeader>
          <CardContent>
            <Label>Company Logo</Label>
            <FileUpload
              value={formData.logoUrl}
              onChange={(url) => setFormData({ ...formData, logoUrl: url })}
              label="Upload company logo"
            />
            {errors.logoUrl && <p className="mt-1 text-sm text-red-600">{errors.logoUrl}</p>}
          </CardContent>
        </Card>

        {errors.general && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">
            {errors.general}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Link href="/admin/experience">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Add Experience
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
