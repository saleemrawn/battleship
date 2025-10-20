import { createShipPlacementService } from "../src/js/services/shipPlacementService";
import createPlayer from "../src/js/player";

let human;
let mockValidPlacement;
let mockInvalidPlacement;
let mockService;

beforeEach(() => {
  jest.clearAllMocks();

  human = createPlayer(1, "Player");
  human.gameboard.placeShip = jest.fn();

  mockValidPlacement = { start: { x: 0, y: 0 }, length: 2, orientation: "horizontal" };
  mockInvalidPlacement = { start: { x: 9, y: 9 }, length: 2, orientation: "horizontal" };

  mockService = createShipPlacementService();
});

describe("placeShip", () => {
  test("returns false if placement validation unsuccessful", () => {
    const result = mockService.placeShip(human, mockInvalidPlacement);

    expect(result).toEqual({ success: false, reason: "OUT_OF_BOUNDS" });
    expect(human.gameboard.placeShip).not.toHaveBeenCalled();
  });

  test("returns true if ship placement successful", () => {
    const result = mockService.placeShip(human, mockValidPlacement);

    expect(result).toEqual({ success: true });
    expect(human.gameboard.placeShip).toHaveBeenCalledWith(0, 0, 2, "horizontal");
  });
});
