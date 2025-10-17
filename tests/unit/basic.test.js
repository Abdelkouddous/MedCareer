import { test, describe } from "node:test";
import assert from "node:assert";

// Set test environment
process.env.NODE_ENV = "test";

describe("Basic Test Suite", () => {
  test("should run basic test", () => {
    assert.strictEqual(1 + 1, 2);
  });

  test("should have test environment", () => {
    assert.strictEqual(process.env.NODE_ENV, "test");
  });
});
