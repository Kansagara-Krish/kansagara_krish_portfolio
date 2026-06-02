import { cache } from "react";
import type {
  BlogPostDTO,
  CertificationDTO,
  ContactMessageDTO,
  EducationDTO,
  ExperienceDTO,
  HackathonDTO,
  ProjectDTO,
  ServiceDTO,
  SiteSettingsDTO,
  SkillDTO,
} from "@/lib/types";

// Site settings
const siteSettings: SiteSettingsDTO = {
  id: "site-settings",
  name: "Kansagara Krish",
  title: "Machine Learning Developer",
  email: "kansagara.krish2006@gmail.com",
  location: "Mehsana, Gujarat",
  heroTitle: "Kansagara Krish",
  heroTagline: "Machine Learning Developer",
  heroBio:
    "I am a Machine Learning Developer and current IT Developer intern at Ganpat University, focused on Python, machine learning, AI integrations, and practical problem solving.",
  avatarUrl: "/profile.jpg",
  resumeUrl: "/resume.pdf",
  aboutTitle: "Building thoughtful machine learning products",
  aboutGoalTitle: "My focus",
  aboutGoalDesc:
    "Build useful machine learning and AI projects with Python, FastAPI, Next.js, testing, and clear problem solving.",
  yearsOfExperience: "3+",
  aboutStatsWork: "3+",
  aboutStatsProjects: "12+",
  aboutStatsCommitment: "100%",
  projectsTitle: "Selected projects",
  projectsSubtitle: "Projects",
  projectsDesc: "A selection of machine learning, AI, and product builds from my internship and independent work.",
  homeWorkTitle: "Experience",
  homeWorkSubtitle: "Career timeline",
  homeWorkDesc: "A short snapshot of my current internship, AI projects, and learning milestones that shaped my approach.",
  homeBlogTitle: "Build Notes",
  homeBlogSubtitle: "Hackathon ideas, project lessons, and AI experiments",
  heroRoles: "Machine Learning Developer, IT Developer Intern, Python Developer",
  blogTitle: "Certificates",
  blogSubtitle: "Verified training, hackathons, and technical recognition",
  blogIntro: "Explore professional certifications, technical participation, and program achievements with full certificate detail views.",
  experienceHeroTitle: "Experience",
  experienceHeroDesc: "Current internship work, AI project delivery, and practical learning.",
  educationHeroDesc: "Computer Engineering at Ganpat University from 2023 to 2027.",
  aboutExtraBio: "I like building useful, maintainable work with clear logic, careful testing, and clean product thinking.",
  contactCtaTitle: "Let's build something useful",
  contactCtaDesc: "Open to collaboration, internship opportunities, and practical machine learning work.",
  openToWork: false,
  updatedAt: "2026-06-02T00:00:00.000Z",
  ogImage: null,
  seoTitle: null,
  seoDescription: null,
  seoKeywords: null,
  twitter: null,
  github: null,
  linkedin: null,
  aiProvider: "openrouter",
  aiModel: null,
  aiBaseUrl: null,
  footerTitle: "Kansagara Krish",
  footerBio: "Machine Learning Developer building useful products with Python and practical problem solving.",
};

