import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
    },
  });
  console.log('Created admin user:', admin.email);

  // Create default settings
  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      name: 'Pratham Rajbhar',
      title: 'Full Stack Developer',
      bio: 'Passionate developer with expertise in building modern web applications using React, Next.js, Node.js, and PostgreSQL. I love creating efficient, scalable solutions and exploring new technologies.',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      github: 'https://github.com/prathamrajbhar',
      linkedin: 'https://linkedin.com/in/prathamrajbhar',
      twitter: 'https://twitter.com/prathamrajbhar',
      heroTagline: 'Building the future, one line of code at a time',
      openToWork: true,
    },
  });
  console.log('Created default settings');

  // Create comprehensive skills
  const skills = [
    { name: 'TypeScript', category: 'Frontend', order: 1 },
    { name: 'JavaScript', category: 'Frontend', order: 2 },
    { name: 'React', category: 'Frontend', order: 3 },
    { name: 'Next.js', category: 'Frontend', order: 4 },
    { name: 'Vue.js', category: 'Frontend', order: 5 },
    { name: 'Node.js', category: 'Backend', order: 6 },
    { name: 'Express', category: 'Backend', order: 7 },
    { name: 'NestJS', category: 'Backend', order: 8 },
    { name: 'PostgreSQL', category: 'Database', order: 9 },
    { name: 'MongoDB', category: 'Database', order: 10 },
    { name: 'Prisma', category: 'Backend', order: 11 },
    { name: 'Tailwind CSS', category: 'Frontend', order: 12 },
    { name: 'CSS3', category: 'Frontend', order: 13 },
    { name: 'HTML5', category: 'Frontend', order: 14 },
    { name: 'Git', category: 'Tools', order: 15 },
    { name: 'Docker', category: 'DevOps', order: 16 },
    { name: 'AWS', category: 'DevOps', order: 17 },
    { name: 'REST APIs', category: 'Backend', order: 18 },
    { name: 'GraphQL', category: 'Backend', order: 19 },
    { name: 'Testing', category: 'Tools', order: 20 },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { id: skill.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: skill,
    });
  }
  console.log('Created sample skills');

  // Create comprehensive experience
  const experiences = [
    {
      id: 'exp-1',
      company: 'Tech Innovations Inc',
      role: 'Senior Full Stack Developer',
      location: 'San Francisco, CA',
      type: 'full-time',
      startDate: new Date('2023-06-01'),
      current: true,
      description: 'Leading a team of 5 developers to build scalable web applications. Implemented microservices architecture and improved system performance by 40%. Mentoring junior developers and conducting code reviews.',
      skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
      order: 1,
    },
    {
      id: 'exp-2',
      company: 'Digital Solutions LLC',
      role: 'Full Stack Developer',
      location: 'Remote',
      type: 'full-time',
      startDate: new Date('2021-03-01'),
      endDate: new Date('2023-05-31'),
      current: false,
      description: 'Developed and maintained multiple client-facing applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions on time.',
      skills: ['JavaScript', 'React', 'Express', 'MongoDB', 'Git'],
      order: 2,
    },
    {
      id: 'exp-3',
      company: 'StartUp Hub',
      role: 'Junior Developer',
      location: 'New York, NY',
      type: 'full-time',
      startDate: new Date('2019-07-01'),
      endDate: new Date('2021-02-28'),
      current: false,
      description: 'Built responsive web applications and APIs using modern JavaScript frameworks. Participated in agile development processes and contributed to project planning.',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'Vue.js', 'Node.js'],
      order: 3,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.upsert({
      where: { id: exp.id },
      update: {},
      create: exp,
    });
  }
  console.log('Created sample experience');

  // Create comprehensive certifications
  const certifications = [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: new Date('2023-09-15'),
      url: 'https://aws.amazon.com/certification/',
      credentialId: 'AWS-SA-2023',
    },
    {
      id: 'cert-2',
      name: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Meta',
      date: new Date('2022-11-20'),
      url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    },
    {
      id: 'cert-3',
      name: 'Google Cloud Professional Developer',
      issuer: 'Google Cloud',
      date: new Date('2022-08-10'),
      url: 'https://cloud.google.com/certification/cloud-developer',
    },
    {
      id: 'cert-4',
      name: 'MongoDB Certified Developer',
      issuer: 'MongoDB',
      date: new Date('2022-03-15'),
      url: 'https://www.mongodb.com/docs/manual/administration/developer-certification/',
    },
  ];

  for (const cert of certifications) {
    await prisma.certification.upsert({
      where: { id: cert.id },
      update: {},
      create: cert,
    });
  }
  console.log('Created sample certifications');

  // Create comprehensive hackathons
  const hackathons = [
    {
      id: 'hack-1',
      title: 'Global Tech Hackathon 2023',
      project: 'AI-Powered Task Manager',
      role: 'Full Stack Developer',
      date: new Date('2023-10-15'),
      location: 'San Francisco, CA',
      result: '2nd Place',
      link: 'https://devpost.com/',
      description: 'Built an AI-powered task management application using OpenAI API, React, and Node.js. The app uses natural language processing to categorize and prioritize tasks automatically.',
    },
    {
      id: 'hack-2',
      title: 'EcoHack 2023',
      project: 'Carbon Footprint Tracker',
      role: 'Frontend Developer',
      date: new Date('2023-04-20'),
      location: 'Virtual',
      result: 'Winner',
      link: 'https://devpost.com/',
      description: 'Developed a web application to track and visualize carbon footprint using real-time data. Implemented interactive charts and gamification features to encourage eco-friendly behavior.',
    },
    {
      id: 'hack-3',
      title: 'FinTech Innovation Challenge',
      project: 'Personal Finance Dashboard',
      role: 'Team Lead',
      date: new Date('2022-11-10'),
      location: 'New York, NY',
      result: 'Finalist',
      link: 'https://devpost.com/',
      description: 'Led a team of 4 to build a comprehensive personal finance dashboard with budget tracking, investment analysis, and financial goal setting features.',
    },
  ];

  for (const hack of hackathons) {
    await prisma.hackathon.upsert({
      where: { id: hack.id },
      update: {},
      create: hack,
    });
  }
  console.log('Created sample hackathons');

  // Create comprehensive blog posts
  const blogPosts = [
    {
      id: 'blog-1',
      title: 'Getting Started with Next.js 15 and Prisma 7',
      slug: 'getting-started-with-nextjs-15-and-prisma-7',
      excerpt: 'A comprehensive guide to setting up a modern web application with the latest versions of Next.js and Prisma.',
      content: '# Getting Started with Next.js 15 and Prisma 7\n\nIn this tutorial, we will explore how to build a modern web application using Next.js 15 and Prisma 7. These latest versions bring significant improvements in performance and developer experience.\n\n## Prerequisites\n\n- Node.js 20+\n- Basic knowledge of React and TypeScript\n- PostgreSQL database\n\n## Setting Up the Project\n\nFirst, create a new Next.js project using the CLI:\n\n```bash\nnpx create-next-app@latest my-app\n```\n\n## Installing Prisma\n\nInstall Prisma and the PostgreSQL adapter:\n\n```bash\nnpm install @prisma/client @prisma/adapter-pg\nnpm install -D prisma\n```\n\n## Conclusion\n\nThis setup provides a solid foundation for building scalable web applications with modern tools.',
      contentFormat: 'mdx',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      published: true,
      readingTime: 8,
      tags: [{ id: 'nextjs', name: 'Next.js' }, { id: 'prisma', name: 'Prisma' }, { id: 'typescript', name: 'TypeScript' }, { id: 'tutorial', name: 'Tutorial' }],
    },
    {
      id: 'blog-2',
      title: 'Building Scalable APIs with Node.js and Express',
      slug: 'building-scalable-apis-with-nodejs-and-express',
      excerpt: 'Learn best practices for building production-ready APIs that can handle high traffic and maintain code quality.',
      content: '# Building Scalable APIs with Node.js and Express\n\nBuilding scalable APIs requires careful consideration of architecture, performance, and maintainability. In this article, we will explore key principles and patterns for creating robust API services.\n\n## Architecture Patterns\n\n### Layered Architecture\n\nSeparate your application into distinct layers:\n- Controllers: Handle HTTP requests\n- Services: Business logic\n- Repositories: Data access\n\n## Performance Optimization\n\n### Caching Strategies\n\nImplement caching at multiple levels:\n- Application-level caching\n- Database query caching\n- CDN for static assets\n\n## Security Best Practices\n\nAlways validate input and implement proper authentication and authorization.',
      contentFormat: 'mdx',
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
      published: true,
      readingTime: 12,
      tags: [{ id: 'nodejs', name: 'Node.js' }, { id: 'express', name: 'Express' }, { id: 'api', name: 'API' }, { id: 'architecture', name: 'Architecture' }],
    },
    {
      id: 'blog-3',
      title: 'Mastering TypeScript: Advanced Patterns',
      slug: 'mastering-typescript-advanced-patterns',
      excerpt: 'Deep dive into advanced TypeScript patterns that will help you write more maintainable and type-safe code.',
      content: '# Mastering TypeScript: Advanced Patterns\n\nTypeScript offers powerful features that go beyond basic type checking. Let us explore some advanced patterns that can significantly improve your code quality.\n\n## Generic Types\n\nGenerics allow you to create reusable components:\n\n```typescript\nfunction identity<T>(arg: T): T {\n  return arg;\n}\n```\n\n## Utility Types\n\nTypeScript provides built-in utility types:\n- Partial<T>\n- Required<T>\n- Readonly<T>\n- Pick<T, K>\n\n## Conditional Types\n\nCreate types that depend on other types:\n\n```typescript\ntype NonNullable<T> = T extends null | undefined ? never : T;\n```',
      contentFormat: 'mdx',
      coverImage: 'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759',
      published: true,
      readingTime: 15,
      tags: [{ id: 'typescript', name: 'TypeScript' }, { id: 'advanced', name: 'Advanced' }, { id: 'patterns', name: 'Patterns' }],
    },
    {
      id: 'blog-4',
      title: 'Introduction to Microservices Architecture',
      slug: 'introduction-to-microservices-architecture',
      excerpt: 'Understanding the fundamentals of microservices and when to use them in your applications.',
      content: '# Introduction to Microservices Architecture\n\nMicroservices architecture has become a popular approach for building complex applications. This guide will help you understand the core concepts and decide if it is right for your project.\n\n## What are Microservices?\n\nMicroservices are an architectural style that structures an application as a collection of loosely coupled services.\n\n## Benefits\n\n- Independent deployment\n- Technology diversity\n- Scalability\n- Fault isolation\n\n## Challenges\n\n- Increased complexity\n- Distributed system debugging\n- Data consistency\n\n## When to Use\n\nConsider microservices when:\n- You need independent scaling\n- Multiple teams work on different parts\n- You require technology diversity',
      contentFormat: 'mdx',
      coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
      published: false,
      readingTime: 10,
      tags: [{ id: 'architecture', name: 'Architecture' }, { id: 'microservices', name: 'Microservices' }, { id: 'design', name: 'Design' }],
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { id: post.id },
      update: {},
      create: post,
    });
  }
  console.log('Created sample blog posts');

  // Create comprehensive projects
  const projects = [
    {
      id: 'proj-1',
      title: 'E-Commerce Platform',
      slug: 'e-commerce-platform',
      description: 'A full-featured e-commerce platform with real-time inventory management, payment processing, and order tracking.',
      content: '# E-Commerce Platform\n\nA comprehensive e-commerce solution built with modern technologies.',
      subtitle: 'Modern Shopping Experience',
      role: 'Lead Developer',
      client: 'Retail Co',
      category: 'Web Application',
      timeline: '6 months',
      year: '2023',
      problem: 'The client needed a scalable e-commerce solution that could handle high traffic during peak seasons while maintaining excellent performance and user experience.',
      solution: 'Built a microservices-based architecture with Next.js frontend and Node.js backend. Implemented Redis caching, CDN integration, and database sharding for optimal performance.',
      impact: 'Increased sales by 40% and improved page load times by 60%. System can now handle 10x more concurrent users.',
      features: ['Real-time inventory', 'Multi-payment support', 'Advanced search', 'Analytics dashboard', 'Mobile-responsive design'],
      outcomes: ['40% increase in sales', '60% faster page loads', '10x scalability', '99.9% uptime'],
      techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe', 'AWS'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/prathamrajbhar/ecommerce',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      galleryImages: [
        'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d',
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3',
      ],
      projectLinks: [
        { title: 'Live Demo', url: 'https://example.com' },
        { title: 'Case Study', url: 'https://example.com/case-study' },
      ],
      featured: true,
      status: 'completed',
      tags: ['E-Commerce', 'Full Stack', 'Scalability'],
    },
    {
      id: 'proj-2',
      title: 'Task Management App',
      slug: 'task-management-app',
      description: 'A collaborative task management application with real-time updates, team collaboration features, and advanced project tracking.',
      content: '# Task Management App\n\nA modern solution for team productivity and project management.',
      subtitle: 'Team Productivity Solution',
      role: 'Full Stack Developer',
      client: 'Tech Startup',
      category: 'SaaS',
      timeline: '4 months',
      year: '2022',
      problem: 'Teams were struggling with project coordination and needed a unified platform to manage tasks, deadlines, and team communication.',
      solution: 'Developed a real-time task management system using WebSocket connections, drag-and-drop interfaces, and comprehensive reporting features.',
      impact: 'Improved team productivity by 35% and reduced project delivery time by 25%.',
      features: ['Real-time collaboration', 'Drag-and-drop interface', 'Time tracking', 'Gantt charts', 'Team analytics'],
      outcomes: ['35% productivity increase', '25% faster delivery', '95% user adoption'],
      techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Material-UI'],
      liveUrl: 'https://taskapp.example.com',
      githubUrl: 'https://github.com/prathamrajbhar/taskapp',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
      galleryImages: [
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
        'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b',
      ],
      projectLinks: [
        { title: 'Live Demo', url: 'https://taskapp.example.com' },
      ],
      featured: true,
      status: 'completed',
      tags: [{ id: 'saas', name: 'SaaS' }, { id: 'realtime', name: 'Real-time' }, { id: 'productivity', name: 'Productivity' }],
    },
    {
      id: 'proj-3',
      title: 'Healthcare Dashboard',
      slug: 'healthcare-dashboard',
      description: 'A secure healthcare dashboard for patient management, appointment scheduling, and medical record tracking with HIPAA compliance.',
      content: '# Healthcare Dashboard\n\nA secure and compliant healthcare management system.',
      subtitle: 'Healthcare Management System',
      role: 'Senior Developer',
      client: 'Health Tech Inc',
      category: 'Healthcare',
      timeline: '8 months',
      year: '2023',
      problem: 'Healthcare providers needed a secure, compliant system to manage patient data, appointments, and medical records efficiently.',
      solution: 'Built a HIPAA-compliant dashboard with end-to-end encryption, role-based access control, and comprehensive audit logging.',
      impact: 'Reduced administrative time by 50% and improved patient satisfaction scores by 30%.',
      features: ['Patient management', 'Appointment scheduling', 'Medical records', 'Secure messaging', 'Analytics'],
      outcomes: ['50% time reduction', '30% satisfaction increase', '100% HIPAA compliance'],
      techStack: ['Next.js', 'Python', 'PostgreSQL', 'AWS', 'Docker'],
      liveUrl: 'https://health.example.com',
      githubUrl: null,
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
      galleryImages: [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        'https://images.unsplash.com/photo-1504813184591-01572f98c85f',
      ],
      projectLinks: [],
      featured: false,
      status: 'completed',
      tags: [{ id: 'healthcare', name: 'Healthcare' }, { id: 'security', name: 'Security' }, { id: 'compliance', name: 'Compliance' }],
    },
    {
      id: 'proj-4',
      title: 'Social Media Analytics',
      slug: 'social-media-analytics',
      description: 'An analytics platform that aggregates social media data from multiple platforms and provides actionable insights through visualizations.',
      content: '# Social Media Analytics\n\nComprehensive social media data analysis and visualization platform.',
      subtitle: 'Social Intelligence Platform',
      role: 'Full Stack Developer',
      client: 'Marketing Agency',
      category: 'Analytics',
      timeline: '5 months',
      year: '2022',
      problem: 'Marketing teams needed a unified platform to analyze social media performance across multiple platforms without manual data aggregation.',
      solution: 'Created an automated data pipeline that fetches data from social media APIs, processes it, and presents insights through interactive dashboards.',
      impact: 'Reduced reporting time by 80% and improved campaign optimization by 45%.',
      features: ['Multi-platform integration', 'Real-time analytics', 'Custom dashboards', 'Automated reports', 'Trend analysis'],
      outcomes: ['80% faster reporting', '45% better optimization', '500+ active users'],
      techStack: ['React', 'Python', 'PostgreSQL', 'Redis', 'Chart.js'],
      liveUrl: null,
      githubUrl: 'https://github.com/prathamrajbhar/social-analytics',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      galleryImages: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      ],
      projectLinks: [
        { title: 'GitHub', url: 'https://github.com/prathamrajbhar/social-analytics' },
      ],
      featured: false,
      status: 'completed',
      tags: [{ id: 'analytics', name: 'Analytics' }, { id: 'dataviz', name: 'Data Visualization' }, { id: 'automation', name: 'Automation' }],
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: {},
      create: project,
    });
  }
  console.log('Created sample projects');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
