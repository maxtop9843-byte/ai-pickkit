import { describe, expect, it } from "vitest";
import { audioPriceOptions, calculateAudioCost } from "./audio-cost";

describe("audio cost", () => {
  it("calculates speech-to-text monthly cost", () => {
    const option = audioPriceOptions.find(
      (item) => item.id === "google-stt-v2-standard",
    );
    expect(option).toBeDefined();
    expect(calculateAudioCost(option!, 60, 30)).toEqual({
      dailyUsd: 0.96,
      monthlyUsd: 28.799999999999997,
      monthlyAmount: 1800,
    });
  });

  it("calculates text-to-speech monthly cost", () => {
    const option = audioPriceOptions.find(
      (item) => item.id === "google-tts-neural2",
    );
    expect(option).toBeDefined();
    expect(calculateAudioCost(option!, 10000, 30)).toEqual({
      dailyUsd: 0.16,
      monthlyUsd: 4.8,
      monthlyAmount: 300000,
    });
  });

  it("keeps official sources and verification dates for every option", () => {
    expect(audioPriceOptions.length).toBeGreaterThanOrEqual(4);
    expect(audioPriceOptions.some((item) => item.mode === "stt")).toBe(true);
    expect(audioPriceOptions.some((item) => item.mode === "tts")).toBe(true);
    for (const option of audioPriceOptions) {
      expect(option.pricePerUnitUsd).toBeGreaterThan(0);
      expect(option.sourceUrl).toMatch(/^https:\/\//);
      expect(option.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
