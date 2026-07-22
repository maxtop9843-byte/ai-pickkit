import { describe, expect, it } from "vitest";
import { calculateCost, modelPrices } from "./cost-calculator";
import { getCatalogModel } from "./model-catalog";

describe("API cost calculator", () => {
  it("calculates request, daily, and 30-day costs", () => {
    const result = calculateCost(
      {
        usersPerDay: 100,
        requestsPerUser: 5,
        inputTokens: 1000,
        outputTokens: 500,
      },
      modelPrices[0],
    );

    expect(result.requestCost).toBe(0.0035);
    expect(result.daily).toBe(1.75);
    expect(result.monthly).toBe(52.5);
    expect(result.perUserMonthly).toBe(0.525);
  });

  it("applies a 50% batch discount and cheaper cache-hit input", () => {
    const result = calculateCost(
      {
        usersPerDay: 100,
        requestsPerUser: 5,
        inputTokens: 1000,
        outputTokens: 500,
      },
      modelPrices[1],
    );

    expect(result.batchMonthly).toBe(result.monthly * 0.5);
    expect(result.cachedMonthly).toBeLessThan(result.monthly);
  });

  it("does not divide by zero users", () => {
    const result = calculateCost(
      {
        usersPerDay: 0,
        requestsPerUser: 5,
        inputTokens: 1000,
        outputTokens: 500,
      },
      modelPrices[0],
    );

    expect(result.monthly).toBe(0);
    expect(result.perUserMonthly).toBe(0);
  });

  it("derives calculator prices and evidence from the canonical catalog", () => {
    for (const model of modelPrices) {
      const canonical = getCatalogModel(model.id);
      expect(model.inputPerMillion).toBe(canonical.inputPerMillion);
      expect(model.outputPerMillion).toBe(canonical.outputPerMillion);
      expect(model.cachedInputPerMillion).toBe(canonical.cachedInputPerMillion);
      expect(model.source).toBe(canonical.source);
      expect(model.verifiedAt).toBe(canonical.verifiedAt);
    }
  });
});
