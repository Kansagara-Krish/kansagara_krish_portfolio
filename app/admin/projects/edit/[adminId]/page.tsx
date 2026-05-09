"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Save, ArrowLeft, Loader2, Plus, X } from "lucide-react";
import Link from "next/link";
import { FileUpload } from "@/components/ui/FileUpload";

interface ProjectLink {
  label: string;
  url: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  subtitle?: string;
  role?: string;
  client?: string;
  category?: string;
  timeline?: string;
  year?: string;
  problem?: string;
  solution?: string;
  impact?: string;
  features: string[];
  outcomes: string[];
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  galleryImages: string[];
  tags: string[];
  featured: boolean;
  status: string;
  projectLinks: ProjectLink[];
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams<{ adminId: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [project, setProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    subtitle: "",
    role: "",
    client: "",
    category: "",
    timeline: "",
    year: "",
    problem: "",
    solution: "",
    impact: "",
    features: "",
    outcomes: "",
    techStack: "",
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
    galleryImages: "",
    tags: "",
    featured: false,
    status: "completed",
  });

  const [projectLinks, setProjectLinks] = useState<ProjectLink[]>([]);

  useEffect(() => {
    if (params.adminId) {
      const fetchProject = async () => {
        try {
          const res = await fetch(`/api/admin/projects/${params.adminId}`);
          const json = await res.json();
          const data = json.data;

          if (data) {
            setProject(data);
            setFormData({
              title: data.title,
              slug: data.slug,
              description: data.description,
              content: data.content || "",
              subtitle: data.subtitle || "",
              role: data.role || "",
              client: data.client || "",
              category: data.category || "",
              timeline: data.timeline || "",
              year: data.year || "",
              problem: data.problem || "",
              solution: data.solution || "",
              impact: data.impact || "",
              features: data.features?.join("\n") || "",
              outcomes: data.outcomes?.join("\n") || "",
              techStack: data.techStack?.join("\n") || "",
              liveUrl: data.liveUrl || "",
              githubUrl: data.githubUrl || "",
              imageUrl: data.imageUrl || "",
              galleryImages: data.galleryImages?.join("\n") || "",
              tags: data.tags?.join("\n") || "",
              featured: data.featured,
              status: data.status,
            });
            setProjectLinks(data.projectLinks || []);
          }
        } catch (error) {
          console.error("Error fetching project:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
  }, [params.adminId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const data = {
      ...formData,
      features: formData.features.split("\n").filter(Boolean),
      outcomes: formData.outcomes.split("\n").filter(Boolean),
      techStack: formData.techStack.split("\n").filter(Boolean),
      galleryImages: formData.galleryImages.split("\n").filter(Boolean),
      tags: formData.tags.split("\n").filter(Boolean),
      projectLinks,
    };

    try {
      const res = await fetch(`/api/admin/projects/${params.adminId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json() as { data?: Project; error?: string; fields?: Record<string, string[]> };

      if (!res.ok) {
        if (json.fields) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(json.fields).forEach(([field, messages]) => {
            fieldErrors[field] = messages[0];
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: json.error || "Failed to update project" });
        }
        return;
      }

      router.push("/admin/projects");
    } catch (error) {
      console.error("Error updating project:", error);
      setErrors({ general: "Failed to update project" });
    } finally {
      setSaving(false);
    }
  };

  const addProjectLink = () => {
    setProjectLinks([...projectLinks, { label: "", url: "" }]);
  };

  const removeProjectLink = (index: number) => {
    setProjectLinks(projectLinks.filter((_, i) => i !== index));
  };

  const updateProjectLink = (index: number, field: keyof ProjectLink, value: string) => {
    setProjectLinks(projectLinks.map((link, i) => (i === index ? { ...link, [field]: value } : link)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/projects" className="inline-flex items-center text-muted hover:text-text">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </div>

      <h1 className="font-display text-3xl font-bold">Edit Project</h1>
      <p className="mt-2 text-muted">Update project details</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <h2 className="font-display text-xl font-semibold">Basic Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>
              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
                {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-display text-xl font-semibold">Additional Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-display text-xl font-semibold">Problem, Solution & Impact</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="problem">Problem</Label>
              <Textarea
                id="problem"
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="solution">Solution</Label>
              <Textarea
                id="solution"
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="impact">Impact</Label>
              <Textarea
                id="impact"
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-display text-xl font-semibold">Features & Outcomes</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="outcomes">Outcomes (one per line)</Label>
              <Textarea
                id="outcomes"
                value={formData.outcomes}
                onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-display text-xl font-semibold">Tech Stack</h2>
          </CardHeader>
          <CardContent>
            <Label htmlFor="techStack">Technologies (one per line)</Label>
            <Textarea
              id="techStack"
              value={formData.techStack}
              onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
              rows={4}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-display text-xl font-semibold">Links</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="liveUrl">Live URL</Label>
                <Input
                  id="liveUrl"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                />
                {errors.liveUrl && <p className="mt-1 text-sm text-red-600">{errors.liveUrl}</p>}
              </div>
              <div>
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                />
                {errors.githubUrl && <p className="mt-1 text-sm text-red-600">{errors.githubUrl}</p>}
              </div>
            </div>
            <div>
              <Label>Project Links</Label>
              <div className="mt-2 space-y-2">
                {projectLinks.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Label"
                      value={link.label}
                      onChange={(e) => updateProjectLink(index, "label", e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => updateProjectLink(index, "url", e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" variant="danger" size="sm" onClick={() => removeProjectLink(index)}>
                      <X size={16} />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addProjectLink}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Link
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-display text-xl font-semibold">Media</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Project Image</Label>
              <FileUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                label="Upload project image"
              />
              {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>}
            </div>
            <div>
              <Label htmlFor="galleryImages">Gallery Images (one per line)</Label>
              <Textarea
                id="galleryImages"
                value={formData.galleryImages}
                onChange={(e) => setFormData({ ...formData, galleryImages: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-display text-xl font-semibold">Tags & Status</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tags">Tags (one per line)</Label>
              <Textarea
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="h-10 w-full rounded-[6px] border border-border bg-bg px-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="planned">Planned</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <Label htmlFor="featured">Featured Project</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {errors.general && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">
            {errors.general}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Link href="/admin/projects">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
