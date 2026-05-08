import type { SiteSettingsDTO } from "@/lib/types";

export const defaultSettings: SiteSettingsDTO = {
  id: "singleton",
  name: "Aarav Sharma",
  title: "Computer Engineer",
  bio: "I design and build reliable web products, developer tools, and data-driven interfaces with a focus on clarity, performance, and maintainable systems.",
  email: "hello@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  resumeUrl: null,
  avatarUrl: null,
  heroTagline: "Production-minded full-stack engineer turning complex ideas into calm, useful software.",
  openToWork: true,
  resumeDownloads: 0,
  updatedAt: new Date(0).toISOString()
};
