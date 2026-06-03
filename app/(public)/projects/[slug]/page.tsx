import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { ProjectDetailClient } from "@/components/public/ProjectDetailClient";
import { getAllProjectSlugs, getProjectBySlug, getProjects } from "@/lib/data";
import { getBaseUrl } from "@/lib/utils";
import { generateProjectSchema, generateBreadcrumbSchema } from "@/lib/structured-data";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  if (slugs.length === 0) {
    return [{ slug: "placeholder" }];
  }
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const baseUrl = getBaseUrl();

  const title = project?.seoTitle ?? project?.title ?? "Project";
  const description = project?.seoDescription ?? project?.description ?? "Project detail";
  const keywords = project?.seoKeywords
    ? project.seoKeywords.split(",").map((k) => k.trim())
    : project?.tags ?? [];
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(project?.title ?? "Project")}&subtitle=${encodeURIComponent("Project")}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/projects/${slug}`,
      images: [ogImage],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
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

  const baseUrl = getBaseUrl();
  const projectSchema = JSON.stringify(generateProjectSchema(project));
  const breadcrumbSchema = JSON.stringify(generateBreadcrumbSchema([
    { name: "Home", item: baseUrl },
    { name: "Projects", item: `${baseUrl}/projects` },
    { name: project.title, item: `${baseUrl}/projects/${slug}` }
  ]));

  return (
    <>
      <Script
        id="structured-data-project"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: projectSchema }}
      />
      <Script
        id="structured-data-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbSchema }}
      />
      <ProjectDetailClient project={project} related={related} />
    </>
  );
}
