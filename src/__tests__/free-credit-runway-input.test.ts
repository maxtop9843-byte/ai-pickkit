import { describe, expect, it } from "vitest";
import { normalizeFreeCreditRunwayInput } from "../lib/free-credit-runway";

describe("free credit runway input normalization", () => {
  it("clamps monetary and growth inputs to finite non-negative values", () => {
    const negativeBalance = normalizeFreeCreditRunwayInput("balanceUsd", -100);
    const infiniteUsage = normalizeFreeCreditRunwayInput(
      "dailyUsageUsd",
      Number.POSITIVE_INFINITY,
    );
    const invalidGrowth = normalizeFreeCreditRunwayInput(
      "dailyGrowthPercent",
      Number.NaN,
    );

    expect(negativeBalance).toBe(0);
    expect(infiniteUsage).toBe(0);
    expect(invalidGrowth).toBe(0);
  });

  it("keeps the warning threshold as a positive whole day", () => {
    const minimumThreshold = normalizeFreeCreditRunwayInput(
      "warningThresholdDays",
      0,
    );
    const fractionalThreshold = normalizeFreeCreditRunwayInput(
      "warningThresholdDays",
      14.9,
    );

    expect(minimumThreshold).toBe(1);
    expect(fractionalThreshold).toBe(14);
  });
});
