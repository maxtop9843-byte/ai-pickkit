export type CompositeServiceCostInput = {
  monthlyRequests: number;
  inputTokensPerRequest: number;
  outputTokensPerRequest: number;
  imagesPerRequest: number;
  audioMinutesPerRequest: number;
  searchesPerRequest: number;
  targetMarginPercent: number;
};

export const compositePricing = {
  textInputPerMillionTokensUsd: 2.5,
  textOutputPerMillionTokensUsd: 15,
  imagePerUnitUsd: 0.034,
  audioPerMinuteUsd: 0.017,
  webSearchPerCallUsd: 0.01,
  sourceUrl: "https://openai.com/api/pricing/",
  verifiedAt: "2026-07-24",
} as const;

const wholeNumberFields = new Set<keyof CompositeServiceCostInput>([
  "monthlyRequests",
  "inputTokensPerRequest",
  "outputTokensPerRequest",
]);

export function normalizeCompositeServiceCostInput(
  key: keyof CompositeServiceCostInput,
  value: number,
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  if (key === "targetMarginPercent") {
    return Math.min(95, Math.max(0, value));
  }

  const nonNegativeValue = Math.max(0, value);
  return wholeNumberFields.has(key)
    ? Math.floor(nonNegativeValue)
    : nonNegativeValue;
}

export function calculateCompositeServiceCost(
  input: CompositeServiceCostInput,
) {
  const monthlyRequests = normalizeCompositeServiceCostInput(
    "monthlyRequests",
    input.monthlyRequests,
  );
  const inputTokensPerRequest = normalizeCompositeServiceCostInput(
    "inputTokensPerRequest",
    input.inputTokensPerRequest,
  );
  const outputTokensPerRequest = normalizeCompositeServiceCostInput(
    "outputTokensPerRequest",
    input.outputTokensPerRequest,
  );
  const imagesPerRequest = normalizeCompositeServiceCostInput(
    "imagesPerRequest",
    input.imagesPerRequest,
  );
  const audioMinutesPerRequest = normalizeCompositeServiceCostInput(
    "audioMinutesPerRequest",
    input.audioMinutesPerRequest,
  );
  const searchesPerRequest = normalizeCompositeServiceCostInput(
    "searchesPerRequest",
    input.searchesPerRequest,
  );
  const targetMarginPercent = normalizeCompositeServiceCostInput(
    "targetMarginPercent",
    input.targetMarginPercent,
  );

  const textInputCostPerRequestUsd =
    (inputTokensPerRequest / 1_000_000) *
    compositePricing.textInputPerMillionTokensUsd;
  const textOutputCostPerRequestUsd =
    (outputTokensPerRequest / 1_000_000) *
    compositePricing.textOutputPerMillionTokensUsd;
  const imageCostPerRequestUsd =
    imagesPerRequest * compositePricing.imagePerUnitUsd;
  const audioCostPerRequestUsd =
    audioMinutesPerRequest * compositePricing.audioPerMinuteUsd;
  const searchCostPerRequestUsd =
    searchesPerRequest * compositePricing.webSearchPerCallUsd;
  const unitCostUsd =
    textInputCostPerRequestUsd +
    textOutputCostPerRequestUsd +
    imageCostPerRequestUsd +
    audioCostPerRequestUsd +
    searchCostPerRequestUsd;
  const monthlyCostUsd = unitCostUsd * monthlyRequests;
  const suggestedPricePerRequestUsd =
    targetMarginPercent >= 95
      ? unitCostUsd * 20
      : unitCostUsd / (1 - targetMarginPercent / 100);

  return {
    monthlyRequests,
    textCostPerRequestUsd:
      textInputCostPerRequestUsd + textOutputCostPerRequestUsd,
    imageCostPerRequestUsd,
    audioCostPerRequestUsd,
    searchCostPerRequestUsd,
    unitCostUsd,
    monthlyCostUsd,
    suggestedPricePerRequestUsd,
    monthlyRevenueAtTargetMarginUsd:
      suggestedPricePerRequestUsd * monthlyRequests,
  };
}
