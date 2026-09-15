import { NextRequest, NextResponse } from "next/server";
import {
  getSiteSettings,
  getProjects,
  getSkills,
  getExperiences,
  getEducation,
  getHackathons,
  getCertifications,
} from "@/lib/data";
import { defaultSettings } from "@/lib/defaults";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const [settings, projects, skills, experiences, education, hackathons, certifications] =
      await Promise.all([
        getSiteSettings().then((s) => s || defaultSettings),
        getProjects(),
        getSkills(),
        getExperiences(),
        getEducation(),
        getHackathons(),
        getCertifications(),
      ]);

    // Build rich website knowledge context
    const portfolioContext = `
ABOUT KRISH KANSAGARA:
Name: ${settings.name}
Role / Title: ${settings.title || settings.heroTagline}
Location: ${settings.location} (Mehsana, Gujarat, India)
Email: ${settings.email}
Bio: ${settings.heroBio}
Extra Bio: ${settings.aboutExtraBio || ""}
Goal: ${settings.aboutGoalDesc || ""}
Status: ${settings.openToWork ? "Open to opportunities / freelance" : "Focused on current internship & learning"}
Years of Experience: ${settings.yearsOfExperience || "3+"}
Total Projects: ${settings.aboutStatsProjects || "12+"}

SKILLS & TECHNOLOGIES:
${skills.map((s) => `- ${s.name} (${s.category})`).join("\n")}

SELECTED PROJECTS:
${projects
  .map(
    (p) =>
      `- Project: "${p.title}" | Status: ${p.status} | Tech: ${p.techStack.join(", ")} | Description: ${p.description}`
  )
  .join("\n")}

WORK EXPERIENCE & ROLES:
${experiences
  .map(
    (e) =>
      `- Role: ${e.role} at ${e.company} (${e.startDate} - ${e.current ? "Present" : e.endDate || ""}) in ${e.location}. Highlights: ${e.description}`
  )
  .join("\n")}

EDUCATION:
${education
  .map(
    (edu) =>
      `- Degree: ${edu.degree} in ${edu.field} at ${edu.institution} (${edu.startYear} - ${edu.current ? "Present" : edu.endYear}). ${edu.description || ""}`
  )
  .join("\n")}

HACKATHONS & COMPETITIONS:
${hackathons
  .map(
    (h) =>
      `- Hackathon: "${h.title}" | Project: "${h.project}" | Result/Prize: ${h.result || "Participant"} | Date: ${h.date}. Description: ${h.description}`
  )
  .join("\n")}

CERTIFICATIONS:
${certifications
  .map((c) => `- Certification: "${c.name}" issued by ${c.issuer} (${c.date})`)
  .join("\n")}
`;

    const geminiKey = process.env.GEMINI_API_KEY;
    const aiKey = process.env.AI_API_KEY;
    const apiKey = geminiKey || aiKey;

    if (apiKey) {
      const systemInstruction = `You are Krish's AI Mini Robot Assistant on Kansagara Krish's personal machine learning portfolio website.
Your job is to answer questions ONLY using the provided portfolio website context about Krish Kansagara.
RULES:
1. Ground your knowledge STRICTLY on Krish Kansagara's portfolio data provided below.
2. Do NOT answer unrelated questions outside of Krish Kansagara's portfolio (e.g. general history, math problems, random code generation for other topics). If asked about something unrelated, politely decline and offer to help with Krish's projects, skills, background, or contact info.
3. Keep responses concise (2-4 sentences max), friendly, engaging, and professional.
4. If relevant, mention that they can check the /projects, /experience, /about, or /contact pages.`;

      const prompt = `WEBSITE KNOWLEDGE CONTEXT:\n${portfolioContext}\n\nUSER QUESTION: ${message}`;

      // 1. Try Google Gemini (gemini-2.5-flash / gemini-flash-latest / gemini-1.5-flash)
      if (geminiKey || !apiKey.startsWith("sk-or-")) {
        const geminiModels = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-1.5-flash"];
        for (const model of geminiModels) {
          try {
            const res = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey || apiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [
                    {
                      role: "user",
                      parts: [{ text: `${systemInstruction}\n\n${prompt}` }],
                    },
                  ],
                  generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 600,
                  },
                }),
              }
            );

            if (res.ok) {
              const data = await res.json();
              const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (rawText) {
                // Attach dynamic quick navigation links if relevant
                let quickLinks: { label: string; url: string; isDownload?: boolean }[] | undefined;
                const lowerMsg = (message + " " + rawText).toLowerCase();
                if (lowerMsg.includes("resume") || lowerMsg.includes("cv")) {
                  quickLinks = [{ label: "Download Resume", url: "/resume.pdf", isDownload: true }];
                } else if (lowerMsg.includes("project")) {
                  quickLinks = [{ label: "Explore Projects", url: "/projects" }];
                } else if (lowerMsg.includes("contact") || lowerMsg.includes("email") || lowerMsg.includes("hire")) {
                  quickLinks = [{ label: "Contact Krish", url: "/contact" }, { label: "Email Directly", url: `mailto:${settings.email}` }];
                } else if (lowerMsg.includes("hackathon")) {
                  quickLinks = [{ label: "View Hackathons", url: "/about#hackathons" }];
                }

                return NextResponse.json({ reply: rawText.trim(), quickLinks });
              }
            }
          } catch (e) {
            console.error(`Gemini model ${model} error:`, e);
          }
        }
      }

      // 2. Try OpenRouter API if OpenRouter key format (sk-or-...)
      if (apiKey.startsWith("sk-or-")) {
        try {
          const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: process.env.AI_MODEL || "google/gemini-flash-1.5",
              messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: prompt },
              ],
              temperature: 0.3,
              max_tokens: 250,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const rawText = data?.choices?.[0]?.message?.content;
            if (rawText) {
              return NextResponse.json({ reply: rawText.trim() });
            }
          }
        } catch (e) {
          console.error("OpenRouter API call error:", e);
        }
      }
    }

    // Fallback Knowledge Response (Strictly grounded in site data)
    const lower = message.toLowerCase().trim();
    let reply = "";
    let quickLinks: { label: string; url: string; isDownload?: boolean }[] | undefined;

    if (lower.includes("project") || lower.includes("build") || lower.includes("work")) {
      reply = `Krish has developed innovative projects including the "${projects[0]?.title || "Conference Chatbot Management System"}" (${projects[0]?.techStack.slice(0, 3).join(", ")}) and "${projects[1]?.title || "AI HR Copilot"}". You can explore full case studies on the Projects page!`;
      quickLinks = [{ label: "View Projects", url: "/projects" }];
    } else if (lower.includes("skill") || lower.includes("stack") || lower.includes("python") || lower.includes("machine learning")) {
      const topSkills = skills.slice(0, 6).map((s) => s.name).join(", ");
      reply = `Krish specializes in Machine Learning and Python engineering. His core tools include ${topSkills}, plus FastAPI and Next.js for end-to-end product delivery.`;
      quickLinks = [{ label: "Explore Skills", url: "/experience" }];
    } else if (lower.includes("experience") || lower.includes("intern") || lower.includes("job")) {
      const latestExp = experiences[0];
      reply = `Krish is currently working as a ${latestExp?.role || "IT Developer Intern"} at ${latestExp?.company || "Ganpat University"}, focusing on practical AI solutions and machine learning workflows.`;
      quickLinks = [{ label: "View Experience", url: "/experience" }];
    } else if (lower.includes("hackathon") || lower.includes("competition")) {
      reply = `Krish has competed in 7+ national and international hackathons, building high-speed prototypes under tight pressure and winning recognition for practical solutions!`;
      quickLinks = [{ label: "View Hackathons", url: "/experience" }];
    } else if (lower.includes("education") || lower.includes("college") || lower.includes("degree")) {
      reply = `Krish is pursuing Computer Engineering at Ganpat University (2023 - 2027) with a strong focus on artificial intelligence, data structures, and software architecture.`;
      quickLinks = [{ label: "Education Details", url: "/education" }];
    } else if (lower.includes("contact") || lower.includes("email") || lower.includes("hire") || lower.includes("message")) {
      reply = `You can get in touch with Krish via email at ${settings.email} or by filling out the contact form on this site. He typically responds within 24 hours!`;
      quickLinks = [
        { label: "Contact Form", url: "/contact" },
        { label: "Send Email", url: `mailto:${settings.email}` },
      ];
    } else if (lower.includes("resume") || lower.includes("cv") || lower.includes("download")) {
      reply = `You can download Krish's official resume directly to review his academic background, project history, and technical achievements.`;
      quickLinks = [{ label: "📄 Download Resume", url: "/resume.pdf", isDownload: true }];
    } else if (lower.includes("who") || lower.includes("about") || lower.includes("krish")) {
      reply = `Krish Kansagara is a Machine Learning Developer and Software Engineer from Mehsana, Gujarat, dedicated to crafting scalable AI integrations and modern digital experiences.`;
      quickLinks = [{ label: "Read About Page", url: "/about" }];
    } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      reply = `Hello! 👋 I'm Krish's AI Robot Assistant. Ask me anything about Krish's machine learning projects, skills, education, or get his contact info!`;
    } else {
      reply = `I can answer any questions about Krish Kansagara's portfolio, machine learning projects, skills, hackathons, education, or contact details. How can I assist you?`;
      quickLinks = [
        { label: "View Projects", url: "/projects" },
        { label: "Contact Krish", url: "/contact" },
      ];
    }

    return NextResponse.json({ reply, quickLinks });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "I encountered a hiccup connecting to the knowledge base. Please try asking again!" },
      { status: 500 }
    );
  }
}
