"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string;
  type: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  createdAt: string;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch("/api/admin/experience");
      const json = await res.json() as { data?: Experience[] };
      setExperiences(json.data || []);
    } catch (error) {
      console.error("Error fetching experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/experience/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setExperiences(experiences.filter((e) => e.id !== id));
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Experience</h1>
          <p className="mt-2 text-muted">Manage your work experience</p>
        </div>
        <Link href="/admin/experience/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4">
        {experiences.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted">
              No experience entries yet. Add your first job!
            </CardContent>
          </Card>
        ) : (
          experiences.map((exp) => (
            <Card key={exp.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-semibold">{exp.company}</h3>
                      {exp.current && (
                        <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs text-white">
                          Current
                        </span>
                      )}
                      <span className="rounded-full bg-surface border border-border px-2 py-0.5 text-xs">
                        {exp.type}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{exp.role}</p>
                    {exp.location && <p className="mt-1 text-sm text-muted">{exp.location}</p>}
                    <p className="mt-1 text-sm text-muted">
                      {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">
                    Added: {new Date(exp.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Link href={`/admin/experience/edit/${exp.id}`}>
                      <Button size="sm" variant="outline">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(exp.id)}
                      disabled={deleting === exp.id}
                    >
                      {deleting === exp.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
