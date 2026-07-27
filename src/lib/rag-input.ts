import type { RagCostInput } from "./rag-cost";

export function normalizeRagInputValue(
  key: keyof RagCostInput,
  value: number,
) {
  const finiteValue = Number.isFinite(value) ? value : 0;

  if (key === "overlapPercent") {
    return Math.min(90, Math.max(0, finiteValue));
  }

  if (key === "daysPerMonth") {
    return Math.min(31, Math.max(1, finiteValue));
  }

  if (key === "chunkTokens" || key === "reindexEveryDays") {
    return Math.max(1, finiteValue);
  }

  return Math.max(0, finiteValue);
}
