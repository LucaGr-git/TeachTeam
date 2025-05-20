import { sum } from "./sum"; // basic sum function 

describe("sum module: This should only fail if there is a problem with jest config/setup", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3);
  });
});