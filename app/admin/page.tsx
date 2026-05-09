import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { FolderOpen, FileText, Briefcase, Zap, Trophy, Award, MessageSquare } from "lucide-react";
import React from "react";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-display text-2xl tracking-tight">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">Overview of your portfolio content</p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Projects"
          description="Manage portfolio projects"
          icon={FolderOpen}
          href="/admin/projects"
        />
        <DashboardCard
          title="Blog Posts"
          description="Write and manage articles"
          icon={FileText}
          href="/admin/blog"
        />
        <DashboardCard
          title="Experience"
          description="Manage work history"
          icon={Briefcase}
          href="/admin/experience"
        />
        <DashboardCard
          title="Skills"
          description="Manage your skill set"
          icon={Zap}
          href="/admin/skills"
        />
        <DashboardCard
          title="Hackathons"
          description="Track competitions"
          icon={Trophy}
          href="/admin/hackathons"
        />
        <DashboardCard
          title="Certifications"
          description="Manage credentials"
          icon={Award}
          href="/admin/certifications"
        />
        <DashboardCard
          title="Messages"
          description="View contact messages"
          icon={MessageSquare}
          href="/admin/messages"
        />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  icon: Icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  href: string;
}) {
  return (
    <a href={href} className="block transition-all hover:-translate-y-0.5">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon size={18} />
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-medium">{title}</h3>
          <p className="mt-1 text-xs text-muted">{description}</p>
        </CardContent>
      </Card>
    </a>
  );
}
