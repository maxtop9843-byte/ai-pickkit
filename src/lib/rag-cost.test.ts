import { describe, expect, it } from "vitest";
import { calculateRagCost, embeddingPriceOptions } from "./rag-cost";

const baseInput = {
  documentCount: 1000,
  averageTokensPerDocument: 1000,
  chunkTokens: 500,
  overlapPercent: 20,
  queriesPerDay: 100,
  averageQueryTokens: 24,
  daysPerMonth: 30,
  reindexEveryDays: 30,
};

describe("RAG cost", () => {
  it("calculates indexing and query embedding cost", () => {
    const option = embeddingPriceOptions[0];
    const result = calculateRagCost(option, baseInput);

    expect(result.chunkCount).toBe(2500);
    expect(result.indexingRuns).toBe(1);
    expect(result.indexingTokens).toBe(1_250_000);
    expect(result.queryTokens).toBe(72_000);
    expect(result.monthlyUsd).toBeCloseTo(0.02644);
  });

  it("includes repeated indexing runs", () => {
    const result = calculateRagCost(embeddingPriceOptions[0], {
      ...baseInput,
      reindexEveryDays: 7,
    });

    expect(result.indexingRuns).toBe(5);
    expect(result.indexingTokens).toBe(6_250_000);
  });

  it("keeps verified official sources", () => {
    expect(embeddingPriceOptions).toHaveLength(2);
    for (const option of embeddingPriceOptions) {
      expect(option.pricePerMillionTokensUsd).toBeGreaterThan(0);
      expect(option.sourceUrl).toMatch(/^https:\/\/developers\.openai\.com/);
      expect(option.verifiedAt).toBe("2026-07-24");
    }
  });
});
