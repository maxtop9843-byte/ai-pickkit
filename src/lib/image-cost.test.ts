import { describe, expect, it } from "vitest";
import { calculateImageCost, imagePriceOptions } from "./image-cost";

describe("image generation cost", () => {
  it("calculates daily and monthly image cost", () => {
    expect(calculateImageCost(0.067, 100, 30)).toEqual({
      dailyUsd: 6.7,
      monthlyUsd: 201,
      imagesPerMonth: 3000,
    });
  });

  it("keeps official sources and verification dates for every option", () => {
    expect(imagePriceOptions.length).toBeGreaterThanOrEqual(6);
    for (const option of imagePriceOptions) {
      expect(option.pricePerImageUsd).toBeGreaterThan(0);
      expect(option.sourceUrl).toMatch(/^https:\/\//);
      expect(option.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
