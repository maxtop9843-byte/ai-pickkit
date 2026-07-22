import { describe, expect, it } from "vitest";
import { getToolRoute, toolRoutes } from "./tool-routes";

describe("AI PickKit project", () => {
  it("uses the canonical production domain", () => {
    expect(new URL("https://aipickkit.com").hostname).toBe("aipickkit.com");
  });

  it("defines unique, indexable routes for every public tool", () => {
    expect(toolRoutes).toHaveLength(3);
    expect(new Set(toolRoutes.map((route) => route.href)).size).toBe(3);
    expect(toolRoutes.every((route) => route.href.startsWith("/"))).toBe(true);
    expect(getToolRoute("calculator").href).toBe("/api-cost-calculator");
    expect(getToolRoute("models").href).toBe("/models");
    expect(getToolRoute("selector").href).toBe("/model-selector");
  });
});
