import { BriefcaseBusiness, FolderKanban, Mail, NotebookText } from "lucide-react";
import Link from "next/link";
import { StatsCard } from "@/components/admin/StatsCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { fetchApi } from "@/lib/server-data";
import type { BlogPostDTO, ContactMessageDTO, ProjectDTO } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [projects, posts, messages] = await Promise.all([
    fetchApi<ProjectDTO[]>("/projects", []),
    fetchApi<BlogPostDTO[]>("/blog", []),
    fetchApi<ContactMessageDTO[]>("/messages", [])
  ]);
  const unread = messages.filter((message) => !message.read).length;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total Projects" value={projects.length} icon={FolderKanban} />
        <StatsCard label="Published Posts" value={posts.filter((post) => post.published).length} icon={NotebookText} />
        <StatsCard label="Total Messages" value={messages.length} icon={Mail} />
        <StatsCard label="Unread Messages" value={unread} icon={BriefcaseBusiness} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button href="/admin/projects/new">Add Project</Button>
        <Button href="/admin/blog/new" variant="secondary">Write Post</Button>
        <Button href="/admin/experience/new" variant="secondary">Add Experience</Button>
      </div>
      <Card className="p-5">
        <h2 className="font-display text-xl font-semibold">Recent Messages</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr><th className="py-3">Name</th><th>Email</th><th>Subject</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {messages.slice(0, 5).map((message) => (
                <tr key={message.id} className="border-b border-border last:border-0">
                  <td className="py-3"><Link className="hover:text-primary" href="/admin/messages">{message.name}</Link></td>
                  <td>{message.email}</td>
                  <td>{message.subject}</td>
                  <td>{formatDate(message.createdAt)}</td>
                  <td><Badge variant={message.read ? "muted" : "default"}>{message.read ? "Read" : "Unread"}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
