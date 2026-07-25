import type { DirectComparisonInput } from "./direct-model-comparison";
import { compareModels } from "./direct-model-comparison";

export type ComparisonExport = {
  exportedAt: string;
  input: DirectComparisonInput;
  result: {
    modelA: {
      id: string;
      provider: string;
      name: string;
      monthlyCostUsd: number;
    };
    modelB: {
      id: string;
      provider: string;
      name: string;
      monthlyCostUsd: number;
    };
    cheaperModel: string | null;
    monthlySavingsUsd: number;
  };
  sources: Array<{
    provider: string;
    url: string;
    verifiedAt: string;
  }>;
};

export function buildComparisonExport(
  input: DirectComparisonInput,
  exportedAt = new Date().toISOString(),
): ComparisonExport {
  const result = compareModels(input);

  return {
    exportedAt,
    input: {
      modelAId: result.modelA.id,
      modelBId: result.modelB.id,
      monthlyRequests: result.monthlyRequests,
      inputTokensPerRequest: result.inputTokensPerRequest,
      outputTokensPerRequest: result.outputTokensPerRequest,
    },
    result: {
      modelA: {
        id: result.modelA.id,
        provider: result.modelA.provider,
        name: result.modelA.name,
        monthlyCostUsd: result.monthlyCostAUsd,
      },
      modelB: {
        id: result.modelB.id,
        provider: result.modelB.provider,
        name: result.modelB.name,
        monthlyCostUsd: result.monthlyCostBUsd,
      },
      cheaperModel: result.cheaperModel?.name ?? null,
      monthlySavingsUsd: result.monthlySavingsUsd,
    },
    sources: [result.modelA, result.modelB].map((model) => ({
      provider: model.provider,
      url: model.source,
      verifiedAt: model.verifiedAt,
    })),
  };
}

function csvCell(value: string | number | null) {
  const text = value === null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function serializeComparisonJson(data: ComparisonExport) {
  return `${JSON.stringify(data, null, 2)}\n`;
}

export function serializeComparisonCsv(data: ComparisonExport) {
  const rows: Array<[string, string | number | null]> = [
    ["exported_at", data.exportedAt],
    ["model_a_id", data.result.modelA.id],
    ["model_a_provider", data.result.modelA.provider],
    ["model_a_name", data.result.modelA.name],
    ["model_a_monthly_cost_usd", data.result.modelA.monthlyCostUsd],
    ["model_b_id", data.result.modelB.id],
    ["model_b_provider", data.result.modelB.provider],
    ["model_b_name", data.result.modelB.name],
    ["model_b_monthly_cost_usd", data.result.modelB.monthlyCostUsd],
    ["monthly_requests", data.input.monthlyRequests],
    ["input_tokens_per_request", data.input.inputTokensPerRequest],
    ["output_tokens_per_request", data.input.outputTokensPerRequest],
    ["cheaper_model", data.result.cheaperModel],
    ["monthly_savings_usd", data.result.monthlySavingsUsd],
    ["source_a", data.sources[0]?.url ?? ""],
    ["source_a_verified_at", data.sources[0]?.verifiedAt ?? ""],
    ["source_b", data.sources[1]?.url ?? ""],
    ["source_b_verified_at", data.sources[1]?.verifiedAt ?? ""],
  ];

  return `field,value\n${rows
    .map(([field, value]) => `${csvCell(field)},${csvCell(value)}`)
    .join("\n")}\n`;
}

export function comparisonExportFilename(
  format: "csv" | "json",
  exportedAt: string,
) {
  return `pickkit-model-comparison-${exportedAt.slice(0, 10)}.${format}`;
}
