"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Palette } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const colorThemes = [
  { name: "Amber", light: "#b45309", dark: "#fbbf24" },
  { name: "Blue", light: "#2563eb", dark: "#3b82f6" },
  { name: "Purple", light: "#7c3aed", dark: "#8b5cf6" },
  { name: "Green", light: "#059669", dark: "#10b981" },
  { name: "Red", light: "#dc2626", dark: "#ef4444" },
  { name: "Pink", light: "#db2777", dark: "#ec4899" },
  { name: "Orange", light: "#ea580c", dark: "#f97316" },
  { name: "Teal", light: "#0d9488", dark: "#14b8a6" },
];

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export function ThemeColorPicker() {
  const [open, setOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(() => {
    if (typeof window === "undefined") return "Amber";
    const saved = localStorage.getItem("colorTheme");
    return saved || "Amber";
  });

  useEffect(() => {
    const theme = colorThemes.find((t) => t.name === selectedTheme);
    if (theme) {
      document.documentElement.style.setProperty("--color-primary-val", theme.light);
      document.documentElement.style.setProperty("--color-primary-hover-val", adjustColor(theme.light, -20));
      
      if (document.documentElement.dataset.theme === "dark") {
        document.documentElement.style.setProperty("--color-primary-val", theme.dark);
        document.documentElement.style.setProperty("--color-primary-hover-val", adjustColor(theme.dark, -20));
      }
    }
  }, [selectedTheme]);

  useEffect(() => {
    const handleThemeChange = () => {
      const theme = colorThemes.find((t) => t.name === selectedTheme);
      if (theme) {
        const isDark = document.documentElement.dataset.theme === "dark";
        document.documentElement.style.setProperty("--color-primary-val", isDark ? theme.dark : theme.light);
        document.documentElement.style.setProperty("--color-primary-hover-val", adjustColor(isDark ? theme.dark : theme.light, -20));
      }
    };

    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    
    return () => observer.disconnect();
  }, [selectedTheme]);

  function handleColorSelect(themeName: string) {
    setSelectedTheme(themeName);
    localStorage.setItem("colorTheme", themeName);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-border/50 hover:text-text"
        aria-label="Change color theme"
      >
        <Palette size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-50 w-48 rounded-xl border border-border bg-surface p-3 shadow-lg"
          >
            <p className="mb-3 px-2 text-xs font-medium text-muted">Color Theme</p>
            <div className="grid grid-cols-4 gap-2">
              {colorThemes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => handleColorSelect(theme.name)}
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110",
                    selectedTheme === theme.name && "ring-2 ring-offset-2 ring-offset-surface ring-primary"
                  )}
                  style={{
                    backgroundColor: document.documentElement.dataset.theme === "dark" ? theme.dark : theme.light,
                  }}
                  title={theme.name}
                >
                  {selectedTheme === theme.name && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-2 w-2 rounded-full bg-white"
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
