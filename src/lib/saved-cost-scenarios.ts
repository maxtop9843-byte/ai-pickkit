import {
  comparisonModels,
  type DirectComparisonInput,
} from "./direct-model-comparison";

export const SAVED_COST_SCENARIOS_KEY = "pickkit.saved-cost-scenarios.v1";

export type SavedCostScenario = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  input: DirectComparisonInput;
};

const comparisonModelIds = new Set(comparisonModels.map((model) => model.id));

function isFiniteNonNegative(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isValidIsoDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    Number.isFinite(Date.parse(value))
  );
}

function isScenario(value: unknown): value is SavedCostScenario {
  if (!value || typeof value !== "object") return false;

  const scenario = value as Partial<SavedCostScenario>;
  const input = scenario.input as Partial<DirectComparisonInput> | undefined;

  return Boolean(
    typeof scenario.id === "string" &&
    scenario.id.trim().length > 0 &&
    typeof scenario.name === "string" &&
    scenario.name.trim().length > 0 &&
    isValidIsoDate(scenario.createdAt) &&
    isValidIsoDate(scenario.updatedAt) &&
    input &&
    typeof input.modelAId === "string" &&
    comparisonModelIds.has(input.modelAId) &&
    typeof input.modelBId === "string" &&
    comparisonModelIds.has(input.modelBId) &&
    isFiniteNonNegative(input.monthlyRequests) &&
    isFiniteNonNegative(input.inputTokensPerRequest) &&
    isFiniteNonNegative(input.outputTokensPerRequest),
  );
}

export function parseSavedCostScenarios(
  raw: string | null,
): SavedCostScenario[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const seenIds = new Set<string>();
    const scenarios: SavedCostScenario[] = [];

    for (const value of parsed) {
      if (!isScenario(value)) continue;

      const id = value.id.trim();
      if (seenIds.has(id)) continue;

      seenIds.add(id);
      scenarios.push({
        ...value,
        id,
        name: value.name.trim(),
        input: { ...value.input },
      });

      if (scenarios.length === 20) break;
    }

    return scenarios;
  } catch {
    return [];
  }
}

export function serializeSavedCostScenarios(scenarios: SavedCostScenario[]) {
  return JSON.stringify(scenarios.slice(0, 20));
}

export function duplicateScenario(
  scenario: SavedCostScenario,
  id: string,
  now: string,
): SavedCostScenario {
  return {
    ...scenario,
    id,
    name: `${scenario.name} 복사본`,
    createdAt: now,
    updatedAt: now,
    input: { ...scenario.input },
  };
}
