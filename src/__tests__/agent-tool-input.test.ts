import { describe, expect, it } from "vitest";
import { normalizeAgentToolCostInput } from "../lib/agent-tool-cost";

describe("agent tool cost input normalization", () => {
  it("keeps monthly task counts as non-negative integers", () => {
    expect(normalizeAgentToolCostInput("monthlyTasks", -3)).toBe(0);
    expect(normalizeAgentToolCostInput("monthlyTasks", 12.8)).toBe(12);
  });

  it("keeps fractional per-task usage while rejecting invalid values", () => {
    expect(normalizeAgentToolCostInput("modelCallsPerTask", 1.5)).toBe(1.5);
    expect(normalizeAgentToolCostInput("codeSessionsPerTask", -0.1)).toBe(0);
    expect(
      normalizeAgentToolCostInput("otherToolCallsPerTask", Number.NaN),
    ).toBe(0);
  });

  it("normalizes token and price inputs to finite non-negative values", () => {
    expect(normalizeAgentToolCostInput("inputTokensPerCall", -1)).toBe(0);
    expect(
      normalizeAgentToolCostInput(
        "otherToolCostPerCallUsd",
        Number.POSITIVE_INFINITY,
      ),
    ).toBe(0);
  });
});
