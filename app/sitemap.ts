import type { MetadataRoute } from "next";
import { getAllBlogPostSlugs, getAllProjectSlugs, getAllHackathonSlugs, getAllCertificationSlugs } from "@/lib/data";
import { getBaseUrl } from "@/lib/utils";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const routes = ["", "/about", "/projects", "/blog", "/experience", "/contact", "/education"];
  const staticEntries = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8
  }));

  let projectEntries: MetadataRoute.Sitemap = [];
  let blogEntries: MetadataRoute.Sitemap = [];
  let hackathonEntries: MetadataRoute.Sitemap = [];
  let certificationEntries: MetadataRoute.Sitemap = [];

  try {
    const [projectSlugs, blogSlugs, hackathonSlugs, certificationSlugs] = await Promise.all([
      getAllProjectSlugs(),
      getAllBlogPostSlugs(),
      getAllHackathonSlugs(),
      getAllCertificationSlugs()
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

    hackathonEntries = hackathonSlugs.map((slug) => ({
      url: `${baseUrl}/hackathons/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6
    }));

    certificationEntries = certificationSlugs.map((slug) => ({
      url: `${baseUrl}/certifications/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6
    }));
  } catch (error) {
    console.error("Failed to fetch dynamic routes for sitemap:", error);
  }

  return [...staticEntries, ...projectEntries, ...blogEntries, ...hackathonEntries, ...certificationEntries];
}
