export type EmbeddingPriceOption = {
  id: string;
  provider: "OpenAI";
  model: string;
  pricePerMillionTokensUsd: number;
  note: string;
  sourceUrl: string;
  verifiedAt: string;
};

export type RagCostInput = {
  documentCount: number;
  averageTokensPerDocument: number;
  chunkTokens: number;
  overlapPercent: number;
  queriesPerDay: number;
  averageQueryTokens: number;
  daysPerMonth: number;
  reindexEveryDays: number;
};

const sourceUrl =
  "https://developers.openai.com/api/docs/models/text-embedding-3-small";

export const embeddingPriceOptions: EmbeddingPriceOption[] = [
  {
    id: "text-embedding-3-small",
    provider: "OpenAI",
    model: "text-embedding-3-small",
    pricePerMillionTokensUsd: 0.02,
    note: "비용 효율적인 기본 임베딩 모델입니다.",
    sourceUrl,
    verifiedAt: "2026-07-24",
  },
  {
    id: "text-embedding-3-large",
    provider: "OpenAI",
    model: "text-embedding-3-large",
    pricePerMillionTokensUsd: 0.13,
    note: "검색 품질을 우선하는 고성능 임베딩 모델입니다.",
    sourceUrl:
      "https://developers.openai.com/api/docs/models/text-embedding-3-large",
    verifiedAt: "2026-07-24",
  },
];

function positive(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateRagCost(
  option: EmbeddingPriceOption,
  input: RagCostInput,
) {
  const documentCount = Math.floor(positive(input.documentCount));
  const averageTokensPerDocument = positive(input.averageTokensPerDocument);
  const chunkTokens = Math.max(1, positive(input.chunkTokens));
  const overlapPercent = Math.min(90, positive(input.overlapPercent));
  const overlapMultiplier = 1 / (1 - overlapPercent / 100);
  const daysPerMonth = Math.min(31, Math.max(1, positive(input.daysPerMonth)));
  const reindexEveryDays = Math.max(1, positive(input.reindexEveryDays));
  const indexingRuns = Math.ceil(daysPerMonth / reindexEveryDays);

  const sourceTokens = documentCount * averageTokensPerDocument;
  const tokensPerIndex = sourceTokens * overlapMultiplier;
  const indexingTokens = tokensPerIndex * indexingRuns;
  const queryTokens =
    positive(input.queriesPerDay) *
    positive(input.averageQueryTokens) *
    daysPerMonth;
  const totalEmbeddingTokens = indexingTokens + queryTokens;
  const chunkCount = Math.ceil(tokensPerIndex / chunkTokens);
  const pricePerToken = option.pricePerMillionTokensUsd / 1_000_000;

  return {
    sourceTokens,
    chunkCount,
    indexingRuns,
    indexingTokens,
    queryTokens,
    totalEmbeddingTokens,
    indexingUsd: indexingTokens * pricePerToken,
    queryUsd: queryTokens * pricePerToken,
    monthlyUsd: totalEmbeddingTokens * pricePerToken,
  };
}
