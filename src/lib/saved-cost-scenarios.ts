import {
  comparisonModels,
  type DirectComparisonInput,
} from "@/lib/direct-model-comparison";

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

function isScenario(value: unknown): value is SavedCostScenario {
  if (!value || typeof value !== "object") return false;

  const scenario = value as Partial<SavedCostScenario>;
  const input = scenario.input as Partial<DirectComparisonInput> | undefined;

  return Boolean(
    typeof scenario.id === "string" &&
    scenario.id.length > 0 &&
    typeof scenario.name === "string" &&
    scenario.name.trim().length > 0 &&
    typeof scenario.createdAt === "string" &&
    typeof scenario.updatedAt === "string" &&
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
    return parsed.filter(isScenario).slice(0, 20);
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
