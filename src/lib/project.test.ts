import { describe, expect, it } from "vitest";
import { getToolRoute, toolRoutes } from "./tool-routes";

const routeCases = [
  ["calculator", "/api-cost-calculator"],
  ["prompt", "/prompt-token-calculator"],
  ["savings", "/batch-cache-simulator"],
  ["models", "/models"],
  ["selector", "/model-selector"],
  ["images", "/image-generation-cost-calculator"],
  ["audio", "/audio-cost-calculator"],
  ["rag", "/rag-cost-calculator"],
  ["fineTuning", "/fine-tuning-cost-calculator"],
  ["agentTools", "/agent-tool-cost-calculator"],
  ["providerBudget", "/provider-budget-comparison"],
  ["freeCredit", "/free-credit-runway-calculator"],
  ["compositeService", "/composite-service-cost-calculator"],
  ["directComparison", "/model-a-b-comparison"],
  ["budgetCapacity", "/budget-capacity-calculator"],
  ["subscriptionApi", "/subscription-vs-api"],
  ["usageBilling", "/usage-billing-analyzer"],
] as const;

describe("AI PickKit project", () => {
  it("uses the canonical production domain", () => {
    expect(new URL("https://aipickkit.com").hostname).toBe("aipickkit.com");
  });

  it("defines unique, indexable routes for every public tool", () => {
    expect(toolRoutes).toHaveLength(routeCases.length);
    expect(new Set(toolRoutes.map((route) => route.href)).size).toBe(
      routeCases.length,
    );
    expect(toolRoutes.every((route) => route.href.startsWith("/"))).toBe(true);

    for (const [id, href] of routeCases) {
      expect(getToolRoute(id).href).toBe(href);
    }
  });
});
