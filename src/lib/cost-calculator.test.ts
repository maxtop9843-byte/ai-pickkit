import { describe, expect, it } from "vitest";
import {
  calculateCost,
  createCalculatorShareUrl,
  DEFAULT_CALCULATOR_STATE,
  modelPrices,
  parseCalculatorState,
  serializeCalculatorState,
} from "./cost-calculator";
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

  it("round-trips every calculator input through a share URL", () => {
    const state = {
      presetId: "coding",
      usersPerDay: 321,
      requestsPerUser: 7,
      inputTokens: 9000,
      outputTokens: 2500,
    };

    const query = serializeCalculatorState(state);
    expect(parseCalculatorState(query)).toEqual(state);
    expect(createCalculatorShareUrl(state)).toBe(
      "https://aipickkit.com/api-cost-calculator?preset=coding&users=321&requests=7&input=9000&output=2500",
    );
  });

  it("falls back safely for unknown, negative, fractional, and excessive values", () => {
    expect(
      parseCalculatorState(
        "preset=unknown&users=-1&requests=1.5&input=NaN&output=999999999",
      ),
    ).toEqual(DEFAULT_CALCULATOR_STATE);
  });

  it("uses the selected preset token sizes when token parameters are omitted", () => {
    expect(parseCalculatorState("preset=document&users=12&requests=3")).toEqual(
      {
        presetId: "document",
        usersPerDay: 12,
        requestsPerUser: 3,
        inputTokens: 6000,
        outputTokens: 700,
      },
    );
  });
});
