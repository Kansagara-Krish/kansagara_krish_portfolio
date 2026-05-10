import type { ProjectDTO, BlogPostDTO, SiteSettingsDTO } from "@/lib/types";
import { getBaseUrl } from "@/lib/utils";

export function generatePersonSchema(settings: SiteSettingsDTO) {
  const baseUrl = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.name,
    jobTitle: settings.title,
    description: settings.bio,
    email: settings.email,
    url: baseUrl,
    image: settings.avatarUrl,
    sameAs: [settings.github, settings.linkedin, settings.twitter].filter(Boolean) as string[],
    worksFor: {
      "@type": "Organization",
      name: settings.name
    }
  };
}

export function generateBlogPostSchema(post: BlogPostDTO) {
  const baseUrl = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    author: {
      "@type": "Person",
      name: "Pratham Rajbhar"
    },
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    url: `${baseUrl}/blog/${post.slug}`,
    keywords: post.tags.join(", ")
  };
}

export function generateProjectSchema(project: ProjectDTO) {
  const baseUrl = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.description,
    author: {
      "@type": "Person",
      name: "Pratham Rajbhar"
    },
    dateCreated: project.createdAt,
    dateModified: project.updatedAt,
    url: `${baseUrl}/projects/${project.slug}`,
    programmingLanguage: project.techStack,
    keywords: project.tags.join(", "),
    applicationCategory: project.category,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; item: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item
    }))
  };
}

export function generateWebsiteSchema() {
  const baseUrl = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Pratham Rajbhar",
    url: baseUrl,
    description: "Full-stack engineer building scalable, user-centric digital solutions.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}
