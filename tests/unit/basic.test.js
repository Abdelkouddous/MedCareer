// Set test environment
process.env.NODE_ENV = "test";

describe("Basic Test Suite", () => {
  test("should run basic test", () => {
    expect(1 + 1).toBe(2);
  });

  test("should have test environment", () => {
    expect(process.env.NODE_ENV).toBe("test");
  });
});
