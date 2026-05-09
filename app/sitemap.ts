import type { MetadataRoute } from "next";
import { getAllBlogPostSlugs, getAllProjectSlugs } from "@/lib/data";
import { getBaseUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const routes = ["", "/about", "/projects", "/blog", "/experience", "/contact"];
  const staticEntries = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8
  }));

  let projectEntries: MetadataRoute.Sitemap = [];
  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const [projectSlugs, blogSlugs] = await Promise.all([
      getAllProjectSlugs(),
      getAllBlogPostSlugs()
    ]);

    projectEntries = projectSlugs.map((slug) => ({
      url: `${baseUrl}/projects/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7
    }));

    blogEntries = blogSlugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7
    }));
  } catch (error) {
    console.error("Failed to fetch dynamic routes for sitemap:", error);
  }

  return [...staticEntries, ...projectEntries, ...blogEntries];
}
