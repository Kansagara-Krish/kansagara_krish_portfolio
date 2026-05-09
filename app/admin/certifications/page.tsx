"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
  credentialId?: string;
  image?: string;
  createdAt: string;
}

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const res = await fetch("/api/admin/certifications");
        const json = await res.json() as { data?: Certification[] };
        setCertifications(json.data || []);
      } catch (error) {
        console.error("Error fetching certifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertifications();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/certifications/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCertifications(certifications.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error("Error deleting certification:", error);
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
          <h1 className="font-display text-3xl font-bold">Certifications</h1>
          <p className="mt-2 text-muted">Manage your certifications</p>
        </div>
        <Link href="/admin/certifications/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Certification
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4">
        {certifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted">
              No certifications yet. Add your first certification!
            </CardContent>
          </Card>
        ) : (
          certifications.map((cert) => (
            <Card key={cert.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold">{cert.name}</h3>
                    <p className="mt-1 text-sm text-muted">{cert.issuer}</p>
                    <p className="mt-1 text-sm text-muted">
                      Date: {new Date(cert.date).toLocaleDateString()}
                    </p>
                    {cert.credentialId && (
                      <p className="mt-1 text-sm text-muted">ID: {cert.credentialId}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">
                    Added: {new Date(cert.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Link href={`/admin/certifications/edit/${cert.id}`}>
                      <Button size="sm" variant="outline">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(cert.id)}
                      disabled={deleting === cert.id}
                    >
                      {deleting === cert.id ? (
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
