jest.mock("../src/js/domain/placement/strategies");

import createPlayer from "../src/js/player";
import { getPlacementStrategy } from "../src/js/domain/placement/strategies";
import { validatePlacement } from "../src/js/domain/placement/validation";

let human;
let mockStrategy;
let mockPlacement;
let mockValidate;

beforeEach(() => {
  human = createPlayer(1, "Player");
  mockPlacement = { start: { x: 0, y: 0 }, length: 2, orientation: "horizontal" };
  mockStrategy = {
    calculatePositions: jest.fn(),
    isWithinBounds: jest.fn(),
  };
  mockValidate = { isValidPlacement: jest.fn() };

  getPlacementStrategy.mockReturnValue(mockStrategy);
});

describe("validatePlacement", () => {
  test("returns false if placement is out of bounds", () => {
    mockStrategy.isWithinBounds.mockReturnValue(false);
    mockStrategy.calculatePositions.mockReturnValue([{ x: 0, y: 0 }]);

    const result = validatePlacement(human, mockPlacement);

    expect(result).toEqual({ success: false, reason: "OUT_OF_BOUNDS" });
    expect(getPlacementStrategy).toHaveBeenCalledWith("horizontal");
    expect(mockStrategy.isWithinBounds).toHaveBeenCalledWith({ x: 0, y: 0 }, 2, 10);
    expect(mockValidate.isValidPlacement).not.toHaveBeenCalledWith(expect.any(Array), expect.any(Array));
  });

  test("returns false if placement is invalid position", () => {
    human.gameboard.placeShip(0, 0, 2, "horizontal");

    mockStrategy.isWithinBounds.mockReturnValue(true);
    mockStrategy.calculatePositions.mockReturnValue([
      [0, 1],
      [0, 2],
    ]);

    const result = validatePlacement(human, mockPlacement);

    expect(result).toEqual({ success: false, reason: "INVALID_POSITION" });
    expect(getPlacementStrategy).toHaveBeenCalledWith("horizontal");
    expect(mockStrategy.isWithinBounds).toHaveBeenCalledWith({ x: 0, y: 0 }, 2, 10);
    expect(mockValidate.isValidPlacement).not.toHaveBeenCalledWith(expect.any(Array), expect.any(Array));
  });

  test("returns true if ship placement is valid", () => {
    mockStrategy.isWithinBounds.mockReturnValue(true);
    mockValidate.isValidPlacement.mockReturnValue(true);
    mockStrategy.calculatePositions.mockReturnValue([
      [0, 1],
      [0, 2],
    ]);

    const result = validatePlacement(human, mockPlacement);

    expect(result).toEqual({ success: true, positions: expect.any(Array) });
    expect(getPlacementStrategy).toHaveBeenCalledWith("horizontal");
    expect(mockStrategy.isWithinBounds).toHaveBeenCalledWith({ x: 0, y: 0 }, 2, 10);
    expect(mockValidate.isValidPlacement).not.toHaveBeenCalledWith(expect.any(Array), expect.any(Array));
  });
});