// Projects
const projects: ProjectDTO[] = [
  {
    id: "project-conference-chatbot-management-system",
    title: "Conference Chatbot Management System",
    slug: "conference-chatbot-management-system",
    description:
      "A production-ready event platform with AI image generation, real-time chat, WhatsApp messaging, and admin controls for conference engagement.",
    content:
      "Built for seamless attendee engagement with AI-powered image generation, real-time communication, WhatsApp automation, and analytics-driven administration.",
    subtitle: "AI-powered event platform",
    role: "IT Developer Intern",
    client: "Ganpat University",
    category: "AI & Event Management",
    timeline: "Current",
    year: null,
    problem:
      "Manage attendee communication, image delivery, and event coordination without fragmented manual workflows.",
    solution:
      "Combine AI image generation, real-time chat, WhatsApp Cloud API, and centralized admin tools in one system.",
    impact:
      "Improved attendee engagement, automated image distribution, and provided clear visibility into event activity.",
    features: [
      "AI image generation",
      "Real-time chat",
      "WhatsApp Cloud API",
      "Role-based access",
      "Analytics dashboard",
      "Email automation",
    ],
    outcomes: [
      "Faster attendee communication",
      "Automated media delivery",
      "Centralized conference operations",
    ],
    techStack: [
      "Google Gemini API",
      "Google Drive API",
      "WhatsApp Cloud API",
      "Google OAuth",
      "SMTP",
      "SendGrid",
      "Mailgun",
      "AWS SES",
      "JWT",
      "CSRF",
    ],
    liveUrl: null,
    githubUrl: null,
    imageUrl: "/projects/resume-scanner-thumb.jpg",
    galleryImages: [],
    projectLinks: [],
    featured: true,
    status: "completed",
    createdAt: "2026-06-02T00:00:00.000Z",
    updatedAt: "2026-06-02T00:00:00.000Z",
    tags: ["Conference", "AI", "Chatbot", "WhatsApp"],
    seoTitle: "Conference Chatbot Management System",
    seoDescription:
      "A conference management platform with AI image generation, real-time chat, WhatsApp automation, and analytics.",
    seoKeywords: "conference chatbot, event management, WhatsApp Cloud API, Google Gemini, AI image generation",
  },
  {
    id: "project-ai-hr-copilot",
    title: "AI HR Copilot",
    slug: "ai-hr-copilot",
    description:
      "An AI-powered HR application with resume ranking, candidate comparison, chatbot-style queries, and automated resume workflows.",
    content:
      "Developed a ChatGPT-style HR copilot for resume ranking, candidate comparison, email ingestion, secure storage, and local LLM support.",
    subtitle: "AI-powered HR workflow assistant",
    role: "IT Developer Intern",
    client: "Ganpat University",
    category: "AI & HR Tech",
    timeline: "Current",
    year: null,
    problem: "Make resume screening, candidate comparison, and HR workflows faster and more structured.",
    solution:
      "Use chat-based AI, multiple NLP ranking models, Gmail and Drive integrations, and a modern dashboard to support HR review.",
    impact: "Reduced manual screening effort and made candidate comparison more transparent and actionable.",
    features: [
      "ChatGPT-style interface",
      "Resume ranking models",
      "Candidate comparison",
      "Gmail API integration",
      "Google Drive storage",
      "Local LLM support",
    ],
    outcomes: ["Structured resume scoring", "Automated resume intake", "Modern HR dashboards"],
    techStack: [
      "Next.js 14",
      "Tailwind CSS",
      "ShadCN UI",
      "FastAPI",
      "PostgreSQL",
      "Prisma ORM",
      "BERT",
      "TF-IDF",
      "Docker",
      "Ollama",
      "Gmail API",
      "Google Drive API",
    ],
    liveUrl: null,
    githubUrl: null,
    imageUrl: "/projects/convergence-thumb.jpg",
    galleryImages: [],
    projectLinks: [],
    featured: true,
    status: "completed",
    createdAt: "2026-06-02T00:00:00.000Z",
    updatedAt: "2026-06-02T00:00:00.000Z",
    tags: ["AI", "HR", "Resume Ranking", "FastAPI"],
    seoTitle: "AI HR Copilot",
    seoDescription: "An AI HR application for resume ranking, candidate comparison, and automated HR workflows.",
    seoKeywords: "AI HR copilot, resume ranking, candidate comparison, FastAPI, Next.js",
  },
  {
    id: "project-home-theater",
    title: "Home Theater Management System",
    slug: "home-theater-management",
    description:
      "A responsive web platform that streamlines the design and construction of custom home theater projects with acoustic tools and secure workflows.",
    content:
      "Integrated acoustic calculators, role-based access, and project management features for reliable execution.",
    subtitle: "Company project",
    role: "Full-stack Developer",
    client: "Company",
    category: "Product",
    timeline: "2026",
    year: "2026",
    problem:
      "Coordinate design, measurements, and construction data while ensuring accurate acoustics and secure client data.",
    solution:
      "Provide role-based access control, integrated acoustic calculators, and secure project management flows.",
    impact: "Reduced design errors, faster client handoffs, and reliable measurement-driven outcomes.",
    features: ["Acoustic calculators", "Role-based access", "Project management", "Secure data handling"],
    outcomes: ["Accurate measurements", "Organized execution"],
    techStack: ["HTML", "CSS", "JavaScript", "PHP"],
    liveUrl: null,
    githubUrl: null,
    imageUrl: "/projects/home-theater-thumb.jpg",
    galleryImages: [],
    projectLinks: [],
    featured: true,
    status: "completed",
    createdAt: "2026-05-10T00:00:00.000Z",
    updatedAt: "2026-05-10T00:00:00.000Z",
    tags: ["Home Theater", "Acoustics", "PHP", "JS"],
    seoTitle: "Home Theater Management System",
    seoDescription:
      "A platform for designing and managing custom home theater builds with acoustic tools and secure project workflows.",
    seoKeywords: "home theater, acoustics, PHP, JavaScript, project management",
  },

  {
    id: "project-aura",
    title: "Aura – Personal AI Assistant",
    slug: "aura-personal-ai",
    description:
      "An AI-powered assistant that automates daily system tasks and controls laptop functions via voice and text.",
    content: "Automation workflows, voice/text integration, and intelligent task orchestration for hands-free productivity.",
    subtitle: "Self-made project",
    role: "Lead Developer",
    client: "Self",
    category: "AI & Automation",
    timeline: "2026",
    year: "2026",
    problem: "Streamline repetitive tasks and enable voice-controlled automation on user devices.",
    solution: "Combine Python automation tooling with AI-driven intent parsing to execute complex workflows securely.",
    impact: "Saved time and reduced manual steps through intelligent automation and voice control.",
    features: ["Voice control", "Workflow automation", "Secure execution"],
    outcomes: ["Increased productivity", "Hands-free device management"],
    techStack: ["Python", "AI & ML", "Automation"],
    liveUrl: null,
    githubUrl: null,
    imageUrl: "/projects/aura-thumb.png",
    galleryImages: [],
    projectLinks: [],
    featured: false,
    status: "completed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["AI", "Automation", "Python"],
    seoTitle: "Aura — Personal AI Assistant",
    seoDescription:
      "An AI assistant for automating system tasks and controlling laptop functions via voice and text.",
    seoKeywords: "automation, ai assistant, python, voice control",
  },

  {
    id: "project-salary-prediction",
    title: "Salary Prediction",
    slug: "salary-prediction",
    description:
      "Comparative ML analysis using Linear Regression and Random Forest to predict employee salaries.",
    content: "Exploratory data analysis, model training, and comparative evaluation with visualization.",
    subtitle: "ML analysis",
    role: "Data Scientist",
    client: "Self",
    category: "Machine Learning",
    timeline: "2026",
    year: "2026",
    problem: "Predict salaries from complex datasets and provide data-driven insights.",
    solution: "Train and compare Linear Regression and Random Forest models with rigorous evaluation.",
    impact: "Provided accurate salary insights and model comparison visualizations.",
    features: ["EDA", "Model comparison", "Visualizations"],
    outcomes: ["Improved insight", "Reproducible analysis"],
    techStack: ["Matplotlib", "Seaborn", "NumPy", "Pandas", "Python"],
    liveUrl: null,
    githubUrl: null,
    imageUrl: "/projects/salary-prediction-thumb.png",
    galleryImages: [],
    projectLinks: [],
    featured: false,
    status: "completed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["ML", "Data Science", "Visualization"],
    seoTitle: "Salary Prediction — ML Analysis",
    seoDescription: "Comparative ML models for predicting employee salaries with visual evaluation.",
    seoKeywords: "salary prediction, linear regression, random forest, seaborn",
  },

  {
    id: "project-krushiseva",
    title: "KrushiSeva – Smart Agriculture Platform",
    slug: "krushiseva-smart-agriculture",
    description:
      "A platform providing precise fertilizer and crop recommendations to improve soil health and yield.",
    content: "Data-driven recommendations, farmer-centric UI, and sustainable practice guidance.",
    subtitle: "SIH Hackathon",
    role: "Team Developer",
    client: "SIH Hackathon",
    category: "Agriculture",
    timeline: "2025",
    year: "2025",
    problem: "Support farmers with actionable recommendations for fertilizer and crop choices.",
    solution: "Leverage data insights and simple UI to deliver recommendations and promote sustainable farming.",
    impact: "Helped farmers make better decisions and improved accessibility to expert guidance.",
    features: ["Fertilizer recommendations", "Crop planning", "Farmer-friendly UI"],
    outcomes: ["Better yields", "Sustainable practices"],
    techStack: ["Python", "AI & ML", "Web"],
    liveUrl: null,
    githubUrl: null,
    imageUrl: "/projects/krushiseva-thumb.jpg",
    galleryImages: [],
    projectLinks: [],
    featured: false,
    status: "completed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ["Agriculture", "SIH", "Sustainability"],
    seoTitle: "KrushiSeva — Smart Agriculture",
    seoDescription: "A platform enabling farmers with fertilizer and crop recommendations for sustainable yield.",
    seoKeywords: "agriculture, fertilizer, SIH, krushiseva",
  },

  {
    id: "project-python-utility",
    title: "Python Utility",
    slug: "python-utility",
    description: "A small Python project focused on automation, testing, and clean output.",
    content: "A compact example project for script-based problem solving and reliable delivery.",
    subtitle: "Utility tool",
    role: "Python Developer",
    client: "Self-initiated",
    category: "Python",
    timeline: "2025",
    year: "2025",
    problem: "Automate a repetitive task with a testable script.",
    solution: "Use Python with focused logic and testing coverage.",
    impact: "Saved time and reduced manual steps.",
    features: ["Automation", "Testing", "Simple output"],
    outcomes: ["Less manual work"],
    techStack: ["Python", "C", "Testing"],
    liveUrl: null,
    githubUrl: null,
    imageUrl: null,
    galleryImages: [],
    projectLinks: [],
    featured: false,
    status: "completed",
    createdAt: "2025-07-10T00:00:00.000Z",
    updatedAt: "2025-07-11T00:00:00.000Z",
    tags: ["Python", "Testing", "Automation"],
    seoTitle: null,
    seoDescription: null,
    seoKeywords: null,
  },
];

