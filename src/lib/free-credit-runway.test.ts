import { describe, expect, it } from "vitest";
import { calculateFreeCreditRunway } from "./free-credit-runway";

describe("free credit runway calculator", () => {
  it("projects a finite runway with daily growth", () => {
    const result = calculateFreeCreditRunway({
      balanceUsd: 300,
      dailyUsageUsd: 8,
      dailyGrowthPercent: 2,
      warningThresholdDays: 30,
    });

    expect(result.daysRemaining).toBe(29);
    expect(result.status).toBe("warning");
    expect(result.endingDailyUsageUsd).toBeGreaterThan(8);
  });

  it("returns no exhaustion when daily usage is zero", () => {
    const result = calculateFreeCreditRunway({
      balanceUsd: 300,
      dailyUsageUsd: 0,
      dailyGrowthPercent: 2,
      warningThresholdDays: 30,
    });

    expect(result.daysRemaining).toBeNull();
    expect(result.status).toBe("safe");
  });

  it("sanitizes invalid values", () => {
    const result = calculateFreeCreditRunway({
      balanceUsd: Number.NaN,
      dailyUsageUsd: -1,
      dailyGrowthPercent: -1,
      warningThresholdDays: -1,
    });

    expect(result.daysRemaining).toBe(0);
    expect(result.status).toBe("critical");
  });
});
