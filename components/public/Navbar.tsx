"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" }
];

export function Navbar({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "dark";
    const rootTheme = document.documentElement.dataset.theme;
    if (rootTheme === "light" || rootTheme === "dark") return rootTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
    setTheme(next);
  }

  return (
    <header className="fixed top-0 z-50 w-full">
      <div
        className={cn(
          "mx-auto max-w-7xl px-6 transition-all duration-500",
          scrolled ? "py-4" : "py-6"
        )}
      >
        <nav
          className={cn(
            "flex items-center justify-between transition-all duration-500",
            scrolled
              ? "rounded-full border border-border bg-surface/80 px-6 py-3 shadow-sm backdrop-blur-xl"
              : "bg-transparent py-2"
          )}
        >
          <Link href="/" className="flex items-center gap-2.5">
            <span className="font-display text-xl tracking-tight text-text">
              {name.split(" ")[0] || "Portfolio"}
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm transition-colors",
                    isActive
                      ? "text-text"
                      : "text-muted hover:text-text"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-px bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-border/50 hover:text-text"
              aria-label="Toggle color theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 20, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </motion.span>
              </AnimatePresence>
            </button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-border/50 hover:text-text md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-bg p-6 md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl tracking-tight">{name}</span>
              <button
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:text-text"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-16 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-lg transition-colors",
                    pathname === link.href
                      ? "bg-surface font-medium text-text"
                      : "text-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-auto border-t border-border pt-8">
              <p className="text-sm text-muted">Open to collaborations</p>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="mt-2 block text-lg font-medium text-primary"
              >
                Get in touch
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
