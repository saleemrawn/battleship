jest.mock("../src/domain/placement/strategies");
import { getPlacementStrategy } from "../src/domain/placement/strategies";
import { createShipPlacementService } from "../src/services/shipPlacementService";

let mockPlayer;
let mockPlacement;
let mockService;
let mockValidator;
//let mockRenderer;
let mockStrategy;

beforeEach(() => {
  jest.clearAllMocks();
  mockPlayer = { id: 1, name: "Player", gameboard: { gameboard: new Array(10), placeShip: jest.fn() } };
  mockPlacement = { start: { x: 0, y: 0 }, length: 2, orientation: "horizontal" };
  mockValidator = { isValidPlacement: jest.fn() };
  /* mockRenderer = {
    renderGameboardShips: jest.fn(),
  }; */

  mockService = createShipPlacementService(mockValidator);

  mockStrategy = {
    calculatePositions: jest.fn(),
    isWithinBounds: jest.fn(),
  };

  getPlacementStrategy.mockReturnValue(mockStrategy);
});

describe("placeShip", () => {
  test("returns false if placement validation unsuccessful", () => {
    mockStrategy.isWithinBounds.mockReturnValue(false);
    mockStrategy.calculatePositions.mockReturnValue({ x: 9, y: 9 });

    const result = mockService.placeShip(mockPlayer, mockPlacement);

    expect(result).toEqual({ success: false, reason: expect.any(String) });
    expect(mockPlayer.gameboard.placeShip).not.toHaveBeenCalled();
    //expect(mockRenderer.renderGameboardShips).not.toHaveBeenCalled();
  });

  test("returns true if ship placement successful", () => {
    mockStrategy.isWithinBounds.mockReturnValue(true);
    mockValidator.isValidPlacement.mockReturnValue(true);
    mockStrategy.calculatePositions.mockReturnValue([{ x: 0, y: 0 }]);

    const result = mockService.placeShip(mockPlayer, mockPlacement);

    expect(result).toEqual({ success: true });
    expect(mockPlayer.gameboard.placeShip).toHaveBeenCalledWith(0, 0, 2, "horizontal");
    //expect(mockRenderer.renderGameboardShips).toHaveBeenCalledWith(expect.any(Array), 1);
  });
});