// Blog posts
const blogPosts: BlogPostDTO[] = [
  {
    id: "blog-static-content",
    title: "Keeping a Portfolio Static and Maintainable",
    slug: "keeping-a-portfolio-static-and-maintainable",
    excerpt: "A quick note on replacing CMS data with simple local content.",
    content:
      "## Static content\n\nUse a single data module, keep entries small, and avoid server-only dependencies.",
    contentFormat: "mdx",
    coverImage: null,
    published: true,
    readingTime: 3,
    createdAt: "2026-05-08T00:00:00.000Z",
    updatedAt: "2026-05-08T00:00:00.000Z",
    tags: ["Next.js", "Static Site"],
    seoTitle: "Static Portfolio Content",
    seoDescription: "How to keep a portfolio simple and frontend-only.",
    seoKeywords: "static site, nextjs, portfolio",
  },
  {
    id: "blog-motion",
    title: "Using Motion Without Losing Clarity",
    slug: "using-motion-without-losing-clarity",
    excerpt: "Why motion should support hierarchy instead of competing with it.",
    content: "Framer Motion works best when transitions help the layout breathe, not when they distract.",
    contentFormat: "mdx",
    coverImage: null,
    published: true,
    readingTime: 4,
    createdAt: "2026-04-22T00:00:00.000Z",
    updatedAt: "2026-04-22T00:00:00.000Z",
    tags: ["Framer Motion", "UI"],
    seoTitle: null,
    seoDescription: null,
    seoKeywords: null,
  },
  {
    id: "blog-dark-mode",
    title: "Designing Dark Mode That Still Reads Well",
    slug: "designing-dark-mode-that-still-reads-well",
    excerpt: "Simple contrast choices that keep a dark interface comfortable.",
    content: "Choose contrast deliberately, keep surfaces layered, and avoid over-saturating accents.",
    contentFormat: "mdx",
    coverImage: null,
    published: true,
    readingTime: 5,
    createdAt: "2026-03-15T00:00:00.000Z",
    updatedAt: "2026-03-15T00:00:00.000Z",
    tags: ["Design", "Accessibility"],
    seoTitle: null,
    seoDescription: null,
    seoKeywords: null,
  },
];

