import { getPlacementStrategy } from "../src/js/domain/placement/strategies";

describe("getPlacementStrategy", () => {
  test("throws error for unknown orientation", () => {
    expect(() => getPlacementStrategy("diagonal")).toThrow("Unknown orientation: diagonal");
  });

  test("returns an array for horizontal orientation", () => {
    const strategy = getPlacementStrategy("horizontal");
    const result = strategy.calculatePositions({ x: 0, y: 0 }, 2);
    expect(result).toEqual(
      expect.arrayContaining([
        [0, 0],
        [1, 0],
      ])
    );
  });

  test("returns false if horizontal ship out of bounds", () => {
    const strategy = getPlacementStrategy("horizontal");
    const result = strategy.isWithinBounds({ x: 9, y: 9 }, 5, 10);
    expect(result).toBeFalsy();
  });

  test("returns true if horizontal ship is within bounds", () => {
    const strategy = getPlacementStrategy("horizontal");
    const result = strategy.isWithinBounds({ x: 0, y: 0 }, 2, 10);
    expect(result).toBeTruthy();
  });

  test("returns an array for vertical orientation", () => {
    const strategy = getPlacementStrategy("vertical");
    const result = strategy.calculatePositions({ x: 0, y: 0 }, 2);
    expect(result).toEqual(
      expect.arrayContaining([
        [0, 0],
        [0, 1],
      ])
    );
  });

  test("returns false if horizontal ship out of bounds", () => {
    const strategy = getPlacementStrategy("vertical");
    const result = strategy.isWithinBounds({ x: 9, y: 9 }, 5, 10);
    expect(result).toBeFalsy();
  });

  test("returns true if vertical ship is within bounds", () => {
    const strategy = getPlacementStrategy("vertical");
    const result = strategy.isWithinBounds({ x: 0, y: 0 }, 2, 10);
    expect(result).toBeTruthy();
  });
});
