import { describe, expect, it } from "vitest";
import { recommendModels } from "./model-selector";

describe("model selector", () => {
  it("recommends an economy model first for budget support", () => {
    const [first] = recommendModels({
      purpose: "support",
      priority: "budget",
      provider: "any",
      allowPreview: false,
    });

    expect(first.model.tier).toBe("economy");
    expect(first.reasons).toContain("고객 응대 용도 적합도 반영");
  });

  it("honors a provider preference without returning preview models", () => {
    const results = recommendModels({
      purpose: "coding",
      priority: "quality",
      provider: "Anthropic",
      allowPreview: false,
    });

    expect(results[0].model.provider).toBe("Anthropic");
    expect(results).toHaveLength(3);
    expect(results.every(({ model }) => model.status !== "Preview")).toBe(true);
  });

  it("can include preview models only when the user opts in", () => {
    const withoutPreview = recommendModels({
      purpose: "documents",
      priority: "quality",
      provider: "Google",
      allowPreview: false,
    });
    const withPreview = recommendModels({
      purpose: "documents",
      priority: "quality",
      provider: "Google",
      allowPreview: true,
    });

    expect(withoutPreview.some(({ model }) => model.status === "Preview")).toBe(
      false,
    );
    expect(withPreview[0].model.id).toBe("gemini-3-1-pro-preview");
  });
});
