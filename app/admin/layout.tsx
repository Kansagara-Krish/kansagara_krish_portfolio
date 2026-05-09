"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  FolderOpen,
  FileText,
  Briefcase,
  Zap,
  Trophy,
  Award,
  MessageSquare,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Zap },
  { href: "/admin/hackathons", label: "Hackathons", icon: Trophy },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg">
      <div className="flex">
        <aside className="fixed left-0 top-0 z-10 h-screen w-60 border-r border-border bg-surface">
          <div className="flex h-full flex-col">
            <div className="border-b border-border p-5">
              <h1 className="font-display text-xl tracking-tight">Admin</h1>
              <p className="mt-1 text-xs text-muted">Portfolio management</p>
            </div>
            <nav className="flex-1 overflow-y-auto p-3">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-text text-bg font-medium"
                            : "text-muted hover:text-text hover:bg-border/30"
                        )}
                      >
                        <Icon size={16} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="border-t border-border p-3">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:text-text transition-colors"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </aside>
        <main className="ml-60 flex-1">
          <div className="min-h-screen p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
