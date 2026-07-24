import { describe, expect, it } from "vitest";
import {
  calculateCompositeServiceCost,
  compositePricing,
} from "./composite-service-cost";

describe("composite AI service cost calculator", () => {
  it("combines text, image, audio, and search costs", () => {
    const result = calculateCompositeServiceCost({
      monthlyRequests: 10000,
      inputTokensPerRequest: 2000,
      outputTokensPerRequest: 500,
      imagesPerRequest: 0.1,
      audioMinutesPerRequest: 0.5,
      searchesPerRequest: 1,
      targetMarginPercent: 70,
    });

    expect(result.textCostPerRequestUsd).toBeCloseTo(0.0125);
    expect(result.imageCostPerRequestUsd).toBeCloseTo(0.0034);
    expect(result.audioCostPerRequestUsd).toBeCloseTo(0.0085);
    expect(result.searchCostPerRequestUsd).toBeCloseTo(0.01);
    expect(result.unitCostUsd).toBeCloseTo(0.0344);
    expect(result.monthlyCostUsd).toBeCloseTo(344);
    expect(result.suggestedPricePerRequestUsd).toBeCloseTo(
      0.1146666667,
    );
  });

  it("sanitizes invalid values and caps the target margin", () => {
    const result = calculateCompositeServiceCost({
      monthlyRequests: Number.NaN,
      inputTokensPerRequest: -1,
      outputTokensPerRequest: -1,
      imagesPerRequest: -1,
      audioMinutesPerRequest: -1,
      searchesPerRequest: -1,
      targetMarginPercent: 200,
    });

    expect(result.monthlyRequests).toBe(0);
    expect(result.unitCostUsd).toBe(0);
    expect(result.monthlyCostUsd).toBe(0);
  });

  it("keeps an official pricing source and verification date", () => {
    expect(compositePricing.sourceUrl).toMatch(/^https:\/\//);
    expect(compositePricing.verifiedAt).toBe("2026-07-24");
  });
});
