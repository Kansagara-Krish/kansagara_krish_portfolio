import { AdminShell } from "@/components/admin/AdminShell";
import { auth } from "@/lib/auth";
import { fetchApi } from "@/lib/server-data";
import type { ContactMessageDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, messages] = await Promise.all([
    auth(),
    fetchApi<ContactMessageDTO[]>("/messages", [])
  ]);
  const unread = messages.filter((message) => !message.read).length;

  return (
    <AdminShell email={session?.user?.email ?? "admin"} unread={unread}>
      {children}
    </AdminShell>
  );
}
