import { describe, expect, it } from "vitest";
import { normalizeRagInputValue } from "@/lib/rag-input";

describe("RAG calculator input normalization", () => {
  it("clamps bounded fields to their visible limits", () => {
    expect(normalizeRagInputValue("overlapPercent", -10)).toBe(0);
    expect(normalizeRagInputValue("overlapPercent", 120)).toBe(90);
    expect(normalizeRagInputValue("daysPerMonth", 0)).toBe(1);
    expect(normalizeRagInputValue("daysPerMonth", 45)).toBe(31);
  });

  it("keeps required positive values above zero", () => {
    expect(normalizeRagInputValue("chunkTokens", 0)).toBe(1);
    expect(normalizeRagInputValue("reindexEveryDays", -7)).toBe(1);
  });

  it("normalizes negative and non-finite usage values", () => {
    expect(normalizeRagInputValue("documentCount", -1)).toBe(0);
    expect(normalizeRagInputValue("queriesPerDay", Number.NaN)).toBe(0);
  });
});