// Experiences
const experiences: ExperienceDTO[] = [
  {
    id: "exp-1",
    company: "Ganpat University",
    role: "IT Developer Intern",
    location: "Gujarat, Mehsana",
    type: "Internship",
    startDate: "2026-02-01T00:00:00.000Z",
    endDate: "2026-05-01T00:00:00.000Z",
    current: false,
    description:
      "Internship work focused on Python, machine learning, AI integrations, testing, and practical problem solving.",
    skills: ["Python", "Machine Learning", "AI Integration", "Testing", "Problem Solving"],
    logoUrl: null,
    order: 1,
    createdAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "exp-2",
    company: "Online Learning",
    role: "Machine Learning Course",
    location: "Remote",
    type: "Course",
    startDate: "2026-01-01T00:00:00.000Z",
    endDate: "2026-06-01T00:00:00.000Z",
    current: false,
    description:
      "Completed an online machine learning course with practical exercises, model evaluation, and applied ML workflows in June 2026.",
    skills: ["Python", "Machine Learning", "Model Evaluation"],
    logoUrl: null,
    order: 2,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "exp-3",
    company: "Hackathon Builds",
    role: "Team Leader",
    location: "Remote",
    type: "Hackathon",
    startDate: "2023-01-01T00:00:00.000Z",
    endDate: null,
    current: true,
    description: "Led hackathon builds with fast problem solving, team execution, and practical delivery.",
    skills: ["Problem Solving", "Testing", "Accessibility"],
    logoUrl: null,
    order: 3,
    createdAt: "2023-01-01T00:00:00.000Z",
  },
];

