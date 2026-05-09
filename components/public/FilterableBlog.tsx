"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { BlogCard } from "@/components/public/BlogCard";
import { Input } from "@/components/ui/Input";
import type { BlogPostDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FilterableBlog({ posts }: { posts: BlogPostDTO[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");

  const tags = useMemo(() => ["All", ...Array.from(new Set(posts.flatMap((post) => post.tags)))], [posts]);

  const visible = posts.filter((post) => {
    const matchesTag = active === "All" || post.tags.some((tag) => tag === active);
    const haystack = `${post.title} ${post.tags.join(" ")}`.toLowerCase();
    return matchesTag && haystack.includes(query.toLowerCase());
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActive(tag)}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition-all",
                active === tag
                  ? "bg-text text-bg"
                  : "bg-surface text-muted border border-border hover:border-text/30"
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-sm">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2 focus-within:border-primary transition-colors">
            <Search size={16} className="text-muted/60" />
            <Input
              className="border-0 bg-transparent px-0 py-0 focus:ring-0 placeholder:text-muted/50"
              placeholder="Search articles..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted/60 hover:text-text">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => <BlogCard key={post.id} post={post} />)}
        </div>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
          <Search size={32} className="text-muted/40" />
          <h3 className="mt-4 text-lg font-medium">No articles found</h3>
          <p className="mt-2 text-sm text-muted max-w-sm">Try adjusting your search or filters.</p>
          <button
            onClick={() => { setQuery(""); setActive("All"); }}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
