import { describe, expect, it } from "vitest";
import { normalizeFreeCreditRunwayInput } from "../lib/free-credit-runway";

describe("free credit runway input normalization", () => {
  it("clamps monetary and growth inputs to finite non-negative values", () => {
    expect(normalizeFreeCreditRunwayInput("balanceUsd", -100)).toBe(0);
    expect(
      normalizeFreeCreditRunwayInput("dailyUsageUsd", Number.POSITIVE_INFINITY),
    ).toBe(0);
    expect(normalizeFreeCreditRunwayInput("dailyGrowthPercent", Number.NaN)).toBe(
      0,
    );
  });

  it("keeps the warning threshold as a positive whole day", () => {
    expect(normalizeFreeCreditRunwayInput("warningThresholdDays", 0)).toBe(1);
    expect(normalizeFreeCreditRunwayInput("warningThresholdDays", 14.9)).toBe(
      14,
    );
  });
});
