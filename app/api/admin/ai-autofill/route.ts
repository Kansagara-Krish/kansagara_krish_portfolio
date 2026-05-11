/* eslint-disable @typescript-eslint/no-explicit-any */
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";
import {
  schemas,
  buildSystemPrompt,
  type SupportedModule,
} from "@/lib/ai-autofill";

/**
 * Configure AI provider using the OpenAI-compatible SDK.
 */
const ai_provider = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.AI_API_KEY,
});

/**
 * AI Autofill API Route
 * This endpoint handles requests from the AIAssistant component to extract structured
 * data from user input and call the `fill_form` tool.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, module } = body;

    // --- 1. CONFIGURATION CHECKS ---
    if (!process.env.AI_API_KEY) {
      return NextResponse.json({ error: "AI API Key is not configured" }, { status: 500 });
    }
    
    if (!process.env.AI_MODEL) {
      return NextResponse.json({ error: "AI Model is not configured" }, { status: 500 });
    }

    const moduleSchema = schemas[module as SupportedModule];
    if (!moduleSchema) {
      return NextResponse.json({ error: "Invalid module specified." }, { status: 400 });
    }

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages must be an array." }, { status: 400 });
    }

    // --- 2. EXECUTE AI STREAM ---
    const result = await streamText({
      model: ai_provider(process.env.AI_MODEL),
      system: buildSystemPrompt(module as SupportedModule),
      messages: (messages as any[]).map((m) => {
        let content = m.content;
        if (m.parts) {
          content = m.parts.filter((p: any) => p.type === "text").map((p: any) => p.text).join("\n");
        }
        return { 
          role: m.role as "user" | "assistant" | "system" | "tool", 
          content 
        };
      }),
      tools: {
        fill_form: (tool as any)({
          description: `Extracted structured data for the ${module} module. Always call this tool after understanding the user's input.`,
          parameters: moduleSchema,
        }),
      },
      toolChoice: "required",
    });

    return (result as any).toDataStreamResponse();
  } catch (error: any) {
    console.error("AI Autofill API Error:", error);
    return NextResponse.json(
      { error: "Internal server error during AI processing." },
      { status: 500 },
    );
  }
}
