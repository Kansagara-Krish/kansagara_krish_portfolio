"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

function titleFromPath(pathname: string) {
  if (pathname === "/admin") return "Dashboard";
  return pathname
    .replace("/admin/", "")
    .split("/")
    .filter(Boolean)
    .map((part) => part.replace(/-/g, " "))
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" / ");
}

export function AdminHeader({ email, onMenu }: { email: string; onMenu: () => void }) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-bg/90 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <Button className="md:hidden" size="icon" variant="ghost" onClick={onMenu} aria-label="Open sidebar">
          <Menu size={20} />
        </Button>
        <h1 className="font-display text-xl font-semibold">{titleFromPath(pathname)}</h1>
      </div>
      <div className="hidden items-center gap-3 sm:flex">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
          {email.slice(0, 1).toUpperCase()}
        </div>
        <span className="text-sm text-muted">{email}</span>
      </div>
    </header>
  );
}
