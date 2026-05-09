"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface Hackathon {
  id: string;
  title: string;
  project: string;
  role?: string;
  date: string;
  location?: string;
  result?: string;
  description: string;
  createdAt: string;
}

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await fetch("/api/admin/hackathons");
        const json = await res.json() as { data?: Hackathon[] };
        setHackathons(json.data || []);
      } catch (error) {
        console.error("Error fetching hackathons:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hackathon?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/hackathons/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setHackathons(hackathons.filter((h) => h.id !== id));
      }
    } catch (error) {
      console.error("Error deleting hackathon:", error);
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
          <h1 className="font-display text-3xl font-bold">Hackathons</h1>
          <p className="mt-2 text-muted">Track hackathon participation</p>
        </div>
        <Link href="/admin/hackathons/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Hackathon
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4">
        {hackathons.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted">
              No hackathons yet. Add your first hackathon!
            </CardContent>
          </Card>
        ) : (
          hackathons.map((hackathon) => (
            <Card key={hackathon.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-semibold">{hackathon.title}</h3>
                      {hackathon.result && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                          {hackathon.result}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted">{hackathon.project}</p>
                    {hackathon.role && <p className="mt-1 text-sm text-muted">Role: {hackathon.role}</p>}
                    <p className="mt-1 text-sm text-muted">
                      Date: {new Date(hackathon.date).toLocaleDateString()}
                    </p>
                    {hackathon.location && <p className="mt-1 text-sm text-muted">{hackathon.location}</p>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">
                    Added: {new Date(hackathon.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Link href={`/admin/hackathons/edit/${hackathon.id}`}>
                      <Button size="sm" variant="outline">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(hackathon.id)}
                      disabled={deleting === hackathon.id}
                    >
                      {deleting === hackathon.id ? (
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
