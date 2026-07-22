import { describe, expect, it } from "vitest";
import { getCatalogModel } from "./model-catalog";
import {
  estimatePromptCost,
  estimatePromptTokens,
} from "./prompt-cost-estimator";

describe("prompt token and cost estimator", () => {
  it("returns an explicit range and text diagnostics", () => {
    const result = estimatePromptTokens("Hello AI\n안녕하세요");

    expect(result.characters).toBe(14);
    expect(result.words).toBe(3);
    expect(result.lines).toBe(2);
    expect(result.cjkCharacters).toBe(5);
    expect(result.lower).toBeGreaterThan(0);
    expect(result.upper).toBeGreaterThan(result.lower);
  });

  it("returns a zero token range for empty or whitespace-only input", () => {
    expect(estimatePromptTokens("   \n")).toMatchObject({ lower: 0, upper: 0 });
  });

  it("uses canonical model prices for per-request and monthly ranges", () => {
    const model = getCatalogModel("claude-sonnet-5");
    const result = estimatePromptCost({
      estimate: { lower: 100, upper: 200 },
      outputTokens: 500,
      requestsPerDay: 10,
      model,
    });

    expect(result.requestLower).toBe(0.0052);
    expect(result.requestUpper).toBe(0.0054);
    expect(result.monthlyRequests).toBe(300);
    expect(result.monthlyLower).toBeCloseTo(1.56);
    expect(result.monthlyUpper).toBeCloseTo(1.62);
  });

  it("never inverts the calculated cost range", () => {
    const result = estimatePromptCost({
      estimate: estimatePromptTokens("const answer = 42;"),
      outputTokens: 0,
      requestsPerDay: 0,
      model: getCatalogModel("gpt-5-6-luna"),
    });

    expect(result.requestUpper).toBeGreaterThanOrEqual(result.requestLower);
    expect(result.monthlyLower).toBe(0);
    expect(result.monthlyUpper).toBe(0);
  });
});
