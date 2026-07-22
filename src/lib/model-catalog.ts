export type Provider = "OpenAI" | "Anthropic" | "Google";
export type ModelTier = "economy" | "balanced" | "frontier";

export type ProviderSource = {
  label: string;
  url: string;
};

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
  verifiedAt: string;
};

export const CATALOG_VERIFIED_AT = "2026-07-23";

export const providerSources: Record<Provider, ProviderSource> = {
  OpenAI: {
    label: "OpenAI API 가격",
    url: "https://developers.openai.com/api/docs/pricing",
  },
  Anthropic: {
    label: "Anthropic API 가격",
    url: "https://platform.claude.com/docs/en/about-claude/pricing",
  },
  Google: {
    label: "Gemini Developer API 가격",
    url: "https://ai.google.dev/gemini-api/docs/pricing",
  },
};

type CatalogEntry = Omit<CatalogModel, "source" | "verifiedAt">;

function catalogEntry(entry: CatalogEntry): CatalogModel {
  return {
    ...entry,
    source: providerSources[entry.provider].url,
    verifiedAt: CATALOG_VERIFIED_AT,
  };
}

export const catalogModels: CatalogModel[] = [
  catalogEntry({
    id: "gpt-5-6-luna",
    name: "GPT-5.6 Luna",
    provider: "OpenAI",
    tier: "economy",
    tierLabel: "경제형",
    bestFor: "대량 처리와 빠른 제품 기능",
    inputPerMillion: 1,
    cachedInputPerMillion: 0.1,
    outputPerMillion: 6,
    batch: true,
    multimodal: true,
  }),
  catalogEntry({
    id: "gpt-5-6-terra",
    name: "GPT-5.6 Terra",
    provider: "OpenAI",
    tier: "balanced",
    tierLabel: "균형형",
    bestFor: "일반 에이전트와 복합 업무",
    inputPerMillion: 2.5,
    cachedInputPerMillion: 0.25,
    outputPerMillion: 15,
    batch: true,
    multimodal: true,
  }),
  catalogEntry({
    id: "gpt-5-6-sol",
    name: "GPT-5.6 Sol",
    provider: "OpenAI",
    tier: "frontier",
    tierLabel: "최상위",
    bestFor: "높은 지능이 필요한 복잡한 작업",
    inputPerMillion: 5,
    cachedInputPerMillion: 0.5,
    outputPerMillion: 30,
    batch: true,
    multimodal: true,
  }),
  catalogEntry({
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
  }),
  catalogEntry({
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
  }),
  catalogEntry({
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
  }),
  catalogEntry({
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
  }),
  catalogEntry({
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
  }),
  catalogEntry({
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
  }),
];

export function getCatalogModel(id: string) {
  const model = catalogModels.find((entry) => entry.id === id);
  if (!model) throw new Error(`Unknown model catalog id: ${id}`);
  return model;
}

export function blendedPrice(model: CatalogModel) {
  return model.inputPerMillion + model.outputPerMillion;
}
