export type Provider = "OpenAI" | "Anthropic" | "Google";
export type ModelTier = "economy" | "balanced" | "frontier";

export type CatalogModel = {
  id: string;
  name: string;
  provider: Provider;
  tier: ModelTier;
  tierLabel: string;
  bestFor: string;
  inputPerMillion: number;
  outputPerMillion: number;
  cachedInputPerMillion?: number;
  batch: boolean;
  multimodal: boolean;
  status?: "Preview" | "프로모션";
  source: string;
};

export const CATALOG_VERIFIED_AT = "2026-07-22";

export const catalogModels: CatalogModel[] = [
  {
    id: "gpt-5-6-luna",
    name: "GPT-5.6 Luna",
    provider: "OpenAI",
    tier: "economy",
    tierLabel: "경제형",
    bestFor: "대량 처리와 빠른 제품 기능",
    inputPerMillion: 1,
    outputPerMillion: 6,
    batch: true,
    multimodal: true,
    source: "https://openai.com/api/",
  },
  {
    id: "gpt-5-6-terra",
    name: "GPT-5.6 Terra",
    provider: "OpenAI",
    tier: "balanced",
    tierLabel: "균형형",
    bestFor: "일반 에이전트와 복합 업무",
    inputPerMillion: 2.5,
    outputPerMillion: 15,
    batch: true,
    multimodal: true,
    source: "https://openai.com/api/",
  },
  {
    id: "gpt-5-6-sol",
    name: "GPT-5.6 Sol",
    provider: "OpenAI",
    tier: "frontier",
    tierLabel: "최상위",
    bestFor: "높은 지능이 필요한 복잡한 작업",
    inputPerMillion: 5,
    outputPerMillion: 30,
    batch: true,
    multimodal: true,
    source: "https://openai.com/api/",
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    tier: "economy",
    tierLabel: "경제형",
    bestFor: "분류·요약과 대량 고객 응대",
    inputPerMillion: 1,
    outputPerMillion: 5,
    cachedInputPerMillion: 0.1,
    batch: true,
    multimodal: true,
    source: "https://platform.claude.com/docs/en/about-claude/pricing",
  },
  {
    id: "claude-sonnet-5",
    name: "Claude Sonnet 5",
    provider: "Anthropic",
    tier: "balanced",
    tierLabel: "균형형",
    bestFor: "코딩과 범용 에이전트",
    inputPerMillion: 2,
    outputPerMillion: 10,
    cachedInputPerMillion: 0.2,
    batch: true,
    multimodal: true,
    status: "프로모션",
    source: "https://platform.claude.com/docs/en/about-claude/pricing",
  },
  {
    id: "claude-opus-4-8",
    name: "Claude Opus 4.8",
    provider: "Anthropic",
    tier: "frontier",
    tierLabel: "최상위",
    bestFor: "정교한 추론과 장시간 에이전트 작업",
    inputPerMillion: 5,
    outputPerMillion: 25,
    cachedInputPerMillion: 0.5,
    batch: true,
    multimodal: true,
    source: "https://platform.claude.com/docs/en/about-claude/pricing",
  },
  {
    id: "gemini-3-5-flash-lite",
    name: "Gemini 3.5 Flash-Lite",
    provider: "Google",
    tier: "economy",
    tierLabel: "경제형",
    bestFor: "고용량 에이전트·번역·단순 처리",
    inputPerMillion: 0.3,
    outputPerMillion: 2.5,
    cachedInputPerMillion: 0.03,
    batch: true,
    multimodal: true,
    source: "https://ai.google.dev/gemini-api/docs/pricing",
  },
  {
    id: "gemini-3-1-flash",
    name: "Gemini 3.1 Flash",
    provider: "Google",
    tier: "balanced",
    tierLabel: "균형형",
    bestFor: "멀티모달 앱과 빠른 응답",
    inputPerMillion: 0.5,
    outputPerMillion: 3,
    cachedInputPerMillion: 0.05,
    batch: true,
    multimodal: true,
    source: "https://ai.google.dev/gemini-api/docs/pricing",
  },
  {
    id: "gemini-3-1-pro-preview",
    name: "Gemini 3.1 Pro",
    provider: "Google",
    tier: "frontier",
    tierLabel: "최상위",
    bestFor: "복잡한 멀티모달·에이전트·코딩",
    inputPerMillion: 2,
    outputPerMillion: 12,
    cachedInputPerMillion: 0.2,
    batch: true,
    multimodal: true,
    status: "Preview",
    source: "https://ai.google.dev/gemini-api/docs/pricing",
  },
];

export function blendedPrice(model: CatalogModel) {
  return model.inputPerMillion + model.outputPerMillion;
}
