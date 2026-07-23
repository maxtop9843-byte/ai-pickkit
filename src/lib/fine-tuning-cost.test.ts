import { describe, expect, it } from "vitest";
import {
  calculateFineTuningCost,
  fineTuningPriceOptions,
} from "./fine-tuning-cost";

const baseInput = {
  trainingExamples: 5000,
  averageTokensPerExample: 600,
  epochs: 3,
  monthlyRequests: 100000,
  averageInputTokens: 500,
  averageOutputTokens: 150,
};

describe("fine-tuning cost", () => {
  it("calculates training and monthly inference cost", () => {
    const result = calculateFineTuningCost(
      fineTuningPriceOptions[0],
      baseInput,
    );

    expect(result.datasetTokens).toBe(3_000_000);
    expect(result.billableTrainingTokens).toBe(9_000_000);
    expect(result.trainingUsd).toBeCloseTo(27);
    expect(result.monthlyInputUsd).toBeCloseTo(7.5);
    expect(result.monthlyOutputUsd).toBeCloseTo(9);
    expect(result.monthlyInferenceUsd).toBeCloseTo(16.5);
    expect(result.firstMonthUsd).toBeCloseTo(43.5);
  });

  it("sanitizes negative and invalid values", () => {
    const result = calculateFineTuningCost(fineTuningPriceOptions[0], {
      ...baseInput,
      trainingExamples: -10,
      monthlyRequests: Number.NaN,
      epochs: 0,
    });

    expect(result.datasetTokens).toBe(0);
    expect(result.billableTrainingTokens).toBe(0);
    expect(result.monthlyInferenceUsd).toBe(0);
  });

  it("keeps verified official sources", () => {
    expect(fineTuningPriceOptions).toHaveLength(2);
    for (const option of fineTuningPriceOptions) {
      expect(option.trainingPerMillionTokensUsd).toBeGreaterThan(0);
      expect(option.inputPerMillionTokensUsd).toBeGreaterThan(0);
      expect(option.outputPerMillionTokensUsd).toBeGreaterThan(0);
      expect(option.sourceUrl).toBe(
        "https://cloud.google.com/vertex-ai/generative-ai/pricing",
      );
      expect(option.verifiedAt).toBe("2026-07-24");
    }
  });
});
