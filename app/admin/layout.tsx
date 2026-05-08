import { AdminShell } from "@/components/admin/AdminShell";
import { auth } from "@/lib/auth";
import { getContactMessages } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, messages] = await Promise.all([
    auth(),
    getContactMessages()
  ]);
  const unread = messages.filter((message) => !message.read).length;

  return (
    <AdminShell email={session?.user?.email ?? "admin"} unread={unread}>
      {children}
    </AdminShell>
  );
}
