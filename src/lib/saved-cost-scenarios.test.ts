import { describe, expect, it } from "vitest";
import {
  duplicateScenario,
  parseSavedCostScenarios,
  serializeSavedCostScenarios,
  type SavedCostScenario,
} from "./saved-cost-scenarios";

const scenario: SavedCostScenario = {
  id: "scenario-1",
  name: "기본 비교",
  createdAt: "2026-07-24T00:00:00.000Z",
  updatedAt: "2026-07-24T00:00:00.000Z",
  input: {
    modelAId: "gpt-5-6-terra",
    modelBId: "claude-sonnet-5",
    monthlyRequests: 100_000,
    inputTokensPerRequest: 2_000,
    outputTokensPerRequest: 500,
  },
};

describe("saved cost scenarios", () => {
  it("round-trips valid local scenarios", () => {
    expect(
      parseSavedCostScenarios(serializeSavedCostScenarios([scenario])),
    ).toEqual([scenario]);
  });

  it("ignores malformed or unsafe stored data", () => {
    expect(parseSavedCostScenarios("not-json")).toEqual([]);
    expect(
      parseSavedCostScenarios(JSON.stringify([{ name: "broken" }])),
    ).toEqual([]);
  });

  it("duplicates without sharing the input object", () => {
    const copy = duplicateScenario(
      scenario,
      "scenario-2",
      "2026-07-24T01:00:00.000Z",
    );

    expect(copy.id).toBe("scenario-2");
    expect(copy.name).toBe("기본 비교 복사본");
    expect(copy.input).toEqual(scenario.input);
    expect(copy.input).not.toBe(scenario.input);
  });

  it("caps persisted scenarios at twenty", () => {
    const scenarios = Array.from({ length: 24 }, (_, index) => ({
      ...scenario,
      id: `scenario-${index}`,
    }));

    expect(
      parseSavedCostScenarios(serializeSavedCostScenarios(scenarios)),
    ).toHaveLength(20);
  });
});
