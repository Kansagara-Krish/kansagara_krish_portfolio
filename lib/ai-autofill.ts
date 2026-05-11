import { z } from "zod";

export type SupportedModule =
  | "experience"
  | "projects"
  | "blog"
  | "certifications"
  | "hackathons"
  | "education"
  | "skills"
  | "services";

// ─── Zod schemas (all form fields; required are NOT marked .optional) ─────────

export const experienceSchema = z.object({
  company: z.string().describe("The name of the company or organization"),
  role: z.string().describe("The job title or role"),
  location: z.string().optional().describe("Location of the job (e.g., San Francisco, CA or Remote)"),
  type: z.enum(["Full-time", "Part-time", "Contract", "Freelance", "Internship"]).optional().describe("Employment type"),
  startDate: z.string().describe("Start date in YYYY-MM-DD format"),
  endDate: z.string().optional().describe("End date in YYYY-MM-DD format. Omit if currently employed here."),
  current: z.boolean().describe("True if currently employed here, false otherwise"),
  description: z.string().describe("Detailed description of responsibilities and achievements"),
  skills: z.array(z.string()).optional().describe("List of technologies or skills used"),
  logoUrl: z.string().optional().describe("Company logo URL"),
  order: z.number().optional().describe("Display order"),
});

export const projectsSchema = z.object({
  title: z.string().describe("Project title"),
  slug: z.string().optional().describe("URL slug — auto-generated from title if omitted"),
  subtitle: z.string().optional().describe("Tagline or brief subtitle"),
  description: z.string().describe("Short summary of the project"),
  content: z.string().optional().describe("Full case study or project details in Markdown"),
  role: z.string().optional().describe("User's role in the project"),
  client: z.string().optional().describe("The client or organization for the project"),
  category: z.string().optional().describe("Project category (e.g., Web App, Mobile App)"),
  timeline: z.string().optional().describe("Project duration (e.g., 3 months)"),
  year: z.string().optional().describe("Year of completion"),
  problem: z.string().optional().describe("The challenge addressed by the project"),
  solution: z.string().optional().describe("How the project solved the problem"),
  impact: z.string().optional().describe("The result or impact of the project"),
  features: z.array(z.string()).optional().describe("Key features of the project"),
  outcomes: z.array(z.string()).optional().describe("Key outcomes or results"),
  techStack: z.array(z.string()).optional().describe("Technologies used (e.g., React, Node.js)"),
  liveUrl: z.string().optional().describe("Live demo URL"),
  githubUrl: z.string().optional().describe("GitHub repository URL"),
  imageUrl: z.string().optional().describe("Hero image URL"),
  galleryImages: z.array(z.string()).optional().describe("Gallery image URLs"),
  tags: z.array(z.string()).optional().describe("General tags for the project"),
  featured: z.boolean().optional().describe("Whether to feature on homepage"),
  status: z.enum(["completed", "in-progress", "planned"]).optional().describe("Project status"),
  projectLinks: z.array(z.object({ label: z.string(), url: z.string() })).optional().describe("Additional project links"),
  seoTitle: z.string().optional().describe("SEO-optimized title for the project"),
  seoDescription: z.string().optional().describe("SEO meta description for the project"),
  seoKeywords: z.string().optional().describe("Comma-separated SEO keywords for the project"),
});

export const blogSchema = z.object({
  title: z.string().describe("Blog post title"),
  slug: z.string().optional().describe("URL slug — auto-generated from title if omitted"),
  excerpt: z.string().describe("Short summary of the post"),
  content: z.string().describe("Full content of the blog post, preferably in Markdown format"),
  coverImage: z.string().optional().describe("Cover image URL"),
  published: z.boolean().describe("Whether the post should be published immediately"),
  tags: z.array(z.string()).optional().describe("List of relevant tags"),
  seoTitle: z.string().optional().describe("SEO-optimized title for the blog post"),
  seoDescription: z.string().optional().describe("SEO meta description for the blog post"),
  seoKeywords: z.string().optional().describe("Comma-separated SEO keywords for the blog post"),
});

export const certificationsSchema = z.object({
  name: z.string().describe("Name of the certification"),
  issuer: z.string().describe("Organization that issued the certification"),
  date: z.string().describe("Date issued in YYYY-MM-DD format"),
  credentialId: z.string().optional().describe("Credential ID"),
  url: z.string().optional().describe("Verification URL"),
  slug: z.string().optional().describe("URL slug — auto-generated from name if omitted"),
  image: z.string().optional().describe("Certificate image URL"),
});

