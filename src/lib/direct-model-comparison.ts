import { catalogModels, type CatalogModel } from "./model-catalog";

export type DirectComparisonInput = {
  modelAId: string;
  modelBId: string;
  monthlyRequests: number;
  inputTokensPerRequest: number;
  outputTokensPerRequest: number;
};

export type ComparableModel = CatalogModel & {
  contextWindowTokens: number;
  maxOutputTokens?: number;
};

const modelLimits: Record<
  string,
  { contextWindowTokens: number; maxOutputTokens?: number }
> = {
  "gpt-5-6-luna": { contextWindowTokens: 1_050_000, maxOutputTokens: 128_000 },
  "gpt-5-6-terra": { contextWindowTokens: 1_050_000, maxOutputTokens: 128_000 },
  "gpt-5-6-sol": { contextWindowTokens: 1_050_000, maxOutputTokens: 128_000 },
  "claude-haiku-4-5": { contextWindowTokens: 200_000 },
  "claude-sonnet-5": {
    contextWindowTokens: 1_000_000,
    maxOutputTokens: 128_000,
  },
  "claude-opus-4-8": { contextWindowTokens: 1_000_000 },
  "gemini-3-5-flash-lite": { contextWindowTokens: 1_000_000 },
  "gemini-3-5-flash": {
    contextWindowTokens: 1_000_000,
    maxOutputTokens: 65_000,
  },
  "gemini-3-1-pro-preview": { contextWindowTokens: 1_000_000 },
};

const nonNegative = (value: number) =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

export const comparisonModels: ComparableModel[] = catalogModels.map(
  (model) => ({
    ...model,
    ...modelLimits[model.id],
  }),
);

function getComparisonModel(id: string) {
  const model = comparisonModels.find((entry) => entry.id === id);
  if (!model) throw new Error(`Unknown comparison model: ${id}`);
  return model;
}

function calculateMonthlyCost(
  model: ComparableModel,
  monthlyRequests: number,
  inputTokensPerRequest: number,
  outputTokensPerRequest: number,
) {
  return (
    ((inputTokensPerRequest * model.inputPerMillion +
      outputTokensPerRequest * model.outputPerMillion) /
      1_000_000) *
    monthlyRequests
  );
}

export function compareModels(input: DirectComparisonInput) {
  const monthlyRequests = Math.floor(nonNegative(input.monthlyRequests));
  const inputTokensPerRequest = nonNegative(input.inputTokensPerRequest);
  const outputTokensPerRequest = nonNegative(input.outputTokensPerRequest);
  const modelA = getComparisonModel(input.modelAId);
  const modelB = getComparisonModel(input.modelBId);
  const monthlyCostAUsd = calculateMonthlyCost(
    modelA,
    monthlyRequests,
    inputTokensPerRequest,
    outputTokensPerRequest,
  );
  const monthlyCostBUsd = calculateMonthlyCost(
    modelB,
    monthlyRequests,
    inputTokensPerRequest,
    outputTokensPerRequest,
  );

  return {
    monthlyRequests,
    inputTokensPerRequest,
    outputTokensPerRequest,
    modelA,
    modelB,
    monthlyCostAUsd,
    monthlyCostBUsd,
    cheaperModel:
      monthlyCostAUsd === monthlyCostBUsd
        ? null
        : monthlyCostAUsd < monthlyCostBUsd
          ? modelA
          : modelB,
    monthlySavingsUsd: Math.abs(monthlyCostAUsd - monthlyCostBUsd),
  };
}
