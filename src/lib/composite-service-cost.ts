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

const nonNegative = (value: number) =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

export function calculateCompositeServiceCost(
  input: CompositeServiceCostInput,
) {
  const monthlyRequests = Math.floor(nonNegative(input.monthlyRequests));
  const inputTokensPerRequest = nonNegative(input.inputTokensPerRequest);
  const outputTokensPerRequest = nonNegative(input.outputTokensPerRequest);
  const imagesPerRequest = nonNegative(input.imagesPerRequest);
  const audioMinutesPerRequest = nonNegative(input.audioMinutesPerRequest);
  const searchesPerRequest = nonNegative(input.searchesPerRequest);
  const targetMarginPercent = Math.min(
    95,
    nonNegative(input.targetMarginPercent),
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
