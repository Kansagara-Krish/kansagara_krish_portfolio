"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

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
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!skill) {
    return <div>Skill not found</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/skills" className="inline-flex items-center text-muted hover:text-text">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Skills
        </Link>
      </div>

      <h1 className="font-display text-3xl font-bold">Edit Skill</h1>
      <p className="mt-2 text-muted">Update skill details</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <h2 className="font-display text-xl font-semibold">Skill Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>
              <div>
                <Label htmlFor="iconUrl">Icon URL</Label>
                <Input
                  id="iconUrl"
                  value={formData.iconUrl}
                  onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                />
                {errors.iconUrl && <p className="mt-1 text-sm text-red-600">{errors.iconUrl}</p>}
              </div>
              <div>
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
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
          <Link href="/admin/skills">
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
