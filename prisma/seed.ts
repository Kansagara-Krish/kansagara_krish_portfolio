import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { slugify } from "../lib/utils";

const prisma = new PrismaClient();

const longPost = (topic: string) => `
<p>${topic} is strongest when architecture decisions stay close to real user workflows. In portfolio projects, dashboards, and internal tools, the best systems are rarely the ones with the most ceremony. They are the ones where data models, validation, loading states, and visual hierarchy work together so the next action feels obvious.</p>
<p>A practical engineering process starts with constraints. Who maintains the feature? What data can be trusted? Which failures are likely in production? Answering those questions early makes the implementation calmer because the UI is no longer a separate layer painted over the backend. It becomes a clear expression of the product rules.</p>
<p>For example, a blog editor needs draft states, rich content, predictable slugs, and a safe publishing path. A project gallery needs fast scanning, helpful filters, and clean fallbacks when images are missing. A contact form needs validation, rate-aware email delivery, and useful feedback when something fails. These are not extras. They are the difference between a demo and a product.</p>
<p>The same mindset applies to performance. Server-rendered data, small client components, and focused animations let the page feel polished without hiding slow interactions behind visual noise. Motion should guide attention, not become the point of the interface. Every flourish should earn its place by making the work easier to understand.</p>
<p>Good engineering is a habit of finishing the details. Accessible labels, readable empty states, confirmation dialogs for destructive actions, consistent date formatting, and meaningful admin screens all compound into trust. A portfolio that includes those details says something useful about the engineer before a single resume line is read.</p>
`;

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123456";

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { password: await bcrypt.hash(adminPassword, 12) },
    create: {
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 12)
    }
  });

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      name: "Aarav Sharma",
      title: "Computer Engineer",
      bio: "I design and build reliable web products, developer tools, and data-driven interfaces with a focus on clarity, performance, and maintainable systems.",
      email: "hello@aarav.dev",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      resumeUrl: "https://example.com/resume.pdf",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=640&h=640&fit=crop",
      heroTagline: "Production-minded full-stack engineer turning complex ideas into calm, useful software.",
      openToWork: true
    }
  });

  const tagNames = ["Next.js", "Prisma", "PostgreSQL", "AI", "Dashboard", "DevTools", "Cloud"];
  await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name }
      })
    )
  );

  const projects = [
    {
      title: "Observability Command Center",
      description: "A real-time incident dashboard that combines service health, traces, deploy markers, and team notes in a single operator view.",
      content: "<p>This command center gives engineering teams a calm way to triage production incidents. It combines live metrics, deploy history, and team annotations into a single timeline so responders can move from symptom to probable cause quickly.</p><p>The admin interface supports project metadata, rich details, and status tracking. The public page highlights the architecture, tradeoffs, and delivery outcomes.</p>",
      techStack: ["Next.js", "PostgreSQL", "Prisma", "Framer Motion"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/observability-command-center",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
      featured: true,
      status: "completed",
      tags: ["Next.js", "Dashboard", "PostgreSQL"]
    },
    {
      title: "AI Code Review Assistant",
      description: "A reviewer workflow that summarizes pull requests, highlights risky diffs, and turns findings into actionable engineering tasks.",
      content: "<p>The assistant reads pull request metadata and source diffs to produce concise review notes. It emphasizes risk, missing tests, and behavior changes rather than generic style commentary.</p><p>The project includes queueing, structured prompts, and a review dashboard for tracking follow-up work.</p>",
      techStack: ["TypeScript", "Next.js", "AI SDK", "PostgreSQL"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/ai-code-review",
      imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=800&fit=crop",
      featured: true,
      status: "completed",
      tags: ["AI", "DevTools", "Next.js"]
    },
    {
      title: "Cloud Cost Explorer",
      description: "A finance-friendly explorer for cloud spend, anomaly detection, team ownership, and monthly budget forecasting.",
      content: "<p>Cloud Cost Explorer organizes provider billing exports into product-level trends and alerts. It gives engineering and finance teams shared language for discussing spend without requiring everyone to learn provider billing internals.</p>",
      techStack: ["React", "Prisma", "PostgreSQL", "Charts"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/example/cloud-cost-explorer",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
      featured: true,
      status: "in-progress",
      tags: ["Cloud", "Dashboard", "Prisma"]
    }
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: slugify(project.title) },
      update: {},
      create: {
        title: project.title,
        slug: slugify(project.title),
        description: project.description,
        content: project.content,
        techStack: project.techStack,
        liveUrl: project.liveUrl,
        githubUrl: project.githubUrl,
        imageUrl: project.imageUrl,
        featured: project.featured,
        status: project.status,
        tags: {
          connect: project.tags.map((name) => ({ name }))
        }
      }
    });
  }

  const posts = [
    ["Designing Admin Panels That Engineers Actually Use", "Practical lessons for building internal tools with strong feedback loops.", true, ["Dashboard", "Next.js"]],
    ["Prisma Patterns for Portfolio-Scale Products", "How to model content, tags, settings, and inbox workflows without overbuilding.", true, ["Prisma", "PostgreSQL"]],
    ["Small Details That Make Developer Portfolios Feel Senior", "A field guide to polish, resilience, and product thinking in personal sites.", false, ["DevTools", "Next.js"]]
  ] as const;

  for (const [title, excerpt, published, tags] of posts) {
    await prisma.blogPost.upsert({
      where: { slug: slugify(title) },
      update: {},
      create: {
        title,
        slug: slugify(title),
        excerpt,
        content: longPost(title),
        coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop",
        published,
        readingTime: 4,
        tags: {
          connect: tags.map((name) => ({ name }))
        }
      }
    });
  }

  const experiences = [
    ["Northstar Labs", "Senior Full-Stack Engineer", "Bengaluru, India", "full-time", "2024-01-01", null, true, "Leading product engineering for operational dashboards, API platforms, and workflow automation.", ["Next.js", "PostgreSQL", "System Design"], 1],
    ["CircuitWorks", "Software Engineer", "Pune, India", "full-time", "2022-02-01", "2023-12-31", false, "Built internal platforms for deployment visibility, feature rollout, and data quality monitoring.", ["React", "Node.js", "Prisma"], 2],
    ["Cloudlane", "Backend Engineer", "Remote", "contract", "2021-05-01", "2022-01-31", false, "Designed billing ingestion pipelines and reporting APIs for cloud infrastructure teams.", ["PostgreSQL", "Queues", "AWS"], 3],
    ["ByteFoundry", "Engineering Intern", "Mumbai, India", "internship", "2020-06-01", "2020-12-31", false, "Shipped UI components and test coverage for a customer analytics product.", ["TypeScript", "Testing", "Design Systems"], 4]
  ] as const;

  await prisma.experience.deleteMany({});
  for (const [company, role, location, type, startDate, endDate, current, description, skills, order] of experiences) {
    await prisma.experience.create({
      data: {
        company,
        role,
        location,
        type,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        current,
        description,
        skills: [...skills],
        order,
        logoUrl: null
      }
    });
  }

  const skills = [
    ["TypeScript", "Languages", 5],
    ["Python", "Languages", 4],
    ["SQL", "Languages", 5],
    ["Next.js", "Frameworks", 5],
    ["React", "Frameworks", 5],
    ["Node.js", "Frameworks", 4],
    ["Prisma", "Tools", 5],
    ["Docker", "Tools", 4],
    ["GitHub Actions", "Tools", 4],
    ["AWS", "Cloud", 4],
    ["Vercel", "Cloud", 5],
    ["Neon", "Cloud", 4]
  ] as const;

  await prisma.skill.deleteMany({});
  for (const [name, category, level] of skills) {
    await prisma.skill.create({ data: { name, category, level, order: level } });
  }

  await prisma.contactMessage.deleteMany({});
  await prisma.contactMessage.createMany({
    data: [
      {
        name: "Maya Chen",
        email: "maya@example.com",
        subject: "Product dashboard project",
        message: "I loved the observability work and would like to discuss a dashboard engagement.",
        read: false
      },
      {
        name: "Rohan Mehta",
        email: "rohan@example.com",
        subject: "Speaking opportunity",
        message: "Would you be open to giving a short talk about portfolio engineering systems?",
        read: true
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
