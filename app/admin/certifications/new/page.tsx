"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { FileUpload } from "@/components/ui/FileUpload";

interface Certification {
  id: string;
  name: string;
}

export default function NewCertificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    issuer: "",
    date: "",
    url: "",
    credentialId: "",
    image: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const data = {
      ...formData,
      date: formData.date ? new Date(formData.date).toISOString() : undefined,
    };

    try {
      const res = await fetch("/api/admin/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json() as { data?: Certification; error?: string; fields?: Record<string, string[]> };

      if (!res.ok) {
        if (json.fields) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(json.fields).forEach(([field, messages]) => {
            fieldErrors[field] = messages[0];
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: json.error || "Failed to create certification" });
        }
        return;
      }

      router.push("/admin/certifications");
    } catch (error) {
      console.error("Error creating certification:", error);
      setErrors({ general: "Failed to create certification" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/certifications" className="inline-flex items-center text-muted hover:text-text">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Certifications
        </Link>
      </div>

      <h1 className="font-display text-3xl font-bold">New Certification</h1>
      <p className="mt-2 text-muted">Add a new certification</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <h2 className="font-display text-xl font-semibold">Certification Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Certification Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="slug">Slug (optional)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  placeholder="auto-generated-from-name"
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="issuer">Issuer *</Label>
                <Input
                  id="issuer"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                />
                {errors.issuer && <p className="mt-1 text-sm text-red-600">{errors.issuer}</p>}
              </div>
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
              </div>
              <div>
                <Label htmlFor="credentialId">Credential ID</Label>
                <Input
                  id="credentialId"
                  value={formData.credentialId}
                  onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-display text-xl font-semibold">Links & Media</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="url">Certificate URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
              {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url}</p>}
            </div>
            <div>
              <Label>Certificate Image</Label>
              <FileUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Upload certificate image"
              />
              {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
            </div>
          </CardContent>
        </Card>

        {errors.general && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">
            {errors.general}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Link href="/admin/certifications">
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
                Add Certification
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
