"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startYear: string;
  endYear?: string;
  current: boolean;
  location?: string;
}

export default function EducationPage() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await fetch("/api/admin/education");
        const json = await res.json() as { data?: Education[] };
        setEducationList(json.data || []);
      } catch (error) {
        console.error("Error fetching education:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEducation();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/education/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEducationList(educationList.filter((e) => e.id !== id));
      }
    } catch (error) {
      console.error("Error deleting education:", error);
    } finally {
      setDeleting(null);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-tight">Education</h1>
          <p className="mt-1 text-sm text-muted">Manage academic background</p>
        </div>
        <Link href="/admin/education/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Education
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-3">
        {educationList.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted">
              No education entries yet. Add your first entry!
            </CardContent>
          </Card>
        ) : (
          educationList.map((edu) => (
            <Card key={edu.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{edu.degree}</h3>
                      {edu.current && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-white">Current</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-primary">{edu.institution}</p>
                    <p className="mt-1 text-xs text-muted">
                      {edu.startYear} — {edu.current ? "Present" : edu.endYear}
                      {edu.location && ` · ${edu.location}`}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <Link href={`/admin/education/edit/${edu.id}`}>
                      <button className="rounded-lg p-2 text-muted hover:bg-border/30 transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(edu.id)}
                      disabled={deleting === edu.id}
                      className="rounded-lg p-2 text-muted hover:bg-red-600/10 hover:text-red-600 transition-colors"
                    >
                      {deleting === edu.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
