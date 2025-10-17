import { describe, test, expect } from "vitest";

describe("Frontend Test Setup", () => {
  test("should run basic test", () => {
    expect(1 + 1).toBe(2);
  });

  test("should have vitest globals", () => {
    expect(vi).toBeDefined();
  });
});
