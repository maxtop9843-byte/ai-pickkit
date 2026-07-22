import { describe, expect, it } from "vitest";
import { getCatalogModel } from "./model-catalog";
import { calculateSavingsScenarios } from "./savings-simulator";

const baseInput = {
  inputTokens: 1000,
  outputTokens: 500,
  requestsPerDay: 100,
  repeatedInputPercent: 80,
  cacheHitPercent: 50,
  batchPercent: 100,
};

describe("Batch and cache savings simulator", () => {
  it("keeps the baseline equal to canonical token pricing", () => {
    const model = getCatalogModel("claude-sonnet-5");
    const [baseline] = calculateSavingsScenarios(baseInput, model);

    expect(baseline.requestCost).toBe(0.007);
    expect(baseline.monthlyCost).toBe(21);
    expect(baseline.monthlySavings).toBe(0);
  });

  it("discounts only repeated input tokens that hit the cache", () => {
    const model = getCatalogModel("claude-sonnet-5");
    const [, cached] = calculateSavingsScenarios(baseInput, model);

    expect(cached.requestCost).toBe(0.00628);
    expect(cached.monthlyCost).toBeCloseTo(18.84);
    expect(cached.monthlySavings).toBeCloseTo(2.16);
  });

  it("applies the Batch discount only to the selected Batch share", () => {
    const model = getCatalogModel("claude-sonnet-5");
    const scenarios = calculateSavingsScenarios(
      { ...baseInput, batchPercent: 40 },
      model,
    );

    expect(scenarios[2].monthlyCost).toBeCloseTo(16.8);
    expect(scenarios[2].savingsPercent).toBeCloseTo(20);
  });

  it("combines assumptions without producing negative costs", () => {
    const model = getCatalogModel("gemini-3-5-flash-lite");
    const scenarios = calculateSavingsScenarios(
      {
        ...baseInput,
        repeatedInputPercent: 200,
        cacheHitPercent: 200,
        batchPercent: 200,
      },
      model,
    );

    expect(scenarios.every((scenario) => scenario.monthlyCost >= 0)).toBe(true);
    expect(scenarios[3].monthlyCost).toBeLessThanOrEqual(
      scenarios[1].monthlyCost,
    );
  });
});