// Skills
const skills: SkillDTO[] = [
  { id: "skill-python", name: "Python", category: "Language", iconUrl: null, order: 1 },
  { id: "skill-ml", name: "Machine Learning", category: "AI", iconUrl: null, order: 2 },
  { id: "skill-nextjs", name: "Next.js", category: "Frontend", iconUrl: null, order: 3 },
  { id: "skill-fastapi", name: "FastAPI", category: "Backend", iconUrl: null, order: 4 },
  { id: "skill-postgresql", name: "PostgreSQL", category: "Database", iconUrl: null, order: 5 },
  { id: "skill-ai", name: "AI & ML", category: "AI", iconUrl: null, order: 6 },
  { id: "skill-c", name: "C", category: "Language", iconUrl: null, order: 7 },
  { id: "skill-problem-solving", name: "Problem Solving", category: "Thinking", iconUrl: null, order: 8 },
  { id: "skill-testing", name: "Testing", category: "Quality", iconUrl: null, order: 9 },
  { id: "skill-numpy", name: "NumPy", category: "Library", iconUrl: null, order: 10 },
  { id: "skill-pandas", name: "Pandas", category: "Library", iconUrl: null, order: 11 },
  { id: "skill-matplotlib", name: "Matplotlib", category: "Library", iconUrl: null, order: 12 },
  { id: "skill-seaborn", name: "Seaborn", category: "Library", iconUrl: null, order: 13 },
  { id: "skill-bert", name: "BERT", category: "NLP", iconUrl: null, order: 14 },
  { id: "skill-tfidf", name: "TF-IDF", category: "NLP", iconUrl: null, order: 15 },
  { id: "skill-gemini", name: "Google Gemini API", category: "AI Integration", iconUrl: null, order: 16 },
  { id: "skill-whatsapp", name: "WhatsApp Cloud API", category: "Integration", iconUrl: null, order: 17 },
  { id: "skill-drive", name: "Google Drive API", category: "Integration", iconUrl: null, order: 18 },
  { id: "skill-gmail", name: "Gmail API", category: "Integration", iconUrl: null, order: 19 },
  { id: "skill-auth", name: "Google OAuth", category: "Authentication", iconUrl: null, order: 20 },
  { id: "skill-docker", name: "Docker", category: "DevOps", iconUrl: null, order: 21 },
  { id: "skill-ollama", name: "Ollama", category: "AI Tooling", iconUrl: null, order: 22 },
  { id: "skill-automation", name: "Automation", category: "Tooling", iconUrl: null, order: 23 },
  { id: "skill-tailwind", name: "Tailwind CSS", category: "Styling", iconUrl: null, order: 24 },
  { id: "skill-shadcn", name: "ShadCN UI", category: "Styling", iconUrl: null, order: 25 },
  { id: "skill-ui", name: "UI Design", category: "Design", iconUrl: null, order: 26 },
  { id: "skill-accessibility", name: "Accessibility", category: "Quality", iconUrl: null, order: 27 },
  { id: "skill-security", name: "Security", category: "Engineering", iconUrl: null, order: 28 },
];