export const hackathonsSchema = z.object({
  title: z.string().describe("Name of the hackathon"),
  project: z.string().describe("Name of the project built"),
  role: z.string().optional().describe("Role played in the team"),
  date: z.string().describe("Date of the event in YYYY-MM-DD format"),
  location: z.string().optional().describe("Location of the event"),
  result: z.string().optional().describe("Result or achievement (e.g., Winner, Finalist)"),
  link: z.string().optional().describe("URL to the project submission"),
  description: z.string().describe("Description of the project and experience"),
  slug: z.string().optional().describe("URL slug — auto-generated from title if omitted"),
  image: z.string().optional().describe("Hackathon image URL"),
});

export const educationSchema = z.object({
  institution: z.string().describe("Name of the school or university"),
  degree: z.string().describe("Degree obtained (e.g., Bachelor of Science)"),
  field: z.string().optional().describe("Field of study (e.g., Computer Science)"),
  startYear: z.string().describe("Start year (e.g., 2018)"),
  endYear: z.string().optional().describe("End year (e.g., 2022). Omit if currently studying."),
  current: z.boolean().describe("True if currently enrolled, false otherwise"),
  description: z.string().optional().describe("Academic description, coursework, honors"),
  gpa: z.string().optional().describe("GPA"),
  location: z.string().optional().describe("Location of the institution"),
  slug: z.string().optional().describe("URL slug — auto-generated from institution and degree if omitted"),
  order: z.number().optional().describe("Display order"),
});

export const skillsSchema = z.object({
  name: z.string().describe("Name of the skill (e.g., React)"),
  category: z.string().describe("Category of the skill (e.g., Frontend, Backend)"),
  iconUrl: z.string().optional().describe("Icon URL (SVG or image)"),
  order: z.number().optional().describe("Display order"),
});

export const servicesSchema = z.object({
  title: z.string().describe("Title of the service"),
  description: z.string().describe("Description of the service"),
  icon: z.string().optional().describe("Icon URL"),
  order: z.number().optional().describe("Display order"),
});

export const schemas = {
  experience: experienceSchema,
  projects: projectsSchema,
  blog: blogSchema,
  certifications: certificationsSchema,
  hackathons: hackathonsSchema,
  education: educationSchema,
  skills: skillsSchema,
  services: servicesSchema,
};

// ─── Field lists for system prompts ────────────────────────────────────────────

export const requiredFields: Record<SupportedModule, string[]> = {
  experience: ["company", "role", "startDate", "current", "description"],
  projects: ["title", "description"],
  blog: ["title", "excerpt", "content", "published"],
  certifications: ["name", "issuer", "date"],
  hackathons: ["title", "project", "date", "description"],
  education: ["institution", "degree", "startYear", "current"],
  skills: ["name", "category"],
  services: ["title", "description"],
};

export const optionalFields: Record<SupportedModule, string[]> = {
  experience: ["location", "type", "endDate", "skills", "logoUrl", "order"],
  projects: [
    "slug", "subtitle", "content", "role", "client", "category", "timeline",
    "year", "problem", "solution", "impact", "features", "outcomes",
    "techStack", "liveUrl", "githubUrl", "imageUrl", "galleryImages",
    "tags", "featured", "status", "projectLinks",
    "seoTitle", "seoDescription", "seoKeywords",
  ],
  blog: ["slug", "coverImage", "tags", "seoTitle", "seoDescription", "seoKeywords"],
  certifications: ["credentialId", "url", "slug", "image"],
  hackathons: ["role", "location", "result", "link", "slug", "image"],
  education: ["field", "endYear", "description", "gpa", "location", "slug", "order"],
  skills: ["iconUrl", "order"],
  services: ["icon", "order"],
};

// ─── Form-state helpers ──────────────────────────────────────────────────────

/** Fields whose form state stores arrays as newline-separated strings. */
const ARRAY_FIELDS: Record<string, string[]> = {
  projects: ["features", "outcomes", "techStack", "tags", "galleryImages"],
  blog: ["tags"],
  experience: ["skills"],
};

/** Fields that must be coerced to YYYY-MM-DD for form state. */
const DATE_FIELDS = ["date", "startDate", "endDate"];

/**
 * Converts AI-extracted data into form-ready values:
 * - arrays → newline strings where the form state uses strings
 * - dates → YYYY-MM-DD
 * - strips undefined / null entries
 */
