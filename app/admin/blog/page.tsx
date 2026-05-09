"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
  tags: string[];
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/admin/blog");
        const json = await res.json() as { data?: BlogPost[] };
        setPosts(json.data || []);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
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
          <h1 className="font-display text-2xl tracking-tight">Blog Posts</h1>
          <p className="mt-1 text-sm text-muted">Write and manage blog articles</p>
        </div>
        <Link href="/admin/blog/new">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-3">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted">
              No blog posts yet. Write your first post!
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{post.title}</h3>
                      {post.published ? (
                        <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] text-white">
                          Published
                        </span>
                      ) : (
                        <span className="rounded-full bg-surface border border-border px-2 py-0.5 text-[10px] text-muted">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted">{post.excerpt}</p>
                    {post.tags.length > 0 && (
                      <div className="mt-2 flex gap-1.5 flex-wrap">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-surface border border-border px-2 py-0.5 text-[10px] text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Link href={`/admin/blog/edit/${post.id}`}>
                      <Button size="sm" variant="outline">
                        <Pencil className="mr-2 h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(post.id)}
                      disabled={deleting === post.id}
                    >
                      {deleting === post.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
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
