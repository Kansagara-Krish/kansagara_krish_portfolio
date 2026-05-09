import { unstable_cache } from "next/cache";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { 
  ExperienceDTO, 
  SkillDTO, 
  ProjectDTO, 
  BlogPostDTO, 
  SiteSettingsDTO, 
  CertificationDTO, 
  HackathonDTO, 
  ContactMessageDTO 
} from "@/lib/types";

// Helper function to serialize data
function serializeData<T>(data: unknown): T {
  return JSON.parse(JSON.stringify(data, (_key, value) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  })) as T;
}

// Experiences
export const getExperiences = cache(async (): Promise<ExperienceDTO[]> => {
  return unstable_cache(
    async () => {
      const experiences = await prisma.experience.findMany({
        orderBy: [{ order: 'asc' }, { startDate: 'desc' }]
      });
      return serializeData<ExperienceDTO[]>(experiences);
    },
    ["experiences"],
    { revalidate: 3600, tags: ["experiences"] }
  )();
});

// Skills
export const getSkills = cache(async (): Promise<SkillDTO[]> => {
  return unstable_cache(
    async () => {
      const skills = await prisma.skill.findMany({
        orderBy: [{ category: 'asc' }, { order: 'asc' }]
      });
      return serializeData<SkillDTO[]>(skills);
    },
    ["skills"],
    { revalidate: 3600, tags: ["skills"] }
  )();
});

// Projects
export const getProjects = cache(async (): Promise<ProjectDTO[]> => {
  return unstable_cache(
    async () => {
      const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return serializeData<ProjectDTO[]>(projects);
    },
    ["projects"],
    { revalidate: 3600, tags: ["projects"] }
  )();
});

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectDTO | null> => {
  return unstable_cache(
    async () => {
      const project = await prisma.project.findUnique({
        where: { slug }
      });
      return project ? serializeData<ProjectDTO>(project) : null;
    },
    [`project-${slug}`],
    { revalidate: 3600, tags: ["projects", `project-${slug}`] }
  )();
});

export const getAllProjectSlugs = cache(async (): Promise<string[]> => {
  return unstable_cache(
    async () => {
      const projects = await prisma.project.findMany({
        select: { slug: true }
      });
      return projects.map((p: { slug: string }) => p.slug);
    },
    ["project-slugs"],
    { revalidate: 3600, tags: ["projects"] }
  )();
});

// Blog Posts
export const getBlogPosts = cache(async (): Promise<BlogPostDTO[]> => {
  return unstable_cache(
    async () => {
      const posts = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' }
      });
      return serializeData<BlogPostDTO[]>(posts);
    },
    ["blog-posts"],
    { revalidate: 3600, tags: ["blog"] }
  )();
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPostDTO | null> => {
  return unstable_cache(
    async () => {
      const post = await prisma.blogPost.findUnique({
        where: { slug }
      });
      return post ? serializeData<BlogPostDTO>(post) : null;
    },
    [`blog-post-${slug}`],
    { revalidate: 3600, tags: ["blog", `blog-post-${slug}`] }
  )();
});

export const getAllBlogPostSlugs = cache(async (): Promise<string[]> => {
  return unstable_cache(
    async () => {
      const posts = await prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true }
      });
      return posts.map((p: { slug: string }) => p.slug);
    },
    ["blog-slugs"],
    { revalidate: 3600, tags: ["blog"] }
  )();
});

// Site Settings
export const getSiteSettings = cache(async (): Promise<SiteSettingsDTO | null> => {
  return unstable_cache(
    async () => {
      const settings = await prisma.settings.findFirst();
      return settings ? serializeData<SiteSettingsDTO>(settings) : null;
    },
    ["site-settings"],
    { revalidate: 3600, tags: ["settings"] }
  )();
});

// Certifications
export const getCertifications = cache(async (): Promise<CertificationDTO[]> => {
  return unstable_cache(
    async () => {
      const certifications = await prisma.certification.findMany({
        orderBy: { date: 'desc' }
      });
      return serializeData<CertificationDTO[]>(certifications);
    },
    ["certifications"],
    { revalidate: 3600, tags: ["certifications"] }
  )();
});

// Hackathons
export const getHackathons = cache(async (): Promise<HackathonDTO[]> => {
  return unstable_cache(
    async () => {
      const hackathons = await prisma.hackathon.findMany({
        orderBy: { date: 'desc' }
      });
      return serializeData<HackathonDTO[]>(hackathons);
    },
    ["hackathons"],
    { revalidate: 3600, tags: ["hackathons"] }
  )();
});

// Admin/Direct Access (Uncached)
export async function getContactMessages(): Promise<ContactMessageDTO[]> {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return serializeData<ContactMessageDTO[]>(messages);
}

export async function getProjectById(_id: string): Promise<ProjectDTO | null> {
  const project = await prisma.project.findUnique({
    where: { id: _id }
  });
  return project ? serializeData<ProjectDTO>(project) : null;
}

export async function getBlogPostById(_id: string): Promise<BlogPostDTO | null> {
  const post = await prisma.blogPost.findUnique({
    where: { id: _id }
  });
  return post ? serializeData<BlogPostDTO>(post) : null;
}

export async function getExperienceById(_id: string): Promise<ExperienceDTO | null> {
  const experience = await prisma.experience.findUnique({
    where: { id: _id }
  });
  return experience ? serializeData<ExperienceDTO>(experience) : null;
}

export async function getCertificationById(_id: string): Promise<CertificationDTO | null> {
  const certification = await prisma.certification.findUnique({
    where: { id: _id }
  });
  return certification ? serializeData<CertificationDTO>(certification) : null;
}

export async function getHackathonById(_id: string): Promise<HackathonDTO | null> {
  const hackathon = await prisma.hackathon.findUnique({
    where: { id: _id }
  });
  return hackathon ? serializeData<HackathonDTO>(hackathon) : null;
}