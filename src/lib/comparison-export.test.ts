import { describe, expect, it } from "vitest";
import {
  buildComparisonExport,
  comparisonExportFilename,
  serializeComparisonCsv,
  serializeComparisonJson,
} from "./comparison-export";

const input = {
  modelAId: "gpt-5-6-terra",
  modelBId: "claude-sonnet-5",
  monthlyRequests: 100_000,
  inputTokensPerRequest: 2_000,
  outputTokensPerRequest: 500,
};

describe("comparison export", () => {
  it("includes normalized inputs, calculated costs, and official sources", () => {
    const data = buildComparisonExport(input, "2026-07-25T13:00:00.000Z");

    expect(data.input).toEqual(input);
    expect(data.result.modelA.monthlyCostUsd).toBe(1_250);
    expect(data.result.modelB.monthlyCostUsd).toBe(900);
    expect(data.result.cheaperModel).toBe("Claude Sonnet 5");
    expect(data.result.monthlySavingsUsd).toBe(350);
    expect(data.sources).toHaveLength(2);
    expect(data.sources.every((source) => source.url.startsWith("https://"))).toBe(
      true,
    );
  });

  it("serializes reusable JSON and spreadsheet-friendly CSV", () => {
    const data = buildComparisonExport(input, "2026-07-25T13:00:00.000Z");
    const json = serializeComparisonJson(data);
    const csv = serializeComparisonCsv(data);

    expect(JSON.parse(json)).toEqual(data);
    expect(csv).toContain('"model_a_name","GPT-5.6 Terra"');
    expect(csv).toContain('"monthly_savings_usd","350"');
    expect(csv).toContain('"source_a_verified_at","2026-07-23"');
  });

  it("uses a stable date-based filename", () => {
    expect(
      comparisonExportFilename("json", "2026-07-25T13:00:00.000Z"),
    ).toBe("pickkit-model-comparison-2026-07-25.json");
  });
});
