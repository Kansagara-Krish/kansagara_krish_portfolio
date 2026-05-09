import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { FolderOpen, FileText, Briefcase, Zap, Trophy, Award, MessageSquare } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-muted">Overview of your portfolio content</p>
      
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Projects"
          description="Manage your portfolio projects"
          icon={FolderOpen}
          href="/admin/projects"
          color="bg-blue-500"
        />
        <DashboardCard
          title="Blog Posts"
          description="Write and manage blog articles"
          icon={FileText}
          href="/admin/blog"
          color="bg-green-500"
        />
        <DashboardCard
          title="Experience"
          description="Manage work experience"
          icon={Briefcase}
          href="/admin/experience"
          color="bg-purple-500"
        />
        <DashboardCard
          title="Skills"
          description="Manage your skill set"
          icon={Zap}
          href="/admin/skills"
          color="bg-yellow-500"
        />
        <DashboardCard
          title="Hackathons"
          description="Track hackathon participation"
          icon={Trophy}
          href="/admin/hackathons"
          color="bg-pink-500"
        />
        <DashboardCard
          title="Certifications"
          description="Manage certifications"
          icon={Award}
          href="/admin/certifications"
          color="bg-orange-500"
        />
        <DashboardCard
          title="Messages"
          description="View contact messages"
          icon={MessageSquare}
          href="/admin/messages"
          color="bg-red-500"
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
  color,
}: {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}) {
  return (
    <a href={href} className="block transition-transform hover:scale-[1.02]">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color} text-white`}>
            <Icon size={24} />
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </CardContent>
      </Card>
    </a>
  );
}
