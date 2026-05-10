import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool, zodSchema } from 'ai';
import { z } from 'zod';

// Simple CoreMessage type matching the AI SDK's model-layer message format
type CoreMessage =
  | { role: 'user'; content: string }
  | { role: 'assistant'; content: string };

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Predefined schemas for different admin modules
const schemas = {
  experience: z.object({
    company: z.string().describe("The name of the company or organization"),
    role: z.string().describe("The job title or role"),
    location: z.string().optional().describe("Location of the job (e.g., San Francisco, CA or Remote)"),
    type: z.enum(["Full-time", "Part-time", "Contract", "Freelance", "Internship"]).optional().describe("Employment type"),
    startDate: z.string().describe("Start date in YYYY-MM-DD format"),
    endDate: z.string().optional().describe("End date in YYYY-MM-DD format. Omit if currently employed here."),
    current: z.boolean().describe("True if currently employed here, false otherwise"),
    description: z.string().describe("Detailed description of responsibilities and achievements"),
    skills: z.array(z.string()).describe("List of technologies or skills used"),
  }),
  projects: z.object({
    title: z.string().describe("Project title"),
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
    tags: z.array(z.string()).optional().describe("General tags for the project"),
  }),
  blog: z.object({
    title: z.string().describe("Blog post title"),
    excerpt: z.string().describe("Short summary of the post"),
    content: z.string().describe("Full content of the blog post, preferably in Markdown format"),
    tags: z.array(z.string()).describe("List of relevant tags"),
    published: z.boolean().describe("Whether the post should be published immediately"),
  }),
  certifications: z.object({
    name: z.string().describe("Name of the certification"),
    issuer: z.string().describe("Organization that issued the certification"),
    date: z.string().describe("Date issued in YYYY-MM-DD format"),
    credentialId: z.string().optional().describe("Credential ID"),
    url: z.string().optional().describe("Verification URL"),
  }),
  hackathons: z.object({
    title: z.string().describe("Name of the hackathon"),
    project: z.string().describe("Name of the project built"),
    role: z.string().optional().describe("Role played in the team"),
    date: z.string().describe("Date of the event in YYYY-MM-DD format"),
    location: z.string().optional().describe("Location of the event"),
    result: z.string().optional().describe("Result or achievement (e.g., Winner, Finalist)"),
    link: z.string().optional().describe("URL to the project submission"),
    description: z.string().describe("Description of the project and experience"),
  }),
  education: z.object({
    institution: z.string().describe("Name of the school or university"),
    degree: z.string().describe("Degree obtained (e.g., Bachelor of Science)"),
    field: z.string().optional().describe("Field of study (e.g., Computer Science)"),
    startYear: z.string().describe("Start year (e.g., 2018)"),
    endYear: z.string().optional().describe("End year (e.g., 2022). Omit if currently studying."),
    current: z.boolean().describe("True if currently enrolled, false otherwise"),
    description: z.string().optional().describe("Academic description, coursework, honors"),
    gpa: z.string().optional().describe("GPA"),
    location: z.string().optional().describe("Location of the institution"),
  }),
  skills: z.object({
    name: z.string().describe("Name of the skill (e.g., React)"),
    category: z.string().describe("Category of the skill (e.g., Frontend, Backend)"),
  }),
};

/**
 * Converts incoming UIMessages (from the AI SDK React client) into CoreMessages
 * that streamText can accept directly, without relying on convertToModelMessages
 * which requires the strict UIMessage type with parts.
 */
function toCoreMessages(uiMessages: any[]): CoreMessage[] {
  const coreMessages: CoreMessage[] = [];

  for (const msg of uiMessages) {
    const role: string = msg.role;

    // Extract text content from the message, supporting both legacy string
    // content and the newer parts-based format from @ai-sdk/react v3+.
    let textContent = "";

    if (typeof msg.content === "string" && msg.content.trim()) {
      textContent = msg.content;
    } else if (Array.isArray(msg.parts)) {
      textContent = msg.parts
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.text as string)
        .join("\n");
    }

    // Skip messages with no extractable text (e.g. pure tool-result messages)
    if (!textContent.trim()) continue;

    if (role === "user") {
      coreMessages.push({ role: "user", content: textContent });
    } else if (role === "assistant") {
      coreMessages.push({ role: "assistant", content: textContent });
    }
    // Ignore system or tool roles — the system prompt is set separately.
  }

  return coreMessages;
}

export async function POST(req: Request) {
  const { messages, module } = await req.json();

  if (!process.env.OPENROUTER_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OpenRouter API key not configured." }),
      { status: 500 },
    );
  }

  if (!process.env.OPENROUTER_MODEL) {
    return new Response(
      JSON.stringify({ error: "OpenRouter model not configured in .env." }),
      { status: 500 },
    );
  }

  const moduleSchema = schemas[module as keyof typeof schemas];

  if (!moduleSchema) {
    return new Response(
      JSON.stringify({ error: "Invalid module specified." }),
      { status: 400 },
    );
  }

  if (!Array.isArray(messages)) {
    return new Response(
      JSON.stringify({ error: "Messages must be an array." }),
      { status: 400 },
    );
  }

  const coreMessages = toCoreMessages(messages);

  if (coreMessages.length === 0) {
    return new Response(
      JSON.stringify({ error: "No conversational content provided." }),
      { status: 400 },
    );
  }

  const result = await streamText({
    model: openrouter(process.env.OPENROUTER_MODEL!),
    system: `You are an intelligent data-entry assistant. Your goal is to extract information from the user's input to fill out a ${module} form.
Review the conversation history and the user's latest input.
If the user has provided enough information to confidently populate the required fields of the form, call the 'fill_form' tool with the extracted data. Do NOT invent or hallucinate information. If the user provides all the required information, simply organize and populate it as-is without adding, inferring, or inventing anything extra.
If required information is missing or ambiguous, do NOT call the tool. Instead, ask a specific, targeted clarifying question to the user. Only interrupt the user when truly necessary.`,
    messages: coreMessages,
    tools: {
      fill_form: tool({
        description: `Call this tool to autofill the ${module} form once you have extracted all necessary information from the user's input.`,
        inputSchema: zodSchema(moduleSchema as any),
        execute: async (args) => {
          return {
            success: true,
            data: args,
            message: "Form populated successfully!",
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
