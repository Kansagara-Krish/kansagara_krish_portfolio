import type { SiteSettingsDTO } from "@/lib/types";

export const defaultSettings: SiteSettingsDTO = {
  id: "singleton",
  name: "Pratham Rajbhar",
  email: "pratham.rajbhar@gmail.com",
  location: "Surat, India",
  
  // Hero Section
  heroTitle: "Engineering Great Websites.",
  heroTagline: "FULL-STACK ENGINEER",
  heroBio: "Hi, I'm Pratham Rajbhar. A Computer Engineering student building fast, beautiful websites that work perfectly.",
  avatarUrl: null,
  resumeUrl: "/resume.pdf",
  
  // About Section
  aboutTitle: "Building things that work well.",
  aboutGoalTitle: "My Goal",
  aboutGoalDesc: "I make websites that look great and work perfectly. I focus on building fast, easy-to-use apps that can grow with your needs.",
  yearsOfExperience: "2+",
  aboutStatsWork: "2+",
  aboutStatsProjects: "15+",
  aboutStatsCommitment: "100%",
  
  // Projects Section
  projectsTitle: "My Projects.",
  projectsSubtitle: "My Work",
  projectsDesc: "I have built 15+ projects that are fast and easy to use.",

  // Home Page Additional Sections
  homeWorkTitle: "Work History",
  homeWorkSubtitle: "History",
  homeBlogTitle: "Recent Posts",
  homeBlogSubtitle: "Blog",
  
  // Contact CTA
  contactCtaTitle: "Have a project in mind?",
  contactCtaDesc: "I'm currently open for freelance work and new jobs. Let's build something great together.",
  
  // Links
  github: "https://github.com/prathamrajbhar",
  linkedin: "https://linkedin.com/in/prathamrajbhar",
  twitter: null,
  
  // Footer
  footerTitle: "Ready to bring your ideas to life?",
  footerBio: "I build fast, high-quality websites and apps that are easy to use.",
  
  openToWork: true,
  updatedAt: new Date().toISOString(),

  // SEO (null = use computed defaults)
  seoTitle: null,
  seoDescription: null,
  seoKeywords: null,
  ogImage: null,
};
