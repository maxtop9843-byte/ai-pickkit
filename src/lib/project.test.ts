import { describe, expect, it } from "vitest";
import { getToolRoute, toolRoutes } from "./tool-routes";

describe("AI PickKit project", () => {
  it("uses the canonical production domain", () => {
    expect(new URL("https://aipickkit.com").hostname).toBe("aipickkit.com");
  });

  it("defines unique, indexable routes for every public tool", () => {
    expect(toolRoutes).toHaveLength(11);
    expect(new Set(toolRoutes.map((route) => route.href)).size).toBe(11);
    expect(toolRoutes.every((route) => route.href.startsWith("/"))).toBe(true);
    expect(getToolRoute("calculator").href).toBe("/api-cost-calculator");
    expect(getToolRoute("prompt").href).toBe("/prompt-token-calculator");
    expect(getToolRoute("savings").href).toBe("/batch-cache-simulator");
    expect(getToolRoute("models").href).toBe("/models");
    expect(getToolRoute("selector").href).toBe("/model-selector");
    expect(getToolRoute("images").href).toBe(
      "/image-generation-cost-calculator",
    );
    expect(getToolRoute("audio").href).toBe("/audio-cost-calculator");
    expect(getToolRoute("rag").href).toBe("/rag-cost-calculator");
    expect(getToolRoute("fineTuning").href).toBe(
      "/fine-tuning-cost-calculator",
    );
    expect(getToolRoute("agentTools").href).toBe("/agent-tool-cost-calculator");
    expect(getToolRoute("providerBudget").href).toBe(
      "/provider-budget-comparison",
    );
  });
});
