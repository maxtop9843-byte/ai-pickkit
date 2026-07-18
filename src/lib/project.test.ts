import { describe, expect, it } from "vitest";

describe("AI PickKit project", () => {
  it("uses the canonical production domain", () => {
    expect(new URL("https://aipickkit.com").hostname).toBe("aipickkit.com");
  });
});
