export type FineTuningPriceOption = {
  id: string;
  provider: "Google";
  model: string;
  trainingPerMillionTokensUsd: number;
  inputPerMillionTokensUsd: number;
  outputPerMillionTokensUsd: number;
  note: string;
  sourceUrl: string;
  verifiedAt: string;
};

export type FineTuningCostInput = {
  trainingExamples: number;
  averageTokensPerExample: number;
  epochs: number;
  monthlyRequests: number;
  averageInputTokens: number;
  averageOutputTokens: number;
};

const sourceUrl = "https://cloud.google.com/vertex-ai/generative-ai/pricing";

export const fineTuningPriceOptions: FineTuningPriceOption[] = [
  {
    id: "gemini-2.0-flash",
    provider: "Google",
    model: "Gemini 2.0 Flash",
    trainingPerMillionTokensUsd: 3,
    inputPerMillionTokensUsd: 0.15,
    outputPerMillionTokensUsd: 0.6,
    note: "품질과 비용의 균형을 위한 범용 튜닝 모델입니다.",
    sourceUrl,
    verifiedAt: "2026-07-24",
  },
  {
    id: "gemini-2.0-flash-lite",
    provider: "Google",
    model: "Gemini 2.0 Flash Lite",
    trainingPerMillionTokensUsd: 1,
    inputPerMillionTokensUsd: 0.075,
    outputPerMillionTokensUsd: 0.3,
    note: "대량·저비용 워크로드를 위한 경량 튜닝 모델입니다.",
    sourceUrl,
    verifiedAt: "2026-07-24",
  },
];

function positive(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateFineTuningCost(
  option: FineTuningPriceOption,
  input: FineTuningCostInput,
) {
  const trainingExamples = Math.floor(positive(input.trainingExamples));
  const averageTokensPerExample = positive(input.averageTokensPerExample);
  const epochs = Math.max(1, Math.floor(positive(input.epochs)));
  const monthlyRequests = Math.floor(positive(input.monthlyRequests));
  const averageInputTokens = positive(input.averageInputTokens);
  const averageOutputTokens = positive(input.averageOutputTokens);

  const datasetTokens = trainingExamples * averageTokensPerExample;
  const billableTrainingTokens = datasetTokens * epochs;
  const trainingUsd =
    (billableTrainingTokens / 1_000_000) * option.trainingPerMillionTokensUsd;

  const monthlyInputTokens = monthlyRequests * averageInputTokens;
  const monthlyOutputTokens = monthlyRequests * averageOutputTokens;
  const monthlyInputUsd =
    (monthlyInputTokens / 1_000_000) * option.inputPerMillionTokensUsd;
  const monthlyOutputUsd =
    (monthlyOutputTokens / 1_000_000) * option.outputPerMillionTokensUsd;
  const monthlyInferenceUsd = monthlyInputUsd + monthlyOutputUsd;

  return {
    datasetTokens,
    billableTrainingTokens,
    trainingUsd,
    monthlyInputTokens,
    monthlyOutputTokens,
    monthlyInputUsd,
    monthlyOutputUsd,
    monthlyInferenceUsd,
    firstMonthUsd: trainingUsd + monthlyInferenceUsd,
  };
}
