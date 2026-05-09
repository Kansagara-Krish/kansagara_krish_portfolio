import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailClient } from "@/components/public/ProjectDetailClient";
import { getAllProjectSlugs, getProjectBySlug, getProjects } from "@/lib/data";
import { getBaseUrl } from "@/lib/utils";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const baseUrl = getBaseUrl();
  return {
    title: project?.title ?? "Project",
    description: project?.description ?? "Project detail",
    alternates: {
      canonical: `/projects/${slug}`
    },
    openGraph: {
      images: [`${baseUrl}/api/og?title=${encodeURIComponent(project?.title ?? "Project")}&subtitle=${encodeURIComponent("Project")}`]
    }
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getProjects()
  ]);

  if (!project) notFound();

  const tagNames = new Set(project.tags);
  const related = allProjects.filter((item) => item.id !== project.id && item.tags.some((tag) => tagNames.has(tag))).slice(0, 3);

  return <ProjectDetailClient project={project} related={related} />;
}
