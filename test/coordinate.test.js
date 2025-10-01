import { createCoordinate } from "../src/domain/placement/coordinate";

describe("createCoordinate", () => {
  test("returns object with x = 5, y = 8", () => {
    expect(createCoordinate(5, 8)).toMatchObject({ x: 5, y: 8 });
  });
});
