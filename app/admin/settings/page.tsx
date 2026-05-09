"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Loader2, Save, AlertCircle, CheckCircle2 } from "lucide-react";

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
        method: "POST",
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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl tracking-tight">Site Settings</h1>
      <p className="mt-1 text-sm text-muted">Manage your personal information and site configuration</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400">
            <CheckCircle2 size={16} />
            Settings saved successfully!
          </div>
        )}

        <Card>
          <CardHeader className="pb-4">
            <h3 className="font-medium">Basic Information</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={settings.name} onChange={handleChange} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="title">Professional Title</Label>
              <Input id="title" name="title" value={settings.title} onChange={handleChange} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" value={settings.email} onChange={handleChange} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" value={settings.bio} onChange={handleChange} rows={4} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="heroTagline">Hero Tagline</Label>
              <Input id="heroTagline" name="heroTagline" value={settings.heroTagline} onChange={handleChange} placeholder="Short tagline for the hero section" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <h3 className="font-medium">Social Links</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="github">GitHub URL</Label>
              <Input id="github" name="github" value={settings.github} onChange={handleChange} placeholder="https://github.com/username" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input id="linkedin" name="linkedin" value={settings.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/username" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="twitter">Twitter URL</Label>
              <Input id="twitter" name="twitter" value={settings.twitter} onChange={handleChange} placeholder="https://twitter.com/username" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <h3 className="font-medium">Assets</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input id="avatarUrl" name="avatarUrl" value={settings.avatarUrl} onChange={handleChange} placeholder="https://example.com/avatar.jpg" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="resumeUrl">Resume URL</Label>
              <Input id="resumeUrl" name="resumeUrl" value={settings.resumeUrl} onChange={handleChange} placeholder="https://example.com/resume.pdf" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <h3 className="font-medium">Status</h3>
          </CardHeader>
          <CardContent>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.openToWork}
                onChange={(e) => setSettings({ ...settings, openToWork: e.target.checked })}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span>Open to work opportunities</span>
            </label>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
