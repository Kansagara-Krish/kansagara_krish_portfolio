export type AIProvider = "openrouter" | "ollama";

export type AIModelOption = {
  value: string;
  label: string;
};

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const OLLAMA_ENDPOINT = "http://13.61.17.160:11434/v1/chat/completions";
const OLLAMA_DEFAULT_MODEL = "glm-4.6:cloud";
const OPENROUTER_DEFAULT_MODEL = "google/gemini-2.5-pro";

const MODEL_OPTIONS: Record<AIProvider, AIModelOption[]> = {
  openrouter: [
    { value: OPENROUTER_DEFAULT_MODEL, label: "Google Gemini 2.5 Pro" },
    { value: "openai/gpt-oss-20b:free", label: "OpenAI GPT-OSS 20B Free" },
    { value: "anthropic/claude-3.5-sonnet", label: "Anthropic Claude 3.5 Sonnet" },
  ],
  ollama: [
    { value: OLLAMA_DEFAULT_MODEL, label: "GLM 4.6 Cloud" },
    { value: "llama3.1:8b", label: "Llama 3.1 8B" },
    { value: "qwen2.5:14b", label: "Qwen 2.5 14B" },
  ],
};

export function normalizeAIProvider(provider?: string | null): AIProvider {
  return provider === "openrouter" ? "openrouter" : "ollama";
}

export function getDefaultAIModel(provider: AIProvider): string {
  return provider === "ollama" ? OLLAMA_DEFAULT_MODEL : OPENROUTER_DEFAULT_MODEL;
}

export function getDefaultAIBaseUrl(provider: AIProvider): string {
  return provider === "ollama" ? OLLAMA_ENDPOINT : OPENROUTER_ENDPOINT;
}

export function getAIProviderLabel(provider: AIProvider): string {
  return provider === "ollama" ? "Ollama" : "OpenRouter";
}

export function getAIModelOptions(provider: AIProvider): AIModelOption[] {
  return MODEL_OPTIONS[provider];
}