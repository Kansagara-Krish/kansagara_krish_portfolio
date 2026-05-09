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
  MessageSquare 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Zap },
  { href: "/admin/hackathons", label: "Hackathons", icon: Trophy },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
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
        <aside className="fixed left-0 top-0 z-10 h-screen w-64 border-r border-border bg-surface">
          <div className="flex h-full flex-col">
            <div className="border-b border-border p-6">
              <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
              <p className="text-sm text-muted">Portfolio Management</p>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-white"
                            : "text-text hover:bg-surface"
                        )}
                      >
                        <Icon size={18} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="border-t border-border p-4">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:text-text"
              >
                ← Back to Site
              </Link>
            </div>
          </div>
        </aside>
        <main className="ml-64 flex-1">
          <div className="min-h-screen p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
