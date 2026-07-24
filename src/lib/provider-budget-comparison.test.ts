import { describe, expect, it } from "vitest";
import {
  compareProviderBudgets,
  providerPrices,
} from "./provider-budget-comparison";

describe("provider budget comparison", () => {
  it("compares the same workload across providers", () => {
    const result = compareProviderBudgets({
      monthlyRequests: 10000,
      inputTokensPerRequest: 2000,
      outputTokensPerRequest: 500,
      monthlyBudgetUsd: 100,
    });

    expect(result).toHaveLength(3);
    expect(result[0].provider).toBe("Google");
    expect(result[0].monthlyCostUsd).toBeCloseTo(25);
    expect(result[1].monthlyCostUsd).toBeCloseTo(125);
    expect(result[2].monthlyCostUsd).toBeCloseTo(135);
    expect(result[0].withinBudget).toBe(true);
    expect(result[1].withinBudget).toBe(false);
  });

  it("sanitizes invalid values", () => {
    const result = compareProviderBudgets({
      monthlyRequests: Number.NaN,
      inputTokensPerRequest: -1,
      outputTokensPerRequest: -1,
      monthlyBudgetUsd: -1,
    });

    expect(result.every((item) => item.monthlyCostUsd === 0)).toBe(true);
  });

  it("keeps official sources and verification dates", () => {
    expect(providerPrices).toHaveLength(3);
    for (const provider of providerPrices) {
      expect(provider.sourceUrl).toMatch(/^https:\/\//);
      expect(provider.verifiedAt).toBe("2026-07-24");
    }
  });
});
