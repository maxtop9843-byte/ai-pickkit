import { describe, expect, it } from "vitest";
import { compareModels, comparisonModels } from "./direct-model-comparison";

describe("direct model comparison", () => {
  it("compares monthly cost for the same workload", () => {
    const result = compareModels({
      modelAId: "gpt-5-6-terra",
      modelBId: "claude-sonnet-5",
      monthlyRequests: 100_000,
      inputTokensPerRequest: 2_000,
      outputTokensPerRequest: 500,
    });

    expect(result.monthlyCostAUsd).toBeCloseTo(1_250);
    expect(result.monthlyCostBUsd).toBeCloseTo(900);
    expect(result.cheaperModel?.id).toBe("claude-sonnet-5");
    expect(result.monthlySavingsUsd).toBeCloseTo(350);
  });

  it("sanitizes invalid workload values", () => {
    const result = compareModels({
      modelAId: "gpt-5-6-luna",
      modelBId: "gemini-3-5-flash-lite",
      monthlyRequests: Number.NaN,
      inputTokensPerRequest: -1,
      outputTokensPerRequest: -1,
    });

    expect(result.monthlyRequests).toBe(0);
    expect(result.monthlyCostAUsd).toBe(0);
    expect(result.monthlyCostBUsd).toBe(0);
  });

  it("keeps official sources, verification dates, and context limits", () => {
    for (const model of comparisonModels) {
      expect(model.source).toMatch(/^https:\/\//);
      expect(model.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(model.contextWindowTokens).toBeGreaterThan(0);
    }
  });
});
