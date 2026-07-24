import { describe, expect, it } from "vitest";
import {
  agentModelPrices,
  calculateAgentToolCost,
  CODE_INTERPRETER_COST_PER_SESSION_USD,
  WEB_SEARCH_COST_PER_CALL_USD,
} from "./agent-tool-cost";

const input = {
  monthlyTasks: 1000,
  modelCallsPerTask: 3,
  inputTokensPerCall: 2000,
  outputTokensPerCall: 500,
  webSearchCallsPerTask: 2,
  codeSessionsPerTask: 0.1,
  otherToolCallsPerTask: 1,
  otherToolCostPerCallUsd: 0.005,
};

describe("agent tool cost", () => {
  it("adds model and tool costs", () => {
    const result = calculateAgentToolCost(agentModelPrices[1], input);

    expect(result.totalModelCalls).toBe(3000);
    expect(result.modelInputUsd).toBeCloseTo(15);
    expect(result.modelOutputUsd).toBeCloseTo(22.5);
    expect(result.webSearchUsd).toBeCloseTo(20);
    expect(result.codeExecutionUsd).toBeCloseTo(3);
    expect(result.otherToolsUsd).toBeCloseTo(5);
    expect(result.monthlyTotalUsd).toBeCloseTo(65.5);
    expect(result.costPerTaskUsd).toBeCloseTo(0.0655);
  });

  it("sanitizes invalid values", () => {
    const result = calculateAgentToolCost(agentModelPrices[0], {
      ...input,
      monthlyTasks: Number.NaN,
      modelCallsPerTask: -1,
    });

    expect(result.monthlyTotalUsd).toBe(0);
    expect(result.costPerTaskUsd).toBe(0);
  });

  it("keeps verified official defaults", () => {
    expect(agentModelPrices).toHaveLength(3);
    expect(WEB_SEARCH_COST_PER_CALL_USD).toBeGreaterThan(0);
    expect(CODE_INTERPRETER_COST_PER_SESSION_USD).toBeGreaterThan(0);
    for (const option of agentModelPrices) {
      expect(option.sourceUrl).toBe(
        "https://developers.openai.com/api/docs/pricing",
      );
      expect(option.verifiedAt).toBe("2026-07-24");
    }
  });
});