// Services
const services: ServiceDTO[] = [
  {
    id: "service-1",
    title: "Python",
    description: "General-purpose scripting and problem solving.",
    icon: null,
    order: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "service-2",
    title: "Machine Learning",
    description: "Model building, evaluation, and practical delivery.",
    icon: null,
    order: 2,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "service-3",
    title: "C",
    description: "Low-level programming and structured logic.",
    icon: null,
    order: 3,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "service-4",
    title: "Testing",
    description: "Reliable checks and quality-focused delivery.",
    icon: null,
    order: 4,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "service-5",
    title: "Problem Solving",
    description: "Breaking down requirements into practical solutions.",
    icon: null,
    order: 5,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "service-6",
    title: "UI Design",
    description: "Clear interfaces and structured presentation.",
    icon: null,
    order: 6,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "service-7",
    title: "Accessibility",
    description: "Inclusive interfaces with better usability for everyone.",
    icon: null,
    order: 7,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

// Education
const education: EducationDTO[] = [
  {
    id: "edu-1",
    slug: "ganpat-university",
    institution: "Ganpat University",
    degree: "Computer Engineering",
    field: "Engineering",
    startYear: "2023",
    endYear: "2027",
    current: true,
    description: "Studying Computer Engineering with a focus on programming, machine learning, testing, and engineering problem solving.",
    gpa: null,
    location: "Mehsana, Gujarat",
    order: 1,
    createdAt: "2021-08-01T00:00:00.000Z",
  },
  {
    id: "edu-2",
    slug: "frontend-cert",
    institution: "Online Learning",
    degree: "Frontend Specialization",
    field: "Web Development",
    startYear: "2024",
    endYear: null,
    current: true,
    description: "Focused on hands-on work in Python, machine learning, and applied problem solving.",
    gpa: null,
    location: "Remote",
    order: 2,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
];

// Empty arrays for items not used right now
const hackathons: HackathonDTO[] = [];
const certifications: CertificationDTO[] = [
  {
    id: "cert-ml-internship-launched-global",
    slug: "machine-learning-internship-launched-global",
    name: "Machine Learning Internship",
    issuer: "LaunchED Global",
    date: "2025-08-01T00:00:00.000Z",
    url: "https://launched.global",
    credentialId: null,
    image: "/certifications/machine-learning-internship-launched-global.jpg",
    createdAt: "2025-08-01T00:00:00.000Z",
  },
  {
    id: "cert-beat-audio-web-development",
    slug: "beat-audio-web-development",
    name: "Beat Audio Web Development Certificate",
    issuer: "Beat Audio",
    date: "2025-07-01T00:00:00.000Z",
    url: null,
    credentialId: null,
    image: "/certifications/google-web-development-project.jpg",
    createdAt: "2025-07-01T00:00:00.000Z",
  },
  {
    id: "cert-ibm-ai-agents",
    slug: "ibm-ai-agents",
    name: "IBM AI Agents",
    issuer: "IBM",
    date: "2023-11-01T00:00:00.000Z",
    url: "https://www.ibm.com",
    credentialId: null,
    image: "/certifications/ibm-ai-agents.jpg",
    createdAt: "2023-11-01T00:00:00.000Z",
  },
  {
    id: "cert-wie-hackx2025-participation",
    slug: "wie-hackx2025-participation",
    name: "WIE HackX2025 Participation",
    issuer: "Nirma University",
    date: "2025-10-01T00:00:00.000Z",
    url: "https://www.nirmauni.ac.in",
    credentialId: null,
    image: "/certifications/wie-hackx2025-participation.jpg",
    createdAt: "2025-10-01T00:00:00.000Z",
  },
  {
    id: "cert-sih-hackathon-participation",
    slug: "sih-hackathon-participation",
    name: "SIH Hackathon Participation",
    issuer: "Ganpat University",
    date: "2024-01-01T00:00:00.000Z",
    url: "https://www.ganpatuniversity.ac.in",
    credentialId: null,
    image: "/certifications/sih-hackathon-participation.jpg",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "cert-ai-symposium-2024",
    slug: "ai-symposium-2024-participation",
    name: "AI Symposium Participation",
    issuer: "Ganpat University",
    date: "2024-10-01T00:00:00.000Z",
    url: "https://www.ganpatuniversity.ac.in",
    credentialId: null,
    image: "/certifications/ai-symposium-2024-participation.jpg",
    createdAt: "2024-10-01T00:00:00.000Z",
  },
  {
    id: "cert-convergence-2024-coordinator",
    slug: "convergence-2024-coordinator",
    name: "Convergence 2024 Coordinator",
    issuer: "Ganpat University",
    date: "2024-03-01T00:00:00.000Z",
    url: "https://www.ganpatuniversity.ac.in",
    credentialId: null,
    image: "/certifications/convergence-2024-coordinator.jpg",
    createdAt: "2024-03-01T00:00:00.000Z",
  },
  {
    id: "cert-india-ai-impact-buildathon-2026",
    slug: "india-ai-impact-buildathon-2026-participant",
    name: "India AI Impact Buildathon Participant",
    issuer: "India AI Impact Summit 2026",
    date: "2026-05-01T00:00:00.000Z",
    url: "https://indiaai.gov.in",
    credentialId: null,
    image: "/certifications/india-ai-impact-buildathon-2026-participant.jpg",
    createdAt: "2026-05-01T00:00:00.000Z",
  },
  {
    id: "cert-odoo-adani-university-hackathon-2026",
    slug: "odoo-adani-university-hackathon-2026-participant",
    name: "Odoo × Adani University Hackathon ’26 Participant",
    issuer: "Odoo × Adani University",
    date: "2026-03-01T00:00:00.000Z",
    url: "https://www.odoo.com",
    credentialId: null,
    image: "/certifications/odoo-adani-university-hackathon-2026-participant.jpg",
    createdAt: "2026-03-01T00:00:00.000Z",
  },
  {
    id: "cert-canhack-2026-team-participant",
    slug: "canhack-2026-team-participant",
    name: "CanHack 2026 Team Participant",
    issuer: "University of Canberra",
    date: "2026-02-01T00:00:00.000Z",
    url: "https://www.canberra.edu.au",
    credentialId: null,
    image: "/certifications/canhack-2026-team-participant.jpg",
    createdAt: "2026-02-01T00:00:00.000Z",
  },
];

// Cached getters
export const getSiteSettings = cache(async (): Promise<SiteSettingsDTO | null> => {
  return siteSettings;
});

export const getProjects = cache(async (): Promise<ProjectDTO[]> => {
  return projects;
});

export const getAllProjectSlugs = cache(async (): Promise<string[]> => {
  return projects.map((project) => project.slug);
});

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectDTO | null> => {
  return projects.find((project) => project.slug === slug) ?? null;
});

export const getBlogPosts = cache(async (): Promise<BlogPostDTO[]> => {
  return blogPosts;
});

export const getAllBlogPostSlugs = cache(async (): Promise<string[]> => {
  return blogPosts.map((post) => post.slug);
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPostDTO | null> => {
  return blogPosts.find((post) => post.slug === slug) ?? null;
});

export const getExperiences = cache(async (): Promise<ExperienceDTO[]> => {
  return experiences;
});

export const getSkills = cache(async (): Promise<SkillDTO[]> => {
  return skills;
});

export const getServices = cache(async (): Promise<ServiceDTO[]> => {
  return services;
});

export const getEducation = cache(async (): Promise<EducationDTO[]> => {
  return education;
});

export const getHackathons = cache(async (): Promise<HackathonDTO[]> => {
  return hackathons;
});

export const getCertifications = cache(async (): Promise<CertificationDTO[]> => {
  return certifications;
});

export const getAllCertificationSlugs = cache(async (): Promise<string[]> => {
  return certifications.map((cert) => cert.slug);
});

export const getCertificationBySlug = cache(async (slug: string): Promise<CertificationDTO | null> => {
  return certifications.find((cert) => cert.slug === slug) ?? null;
});
