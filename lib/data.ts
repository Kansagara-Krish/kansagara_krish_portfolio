import { unstable_cache } from "next/cache";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type {
  BlogPostDTO,
  CertificationDTO,
  ContactMessageDTO,
  ExperienceDTO,
  HackathonDTO,
  ProjectDTO,
  SiteSettingsDTO,
  SkillDTO
} from "@/lib/types";

function serializeData<T>(data: unknown): T {
  return JSON.parse(JSON.stringify(data, (_key, value) => {
    return value instanceof Date ? value.toISOString() : value;
  })) as T;
}

function cached<T>(key: string[], tags: string[], query: () => Promise<T>) {
  return cache(() => unstable_cache(query, key, { revalidate: 3600, tags })());
}

export const getExperiences = cached(["experiences"], ["experiences"], async (): Promise<ExperienceDTO[]> => {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ order: "asc" }, { startDate: "desc" }]
  });
  return serializeData<ExperienceDTO[]>(experiences);
});

export const getSkills = cached(["skills"], ["skills"], async (): Promise<SkillDTO[]> => {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }]
  });
  return serializeData<SkillDTO[]>(skills);
});

export const getProjects = cached(["projects"], ["projects"], async (): Promise<ProjectDTO[]> => {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" }
  });
  return serializeData<ProjectDTO[]>(projects);
});

export const getAllProjectSlugs = cached(["project-slugs"], ["projects"], async (): Promise<string[]> => {
  const projects = await prisma.project.findMany({ select: { slug: true } });
  return projects.map((project) => project.slug);
});

export const getBlogPosts = cached(["blog-posts"], ["blog"], async (): Promise<BlogPostDTO[]> => {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" }
  });
  return serializeData<BlogPostDTO[]>(posts);
});

export const getAllBlogPostSlugs = cached(["blog-slugs"], ["blog"], async (): Promise<string[]> => {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true }
  });
  return posts.map((post) => post.slug);
});

export const getSiteSettings = cached(["site-settings"], ["settings"], async (): Promise<SiteSettingsDTO | null> => {
  const settings = await prisma.settings.findFirst();
  return settings ? serializeData<SiteSettingsDTO>(settings) : null;
});

export const getCertifications = cached(["certifications"], ["certifications"], async (): Promise<CertificationDTO[]> => {
  const certifications = await prisma.certification.findMany({
    orderBy: { date: "desc" }
  });
  return serializeData<CertificationDTO[]>(certifications);
});

export const getHackathons = cached(["hackathons"], ["hackathons"], async (): Promise<HackathonDTO[]> => {
  const hackathons = await prisma.hackathon.findMany({
    orderBy: { date: "desc" }
  });
  return serializeData<HackathonDTO[]>(hackathons);
});

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectDTO | null> => {
  const query = unstable_cache(
    async () => {
      const project = await prisma.project.findUnique({ where: { slug } });
      return project ? serializeData<ProjectDTO>(project) : null;
    },
    [`project-${slug}`],
    { revalidate: 3600, tags: ["projects", `project-${slug}`] }
  );
  return query();
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPostDTO | null> => {
  const query = unstable_cache(
    async () => {
      const post = await prisma.blogPost.findUnique({ where: { slug, published: true } });
      return post ? serializeData<BlogPostDTO>(post) : null;
    },
    [`blog-post-${slug}`],
    { revalidate: 3600, tags: ["blog", `blog-post-${slug}`] }
  );
  return query();
});

export async function getContactMessages(): Promise<ContactMessageDTO[]> {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" }
  });
  return serializeData<ContactMessageDTO[]>(messages);
}

export async function getProjectById(id: string): Promise<ProjectDTO | null> {
  const project = await prisma.project.findUnique({ where: { id } });
  return project ? serializeData<ProjectDTO>(project) : null;
}

export async function getBlogPostById(id: string): Promise<BlogPostDTO | null> {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  return post ? serializeData<BlogPostDTO>(post) : null;
}

export async function getExperienceById(id: string): Promise<ExperienceDTO | null> {
  const experience = await prisma.experience.findUnique({ where: { id } });
  return experience ? serializeData<ExperienceDTO>(experience) : null;
}

export async function getCertificationById(id: string): Promise<CertificationDTO | null> {
  const certification = await prisma.certification.findUnique({ where: { id } });
  return certification ? serializeData<CertificationDTO>(certification) : null;
}

export async function getHackathonById(id: string): Promise<HackathonDTO | null> {
  const hackathon = await prisma.hackathon.findUnique({ where: { id } });
  return hackathon ? serializeData<HackathonDTO>(hackathon) : null;
}