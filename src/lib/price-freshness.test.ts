import { describe, expect, it } from "vitest";
import { catalogModels, providerSources } from "./model-catalog";
import { buildPriceFreshnessReport } from "./price-freshness";

const sourceChecks = Object.entries(providerSources).map(([provider, source]) => ({
  provider: provider as keyof typeof providerSources,
  url: source.url,
  ok: true,
  status: 200,
  checkedAt: "2026-07-26T00:00:00.000Z",
}));

describe("buildPriceFreshnessReport", () => {
  it("marks models as candidates when the verification age exceeds the threshold", () => {
    const report = buildPriceFreshnessReport({
      models: catalogModels,
      sources: providerSources,
      catalogVerifiedAt: "2026-07-23",
      sourceChecks,
      now: new Date("2026-08-10T00:00:00.000Z"),
      staleAfterDays: 14,
    });

    expect(report.candidates).toHaveLength(catalogModels.length);
    expect(report.markdown).toContain("가격 데이터를 자동 수정하지 않습니다");
    expect(report.markdown).toContain(providerSources.OpenAI.url);
  });

  it("marks only the affected provider when an official source is unavailable", () => {
    const checks = sourceChecks.map((check) =>
      check.provider === "Google"
        ? { ...check, ok: false, status: 503 }
        : check,
    );
    const report = buildPriceFreshnessReport({
      models: catalogModels,
      sources: providerSources,
      catalogVerifiedAt: "2026-07-23",
      sourceChecks: checks,
      now: new Date("2026-07-26T00:00:00.000Z"),
      staleAfterDays: 14,
    });

    expect(report.candidates).toHaveLength(
      catalogModels.filter((model) => model.provider === "Google").length,
    );
    expect(report.candidates.every((candidate) => candidate.provider === "Google")).toBe(true);
    expect(report.markdown).toContain("출처 HTTP 503");
  });

  it("returns no candidates when dates and official sources are fresh", () => {
    const report = buildPriceFreshnessReport({
      models: catalogModels,
      sources: providerSources,
      catalogVerifiedAt: "2026-07-23",
      sourceChecks,
      now: new Date("2026-07-26T00:00:00.000Z"),
      staleAfterDays: 14,
    });

    expect(report.candidates).toEqual([]);
    expect(report.markdown).toContain("변경 후보가 없습니다");
  });
});
