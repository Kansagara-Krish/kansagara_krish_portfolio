import "server-only";

import { prisma } from "@/lib/prisma";
import {
  getAIProviderLabel,
  getDefaultAIBaseUrl,
  getDefaultAIModel,
  normalizeAIProvider,
  type AIProvider,
} from "@/lib/ai-defaults";

export {
  getAIProviderLabel,
  getDefaultAIBaseUrl,
  getDefaultAIModel,
  normalizeAIProvider,
};

export type AIConfig = {
  provider: AIProvider;
  model: string;
  baseUrl: string;
  apiKey: string;
};

export function resolveAIConfig(settings?: {
  aiProvider?: string | null;
  aiModel?: string | null;
  aiBaseUrl?: string | null;
} | null): AIConfig {
  const provider = normalizeAIProvider(settings?.aiProvider ?? process.env.AI_PROVIDER ?? null);
  const model = (settings?.aiModel ?? process.env.AI_MODEL ?? "").trim();
  const baseUrl = (settings?.aiBaseUrl ?? process.env.AI_BASE_URL ?? "").trim() || getDefaultAIBaseUrl(provider);
  const apiKey = process.env.AI_API_KEY?.trim() ?? "";

  return { provider, model, baseUrl, apiKey };
}

export async function resolveAIConfigFromDatabase(): Promise<AIConfig> {
  const settings = await prisma.siteSettings.findFirst({
    select: {
      aiProvider: true,
      aiModel: true,
      aiBaseUrl: true,
    },
  });

  return resolveAIConfig(settings);
}