export function normalize(
  module: SupportedModule,
  data: unknown,
): Record<string, unknown> {
  if (!data || typeof data !== "object") return {};

  const result: Record<string, unknown> = {};
  const arrayFields = ARRAY_FIELDS[module] ?? [];

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value) && arrayFields.includes(key)) {
      result[key] = value.join("\n");
      continue;
    }

    if (
      typeof value === "string" &&
      DATE_FIELDS.includes(key) &&
      /^\d{4}-\d{2}-\d{2}/.test(value)
    ) {
      result[key] = value.slice(0, 10);
      continue;
    }

    result[key] = value;
  }

  return result;
}

/**
 * Builds a highly sophisticated system prompt for the AI agent.
 * The prompt establishes a professional persona, clear extraction rules,
 * and specific module context to ensure "smart" and accurate behavior.
 */
export function buildSystemPrompt(module: SupportedModule): string {
  const required = requiredFields[module];
  const optional = optionalFields[module];

  return [
    `# ROLE`,
    `You are the "Portfolio Intelligence Engine," a high-end data extraction and content optimization specialist for a professional portfolio CMS.`,
    `Your mission is to take raw, unstructured input (resumes, notes, casual descriptions) and transform it into a perfectly structured "${module}" entry.`,
    ``,
    `# MODULE CONTEXT: ${module.toUpperCase()}`,
    `You are currently assisting the user in adding or updating a ${module} record.`,
    ``,
    `# EXTRACTION TARGETS`,
    `## REQUIRED (Must be present before calling 'fill_form')`,
    ...required.map((f) => `  - ${f}`),
    ``,
    `## OPTIONAL (Extract only if explicitly provided; do not guess)`,
    ...optional.map((f) => `  - ${f}`),
    ``,
    `# INTELLIGENT RULES & BEHAVIORS`,
    `1. **Adaptive Processing Modes**:`,
    `   - **Extraction Mode**: When provided with raw data (resumes, notes, snippets), perform high-precision extraction. Ask clarifying questions only if critical data is missing or ambiguous.`,
    `   - **Creative Generation Mode**: If the user provides a topic or a task (e.g., "write a blog about AI in India"), do NOT simply list missing requirements. Instead, acknowledge the topic and offer to generate the content for them (e.g., "I can write a professional blog post on that topic for you. Would you like me to proceed?"). Once permitted, generate high-quality, comprehensive content to fill all required fields.`,
    `2. **Precision & Integrity**:`,
    `   - **No Hallucination**: Never invent facts about the user's personal history, contact info, or real-world credentials.`,
    `   - **No Dummy URLs**: If an image URL or link is required but not provided, leave it blank. NEVER invent placeholders like "https://example.com/image.jpg".`,
    `   - **Creative License**: For creative fields like "content," "excerpt," or "description," you have full license to write high-quality, engaging, and professional text based on the user's topic.`,
    `3. **Temporal Intelligence**:`,
    `   - If a date is "Present" or "Current," set 'current' to true and omit 'endDate'.`,
    `   - If only a year is provided (e.g., "2022"), use "2022-01-01" as a fallback or ask for the month.`,
    `   - Always normalize to YYYY-MM-DD.`,
    `4. **Content Optimization**: When extracting or generating descriptions, use a professional, high-impact tone. Use bullet points for achievements and clear headings for blog content.`,
    `5. **Incremental Learning**: Keep track of the state. If you've just asked for permission and the user says "Yes" or "Go ahead," proceed to generate the content and call 'fill_form'.`,
    `6. **Tool Triggering**: Call 'fill_form' as soon as you have a complete set of data (either extracted or generated). Confirm the action to the user.`,
    `7. **Proactive Completeness**: After filling required fields, suggest adding optional details (e.g., "Should I also add some relevant tags or a cover image description?") to maximize the entry's impact.`,
    `8. **Schema Compliance**: strictly follow the data types in the 'fill_form' tool. For arrays (tags, skills, features), provide an array of strings.`,
    `9. **Concise Communication**: Maintain a professional, helpful, and efficient tone.`,
    ``,
    `# CONTEXTUAL AWARENESS`,
    `Today is ${new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`,
    `Current Time: ${new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true })}.`,
    `Site Owner: Pratham Rajbhar (Portfolio Owner)`,
    ``,
    `# USER INPUT PROCESSING`,
    `Analyze the conversation history, identify the missing pieces for the ${module} module, and proceed with either a clarifying question or a 'fill_form' call.`,
  ].join("\n");
}
