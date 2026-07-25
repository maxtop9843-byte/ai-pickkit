import { describe, expect, it } from "vitest";
import { calculateBudgetCapacity } from "./budget-capacity";

describe("calculateBudgetCapacity", () => {
  it("calculates request and user capacity from a monthly budget", () => {
    const result = calculateBudgetCapacity({
      monthlyBudgetUsd: 100,
      inputTokensPerRequest: 1_000,
      outputTokensPerRequest: 500,
      requestsPerUser: 100,
    });

    const luna = result.rows.find((row) => row.model.id === "gpt-5-6-luna");
    expect(luna?.costPerRequestUsd).toBe(0.004);
    expect(luna?.maxMonthlyRequests).toBe(25_000);
    expect(luna?.maxMonthlyUsers).toBe(250);
  });

  it("recommends the model with the greatest user capacity", () => {
    const result = calculateBudgetCapacity({
      monthlyBudgetUsd: 50,
      inputTokensPerRequest: 2_000,
      outputTokensPerRequest: 500,
      requestsPerUser: 80,
    });

    expect(result.recommended?.model.id).toBe("gemini-3-5-flash-lite");
    expect(result.rows[0].maxMonthlyUsers).toBeGreaterThanOrEqual(
      result.rows[1].maxMonthlyUsers,
    );
  });

  it("normalizes invalid and negative inputs without producing infinity", () => {
    const result = calculateBudgetCapacity({
      monthlyBudgetUsd: Number.NaN,
      inputTokensPerRequest: -1,
      outputTokensPerRequest: -1,
      requestsPerUser: 0,
    });

    expect(result.monthlyBudgetUsd).toBe(0);
    expect(result.requestsPerUser).toBe(1);
    expect(
      result.rows.every((row) => Number.isFinite(row.maxMonthlyRequests)),
    ).toBe(true);
  });
});
