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
      const systemInstruction = `You are Krish's AI Portfolio Assistant on Kansagara Krish's machine learning portfolio website.
PRIMARY OBJECTIVE: Answer questions strictly about Krish Kansagara (his background, machine learning projects, technical skills, work experience, education, hackathons, and contact information).

RULES & OFF-TOPIC HANDLING:
1. Ground your knowledge STRICTLY on Krish Kansagara's portfolio data provided below.
2. If the user asks an off-topic question NOT related to Krish Kansagara or his portfolio (such as general knowledge, world politics like "who is pm of india", geography, history, general math, weather, jokes, or random code requests):
   - Do NOT answer the off-topic question.
   - Do NOT pretend Krish is the subject of the off-topic query.
   - Politely decline and explain that you are dedicated exclusively to Krish Kansagara's portfolio, machine learning work, and background.
   - Example refusal: "I am specialized exclusively as Krish Kansagara's portfolio assistant. While I don't answer general knowledge or external trivia questions, I'd be happy to tell you about Krish's machine learning projects, skills, or help you contact him!"
3. Keep responses concise (2-4 sentences max), friendly, engaging, and professional.
4. When referring to pages, you can naturally suggest exploring About, Projects, Experience, Education, or Contact.`;

      const prompt = `WEBSITE KNOWLEDGE CONTEXT:\n${portfolioContext}\n\nUSER QUESTION: ${message}`;

      const generateQuickLinks = (userQuery: string, botReply: string) => {
        const lowerMsg = (userQuery + " " + botReply).toLowerCase();
        const links: { label: string; url: string; isDownload?: boolean }[] = [];

        // Check if reply is a polite off-topic decline
        if (
          botReply.toLowerCase().includes("specialized exclusively") ||
          botReply.toLowerCase().includes("don't answer general") ||
          botReply.toLowerCase().includes("unrelated to krish")
        ) {
          return [
            { label: "Explore Projects", url: "/projects" },
            { label: "About Krish", url: "/about" },
          ];
        }

        if (lowerMsg.includes("resume") || lowerMsg.includes("cv")) {
          links.push({ label: "Download Resume", url: "/resume.pdf", isDownload: true });
        }
        if (lowerMsg.includes("project") || lowerMsg.includes("build") || lowerMsg.includes("work")) {
          links.push({ label: "Explore Projects", url: "/projects" });
        }
        if (lowerMsg.includes("contact") || lowerMsg.includes("email") || lowerMsg.includes("hire") || lowerMsg.includes("reach")) {
          links.push({ label: "Contact Krish", url: "/contact" });
        }
        if (lowerMsg.includes("hackathon")) {
          links.push({ label: "View Hackathons", url: "/experience" });
        }
        if (lowerMsg.includes("who is krish") || lowerMsg.includes("about krish") || lowerMsg.includes("about him")) {
          links.push({ label: "About Krish", url: "/about" });
        }
        if (lowerMsg.includes("skill") || lowerMsg.includes("stack") || lowerMsg.includes("experience")) {
          links.push({ label: "View Experience & Skills", url: "/experience" });
        }
        if (lowerMsg.includes("education") || lowerMsg.includes("college") || lowerMsg.includes("degree")) {
          links.push({ label: "View Education", url: "/education" });
        }
        if (lowerMsg.includes("certif")) {
          links.push({ label: "View Certifications", url: "/certifications" });
        }

        return links.length > 0 ? links.slice(0, 2) : undefined;
      };

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
                    temperature: 0.2,
                    maxOutputTokens: 600,
                  },
                }),
              }
            );

            if (res.ok) {
              const data = await res.json();
              const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (rawText) {
                const quickLinks = generateQuickLinks(message, rawText);
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
              temperature: 0.2,
              max_tokens: 250,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const rawText = data?.choices?.[0]?.message?.content;
            if (rawText) {
              const quickLinks = generateQuickLinks(message, rawText);
              return NextResponse.json({ reply: rawText.trim(), quickLinks });
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

    const isKrishAboutQuery =
      lower.includes("who is krish") ||
      lower.includes("who are you") ||
      lower.includes("tell me about krish") ||
      lower.includes("tell me about yourself") ||
      lower.includes("about krish") ||
      lower === "who" ||
      lower === "about" ||
      lower === "bio" ||
      lower === "krish" ||
      lower.includes("krish kansagara") ||
      lower.includes("introduce yourself");

    if (isKrishAboutQuery) {
      reply = `Krish Kansagara is a Machine Learning Developer and Software Engineer from Mehsana, Gujarat, dedicated to crafting scalable AI integrations, ML models, and modern digital applications.`;
      quickLinks = [{ label: "About Krish", url: "/about" }];
    } else if (lower.includes("project") || lower.includes("build") || lower.includes("portfolio") || lower.includes("apps") || lower.includes("work")) {
      reply = `Krish has developed innovative projects including "${projects[0]?.title || "Conference Chatbot Management System"}" (${projects[0]?.techStack.slice(0, 3).join(", ")}) and "${projects[1]?.title || "AI HR Copilot"}". You can explore full case studies on the Projects page!`;
      quickLinks = [{ label: "Explore Projects", url: "/projects" }];
    } else if (lower.includes("skill") || lower.includes("stack") || lower.includes("python") || lower.includes("machine learning") || lower.includes("tech") || lower.includes("framework")) {
      const topSkills = skills.slice(0, 6).map((s) => s.name).join(", ");
      reply = `Krish specializes in Machine Learning and Python engineering. His core tools include ${topSkills}, plus FastAPI and Next.js for end-to-end product delivery.`;
      quickLinks = [{ label: "Explore Skills", url: "/experience" }];
    } else if (lower.includes("experience") || lower.includes("intern") || lower.includes("job") || lower.includes("career") || lower.includes("role")) {
      const latestExp = experiences[0];
      reply = `Krish completed his role as an ${latestExp?.role || "IT Developer Intern"} at ${latestExp?.company || "Ganpat University"}, focusing on practical AI solutions and machine learning workflows. He is currently looking for work and open to new opportunities!`;
      quickLinks = [{ label: "View Experience", url: "/experience" }];
    } else if (lower.includes("hackathon") || lower.includes("competition")) {
      reply = `Krish has competed in 7+ national and international hackathons, building high-speed prototypes under tight pressure and winning recognition for practical solutions!`;
      quickLinks = [{ label: "View Hackathons", url: "/experience" }];
    } else if (lower.includes("education") || lower.includes("college") || lower.includes("degree") || lower.includes("university")) {
      reply = `Krish is pursuing Computer Engineering at Ganpat University (2023 - 2027) with a strong focus on artificial intelligence, data structures, and software architecture.`;
      quickLinks = [{ label: "Education Details", url: "/education" }];
    } else if (lower.includes("contact") || lower.includes("email") || lower.includes("hire") || lower.includes("reach") || lower.includes("message")) {
      reply = `You can get in touch with Krish via email at ${settings.email} or by filling out the contact form on this site. He typically responds within 24 hours!`;
      quickLinks = [
        { label: "Contact Form", url: "/contact" },
        { label: "Send Email", url: `mailto:${settings.email}` },
      ];
    } else if (lower.includes("resume") || lower.includes("cv") || lower.includes("download")) {
      reply = `You can download Krish's official resume directly to review his academic background, project history, and technical achievements.`;
      quickLinks = [{ label: "Download Resume", url: "/resume.pdf", isDownload: true }];
    } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("greetings")) {
      reply = `Hello! I'm Krish AI. I'm here to assist you with Krish Kansagara's machine learning portfolio, projects, skills, or contact info. How can I help?`;
      quickLinks = [
        { label: "View Projects", url: "/projects" },
        { label: "Contact Krish", url: "/contact" },
      ];
    } else {
      // Clear off-topic polite response
      reply = `I am specialized exclusively as Krish Kansagara's portfolio assistant. I can only answer questions about Krish's machine learning projects, skills, experience, and contact details.\n\nFeel free to ask me anything about his work!`;
      quickLinks = [
        { label: "Explore Projects", url: "/projects" },
        { label: "About Krish", url: "/about" },
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
