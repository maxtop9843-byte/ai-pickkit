import { describe, expect, it } from "vitest";
import { normalizeCompositeServiceCostInput } from "../lib/composite-service-cost";

describe("composite service cost input normalization", () => {
  it("keeps request and token counts as finite non-negative integers", () => {
    const fractionalRequests = normalizeCompositeServiceCostInput(
      "monthlyRequests",
      100.9,
    );
    const negativeInputTokens = normalizeCompositeServiceCostInput(
      "inputTokensPerRequest",
      -500,
    );
    const infiniteOutputTokens = normalizeCompositeServiceCostInput(
      "outputTokensPerRequest",
      Number.POSITIVE_INFINITY,
    );

    expect(fractionalRequests).toBe(100);
    expect(negativeInputTokens).toBe(0);
    expect(infiniteOutputTokens).toBe(0);
  });

  it("clamps continuous usage and margin inputs to their valid ranges", () => {
    const invalidImages = normalizeCompositeServiceCostInput(
      "imagesPerRequest",
      Number.NaN,
    );
    const negativeAudio = normalizeCompositeServiceCostInput(
      "audioMinutesPerRequest",
      -1,
    );
    const fractionalSearches = normalizeCompositeServiceCostInput(
      "searchesPerRequest",
      1.5,
    );
    const excessiveMargin = normalizeCompositeServiceCostInput(
      "targetMarginPercent",
      120,
    );

    expect(invalidImages).toBe(0);
    expect(negativeAudio).toBe(0);
    expect(fractionalSearches).toBe(1.5);
    expect(excessiveMargin).toBe(95);
  });
});
