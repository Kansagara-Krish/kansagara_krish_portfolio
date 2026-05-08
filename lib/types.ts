export type TagDTO = {
  id: string;
  name: string;
};

export type ProjectDTO = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  techStack: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  status: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  tags: TagDTO[];
};

export type BlogPostDTO = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  published: boolean;
  readingTime: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  tags: TagDTO[];
};

export type ExperienceDTO = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  type: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  skills: string[];
  logoUrl: string | null;
  order: number;
  createdAt: string;
};

export type SkillDTO = {
  id: string;
  name: string;
  category: string;
  level: number;
  iconUrl: string | null;
  order: number;
};

export type ContactMessageDTO = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type SiteSettingsDTO = {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  resumeUrl: string | null;
  avatarUrl: string | null;
  heroTagline: string | null;
  openToWork: boolean;
  resumeDownloads: number;
  updatedAt: string;
};

export type ApiResponse<T> = { data: T } | { error: string; fields?: Record<string, string[]> };
