"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlogCard } from "@/components/public/BlogCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { BlogPostDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function FilterableBlog({ posts }: { posts: BlogPostDTO[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");

  const tags = useMemo(() => ["All", ...Array.from(new Set(posts.flatMap((post) => post.tags)))], [posts]);

  const visible = useMemo(() => posts.filter((post) => {
    const matchesTag = active === "All" || post.tags.some((tag) => tag === active);
    const haystack = `${post.title} ${post.tags.join(" ")}`.toLowerCase();
    return matchesTag && haystack.includes(query.toLowerCase());
  }), [posts, active, query]);

  const handleClearFilters = useCallback(() => {
    setQuery("");
    setActive("All");
  }, []);

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActive(tag)}
              className={cn(
                "rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300",
                active === tag
                  ? "bg-text text-bg shadow-lg shadow-text/10"
                  : "bg-surface/50 text-muted border border-border/50 hover:border-primary/30 hover:bg-surface hover:text-text"
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-sm">
          <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-surface/50 px-5 py-3 backdrop-blur-md focus-within:border-primary/50 focus-within:bg-surface transition-all duration-300">
            <Search size={18} className="text-muted/40" />
            <Input
              className="border-0 bg-transparent px-0 py-0 text-sm focus:ring-0 placeholder:text-muted/30"
              placeholder="Search technical articles..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted/40 hover:text-primary transition-colors">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {visible.length > 0 ? (
          <motion.div 
            key={active + query}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((post) => (
              <motion.div key={post.id} variants={item}>
                <BlogCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 bg-surface/30 p-12 text-center backdrop-blur-sm"
          >
            <div className="mb-6 rounded-full bg-primary/5 p-6 text-primary/30">
              <Search size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-semibold tracking-tight">No articles found</h3>
            <p className="mt-3 text-muted max-w-xs mx-auto leading-relaxed">We couldn&apos;t find any articles matching your current search or filters.</p>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="mt-8 rounded-xl px-8"
            >
              Clear all filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
