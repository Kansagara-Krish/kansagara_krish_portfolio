"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { BlogCard } from "@/components/public/BlogCard";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import type { BlogPostDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FilterableBlog({ posts }: { posts: BlogPostDTO[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");
  const tags = useMemo(() => ["All", ...Array.from(new Set(posts.flatMap((post) => post.tags.map((tag) => tag.name))))], [posts]);
  const visible = posts.filter((post) => {
    const matchesTag = active === "All" || post.tags.some((tag) => tag.name === active);
    const haystack = `${post.title} ${post.tags.map((tag) => tag.name).join(" ")}`.toLowerCase();
    return matchesTag && haystack.includes(query.toLowerCase());
  });

  return (
    <div>
      <div className="mb-5 flex items-center gap-3 rounded-[8px] border border-border bg-surface px-3">
        <Search size={18} className="text-muted" />
        <Input className="border-0 bg-transparent focus:ring-0" placeholder="Search posts" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button key={tag} onClick={() => setActive(tag)} className={cn("rounded-[4px]", active === tag && "ring-2 ring-primary")}>
            <Badge variant={active === tag ? "default" : "muted"}>{tag}</Badge>
          </button>
        ))}
      </div>
      {visible.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => <BlogCard key={post.id} post={post} />)}
        </div>
      ) : (
        <div className="rounded-[8px] border border-border bg-surface p-10 text-center text-muted">No posts yet. Check back soon!</div>
      )}
    </div>
  );
}
