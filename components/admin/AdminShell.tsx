"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export function AdminShell({ children, email, unread }: { children: ReactNode; email: string; unread: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-bg text-text">
      <AdminSidebar open={open} onClose={() => setOpen(false)} unread={unread} />
      <div className="md:pl-60">
        <AdminHeader email={email} onMenu={() => setOpen(true)} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
