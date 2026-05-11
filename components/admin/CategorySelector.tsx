"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CategorySelector({ value, onChange, error }: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/skills");
        const json = await res.json();
        const existing = json.data?.map((s: { category: string }) => s.category) || [];
        const unique = Array.from(new Set(existing)) as string[];
        setCategories(unique.sort());
      } catch (_error) {
        console.error("Failed to fetch categories:");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCategories = categories.filter(c => 
    c.toLowerCase().includes(search.toLowerCase())
  );

  const showCreateOption = search && !categories.some(c => c.toLowerCase() === search.toLowerCase());

  return (
    <div className="relative space-y-2" ref={containerRef}>
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text/40 ml-1">Category *</label>
      
      <div 
        onClick={() => setOpen(!open)}
        className={cn(
          "relative h-12 w-full cursor-pointer rounded-xl border border-border/50 bg-bg/50 px-4 flex items-center justify-between transition-all hover:border-primary/50",
          open && "ring-4 ring-primary/5 border-primary/50 bg-bg",
          error && "border-red-500/50"
        )}
      >
        <span className={cn("text-sm", !value && "text-text/20 font-medium")}>
          {value || "Select or create category..."}
        </span>
        <ChevronsUpDown className="h-4 w-4 text-muted opacity-50" />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border/50 bg-surface/95 p-2 shadow-2xl backdrop-blur-xl"
          >
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                autoFocus
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-xl bg-bg/50 pl-10 pr-4 text-sm outline-none border border-border/50 focus:border-primary/50 transition-all"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="max-h-[200px] overflow-y-auto space-y-1 custom-scrollbar pr-1">
              {filteredCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    onChange(cat);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                    value === cat ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 text-text/80 hover:text-text"
                  )}
                >
                  {cat}
                  {value === cat && <Check className="h-4 w-4" />}
                </button>
              ))}

              {showCreateOption && (
                <button
                  type="button"
                  onClick={() => {
                    onChange(search);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-primary hover:bg-primary/10 transition-colors"
                >
                  <Plus size={14} strokeWidth={3} />
                  <span>Create &quot;{search}&quot;</span>
                </button>
              )}

              {filteredCategories.length === 0 && !showCreateOption && (
                <div className="py-8 text-center text-xs font-bold uppercase tracking-widest text-muted/40">
                  {loading ? "Loading..." : "No matches found"}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {error && <p className="text-[10px] font-bold uppercase tracking-wider text-red-500 ml-1">{error}</p>}
    </div>
  );
}
