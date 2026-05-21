import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import {
  getAIProviderLabel,
  getDefaultAIBaseUrl,
  normalizeAIProvider,
} from "@/lib/ai-defaults";

const requestSchema = z.object({
  provider: z.enum(["openrouter", "ollama"]),
  model: z.string().trim().min(1),
  baseUrl: z.string().trim().optional(),
});

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
    }

    const provider = normalizeAIProvider(parsed.data.provider);
    const model = parsed.data.model.trim();
    const baseUrl = parsed.data.baseUrl?.trim() || getDefaultAIBaseUrl(provider);

    const apiKey = process.env.AI_API_KEY?.trim() ?? "";
    if (provider === "openrouter" && apiKey.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "AI_API_KEY is missing or invalid for OpenRouter.",
        },
        { status: 500 },
      );
    }

    const res = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(provider === "openrouter"
          ? {
              Authorization: `Bearer ${apiKey}`,
              "HTTP-Referer": "https://localhost:3000",
            }
          : {}),
        "X-Title": "Portfolio CMS",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "Reply with exactly one short sentence confirming the connection works.",
          },
          {
            role: "user",
            content: "Test connection.",
          },
        ],
        temperature: 0,
        max_tokens: 32,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        {
          success: false,
          error: `${getAIProviderLabel(provider)} test failed with ${res.status}`,
          details: errorText.slice(0, 500),
        },
        { status: 500 },
      );
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    const content = data.choices?.[0]?.message?.content?.trim() || "Connection succeeded.";

    return NextResponse.json({
      success: true,
      provider,
      model,
      baseUrl,
      message: content,
    });
  } catch (error) {
    console.error("AI Test API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to test AI connection" },
      { status: 500 },
    );
  }
}