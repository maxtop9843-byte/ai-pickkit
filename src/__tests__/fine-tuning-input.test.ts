import { describe, expect, it } from "vitest";
import { normalizeFineTuningInputValue } from "../lib/fine-tuning-cost";

describe("fine-tuning calculator input normalization", () => {
  it("keeps count fields as non-negative integers", () => {
    expect(normalizeFineTuningInputValue("trainingExamples", 12.8)).toBe(12);
    expect(normalizeFineTuningInputValue("monthlyRequests", -5)).toBe(0);
  });

  it("keeps epochs at one or above", () => {
    expect(normalizeFineTuningInputValue("epochs", 0)).toBe(1);
    expect(normalizeFineTuningInputValue("epochs", 3.9)).toBe(3);
  });

  it("normalizes invalid and negative token values", () => {
    expect(normalizeFineTuningInputValue("averageInputTokens", -1)).toBe(0);
    expect(
      normalizeFineTuningInputValue("averageOutputTokens", Number.NaN),
    ).toBe(0);
    expect(
      normalizeFineTuningInputValue(
        "averageTokensPerExample",
        Number.POSITIVE_INFINITY,
      ),
    ).toBe(0);
  });
});
