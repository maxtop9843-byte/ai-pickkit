import type { CatalogModel } from "./model-catalog";

export type SavingsInput = {
  inputTokens: number;
  outputTokens: number;
  requestsPerDay: number;
  repeatedInputPercent: number;
  cacheHitPercent: number;
  batchPercent: number;
};

export type SavingsScenario = {
  id: "baseline" | "cache" | "batch" | "combined";
  label: string;
  requestCost: number;
  monthlyCost: number;
  monthlySavings: number;
  savingsPercent: number;
};

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value)) / 100;
}

export function calculateSavingsScenarios(
  input: SavingsInput,
  model: CatalogModel,
): SavingsScenario[] {
  const repeatedRatio = clampPercent(input.repeatedInputPercent);
  const hitRatio = clampPercent(input.cacheHitPercent);
  const batchRatio = model.batch ? clampPercent(input.batchPercent) : 0;
  const cachedRate = model.cachedInputPerMillion ?? model.inputPerMillion;
  const cacheHitTokens = input.inputTokens * repeatedRatio * hitRatio;
  const regularInputTokens = input.inputTokens - cacheHitTokens;
  const outputCost = input.outputTokens * model.outputPerMillion;
  const baselineRequest =
    (input.inputTokens * model.inputPerMillion + outputCost) / 1_000_000;
  const cachedRequest =
    (regularInputTokens * model.inputPerMillion +
      cacheHitTokens * cachedRate +
      outputCost) /
    1_000_000;
  const batchMultiplier = 1 - batchRatio * 0.5;
  const batchRequest = baselineRequest * batchMultiplier;
  const combinedRequest = cachedRequest * batchMultiplier;
  const monthlyRequests = input.requestsPerDay * 30;
  const baselineMonthly = baselineRequest * monthlyRequests;

  const scenario = (
    id: SavingsScenario["id"],
    label: string,
    requestCost: number,
  ): SavingsScenario => {
    const monthlyCost = requestCost * monthlyRequests;
    const monthlySavings = Math.max(0, baselineMonthly - monthlyCost);
    return {
      id,
      label,
      requestCost,
      monthlyCost,
      monthlySavings,
      savingsPercent:
        baselineMonthly > 0 ? (monthlySavings / baselineMonthly) * 100 : 0,
    };
  };

  return [
    scenario("baseline", "기본 호출", baselineRequest),
    scenario("cache", "캐싱 적용", cachedRequest),
    scenario("batch", "Batch 적용", batchRequest),
    scenario("combined", "캐싱 + Batch", combinedRequest),
  ];
}
