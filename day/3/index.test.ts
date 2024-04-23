import { processFile } from "./index";

describe("processFile", () => {
  it("calculates the correct total sum for part one", async () => {
    const result = await processFile("test.txt", 1);
    expect(result).toBe(4361);
  });
  it("calculates the correct total sum for part two", async () => {
    const result = await processFile("test.txt", 2);
    expect(result).toBe(467835);
  });
});
