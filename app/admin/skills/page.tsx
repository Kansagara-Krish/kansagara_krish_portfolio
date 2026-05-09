"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
  iconUrl?: string;
  order: number;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch("/api/admin/skills");
        const json = await res.json() as { data?: Skill[] };
        setSkills(json.data || []);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSkills(skills.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
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
          <h1 className="font-display text-3xl font-bold">Skills</h1>
          <p className="mt-2 text-muted">Manage your skill set</p>
        </div>
        <Link href="/admin/skills/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4">
        {skills.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted">
              No skills yet. Add your first skill!
            </CardContent>
          </Card>
        ) : (
          skills.map((skill) => (
            <Card key={skill.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-semibold">{skill.name}</h3>
                      <span className="rounded-full bg-surface border border-border px-2 py-0.5 text-xs">
                        {skill.category}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Order: {skill.order}</span>
                  <div className="flex gap-2">
                    <Link href={`/admin/skills/edit/${skill.id}`}>
                      <Button size="sm" variant="outline">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(skill.id)}
                      disabled={deleting === skill.id}
                    >
                      {deleting === skill.id ? (
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
