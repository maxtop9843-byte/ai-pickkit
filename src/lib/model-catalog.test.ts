import { describe, expect, it } from "vitest";
import { blendedPrice, catalogModels } from "./model-catalog";

describe("model catalog", () => {
  it("contains three verified models per provider", () => {
    expect(catalogModels).toHaveLength(9);
    for (const provider of ["OpenAI", "Anthropic", "Google"]) {
      expect(
        catalogModels.filter((model) => model.provider === provider),
      ).toHaveLength(3);
    }
  });

  it("has official sources and valid prices", () => {
    for (const model of catalogModels) {
      expect(model.source).toMatch(/^https:\/\//);
      expect(model.inputPerMillion).toBeGreaterThan(0);
      expect(model.outputPerMillion).toBeGreaterThan(model.inputPerMillion);
      expect(blendedPrice(model)).toBe(
        model.inputPerMillion + model.outputPerMillion,
      );
    }
  });
});
