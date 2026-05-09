import type { MetadataRoute } from "next";
import { getAllBlogPostSlugs, getAllProjectSlugs } from "@/lib/data";
import { getBaseUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const [projectSlugs, blogSlugs] = await Promise.all([
    getAllProjectSlugs(),
    getAllBlogPostSlugs()
  ]);

  const routes = ["", "/about", "/projects", "/blog", "/experience", "/contact"];
  const staticEntries = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8
  }));

  const projectEntries = projectSlugs.map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));

  const blogEntries = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));

  return [...staticEntries, ...projectEntries, ...blogEntries];
}
