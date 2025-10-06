/**
 * @jest-environment jsdom
 */

import { createShipPlacementController } from "../src/controllers/shipPlacementController";

let mockUi;
let mockService;
let mockGameStateManager;
let mockController;
let mockButton;
let mockPlayer;
let consoleWarnSpy;
let consoleErrorSpy;

beforeEach(() => {
  jest.clearAllMocks();

  mockButton = document.createElement("button");
  mockPlayer = { id: 1, name: "Player", gameboard: { gameboard: new Array(10) } };

  mockService = {
    placeShip: jest.fn(),
    validatePlacement: jest.fn(),
  };

  mockUi = {
    getShipSelection: jest.fn(),
    getOrientation: jest.fn(),
    getCoordinates: jest.fn(),
    removeShipOption: jest.fn(),
    getRemainingShips: jest.fn(),
    highlightCells: jest.fn(),
    clearHighlight: jest.fn(),
    renderGameboardShips: jest.fn(),
  };

  mockGameStateManager = {
    onAllShipsPlaced: jest.fn(),
  };

  mockController = createShipPlacementController({
    service: mockService,
    ui: mockUi,
    gameStateManager: mockGameStateManager,
  });

  consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
});

afterEach(() => {
  consoleWarnSpy.mockRestore();
  consoleErrorSpy.mockRestore();
});

describe("handleAddShip", () => {
  test("should call onAllShipsPlaced when all ships are placed", () => {
    mockUi.getOrientation.mockReturnValue("horizontal");
    mockUi.getCoordinates.mockReturnValue({ x: 0, y: 0 });
    mockUi.getShipSelection.mockReturnValue({
      element: `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`,
      length: 2,
    });

    mockService.placeShip.mockReturnValue({ success: true });
    mockUi.getRemainingShips.mockReturnValue(0);
    mockController.handleAddShip(mockButton, mockPlayer);

    expect(mockService.placeShip).toHaveBeenCalledWith(mockPlayer, {
      start: { x: 0, y: 0 },
      length: 2,
      orientation: "horizontal",
    });
    expect(mockUi.renderGameboardShips).toHaveBeenCalledWith(expect.any(Array), 1);
    expect(mockUi.removeShipOption).toHaveBeenCalledWith(
      `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`
    );
    expect(mockGameStateManager.onAllShipsPlaced).toHaveBeenCalledWith(mockPlayer);
  });

  test("should not call removeShipOption, onAllShipsPlaced when all placeShip is unsuccessful", () => {
    mockUi.getOrientation.mockReturnValue("horizontal");
    mockUi.getCoordinates.mockReturnValue({ x: 0, y: 0 });
    mockUi.getShipSelection.mockReturnValue({
      element: `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`,
      length: 2,
    });

    mockService.placeShip.mockReturnValue({ success: false });
    mockUi.getRemainingShips.mockReturnValue(0);
    mockController.handleAddShip(mockButton, mockPlayer);

    expect(mockService.placeShip).toHaveBeenCalledWith(mockPlayer, {
      start: { x: 0, y: 0 },
      length: 2,
      orientation: "horizontal",
    });
    expect(mockUi.renderGameboardShips).not.toHaveBeenCalled();
    expect(mockUi.removeShipOption).not.toHaveBeenCalled();
    expect(mockGameStateManager.onAllShipsPlaced).not.toHaveBeenCalled();
  });

  test("onAllShipsPlaced not called if all ships not placed", () => {
    mockUi.getOrientation.mockReturnValue("horizontal");
    mockUi.getCoordinates.mockReturnValue({ x: 0, y: 0 });
    mockUi.getShipSelection.mockReturnValue({
      element: `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`,
      length: 2,
    });

    mockService.placeShip.mockReturnValue({ success: true });
    mockUi.getRemainingShips.mockReturnValue(3);
    mockController.handleAddShip(mockButton, mockPlayer);

    expect(mockService.placeShip).toHaveBeenCalledWith(mockPlayer, {
      start: { x: 0, y: 0 },
      length: 2,
      orientation: "horizontal",
    });
    expect(mockUi.renderGameboardShips).toHaveBeenCalledWith(expect.any(Array), 1);
    expect(mockUi.removeShipOption).toHaveBeenCalledWith(
      `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`
    );
    expect(mockGameStateManager.onAllShipsPlaced).not.toHaveBeenCalled();
  });

  test("early return if ship is invalid", () => {
    mockUi.getOrientation.mockReturnValue("horizontal");
    mockUi.getCoordinates.mockReturnValue({ x: 0, y: 0 });
    mockUi.getShipSelection.mockReturnValue(null);

    mockController.handleAddShip(mockButton, mockPlayer);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid input for ship placement");
    expect(mockService.placeShip).not.toHaveBeenCalled();
    expect(mockUi.renderGameboardShips).not.toHaveBeenCalled();
    expect(mockUi.removeShipOption).not.toHaveBeenCalled();
  });

  test("early return error if orientation is invalid", () => {
    mockUi.getOrientation.mockReturnValue(null);
    mockUi.getCoordinates.mockReturnValue({ x: 0, y: 0 });
    mockUi.getShipSelection.mockReturnValue({
      element: `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`,
      length: 2,
    });

    mockController.handleAddShip(mockButton, mockPlayer);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid input for ship placement");
    expect(mockService.placeShip).not.toHaveBeenCalled();
    expect(mockUi.renderGameboardShips).not.toHaveBeenCalled();
    expect(mockUi.removeShipOption).not.toHaveBeenCalled();
  });

  test("early return if coordinates is invalid", () => {
    mockUi.getOrientation.mockReturnValue("horizontal");
    mockUi.getCoordinates.mockReturnValue(null);
    mockUi.getShipSelection.mockReturnValue({
      element: `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`,
      length: 2,
    });

    mockController.handleAddShip(mockButton, mockPlayer);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid input for ship placement");
    expect(mockService.placeShip).not.toHaveBeenCalled();
    expect(mockUi.renderGameboardShips).not.toHaveBeenCalled();
    expect(mockUi.removeShipOption).not.toHaveBeenCalled();
  });
});

describe("handleHoverPreview", () => {
  test("hover validation successful", () => {
    mockUi.getCoordinates.mockReturnValue({ x: 0, y: 0 });
    mockUi.getOrientation.mockReturnValue("horizontal");
    mockUi.getShipSelection.mockReturnValue({
      element: `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`,
      length: 2,
    });

    mockService.validatePlacement.mockReturnValue({ success: true });
    mockController.handleHoverPreview();

    expect(mockService.validatePlacement).toHaveBeenCalled();
    expect(mockUi.highlightCells).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ length: 2, orientation: "horizontal", start: expect.objectContaining({ x: 0, y: 0 }) })
    );
  });

  test("hover validation unsuccessful", () => {
    mockUi.getCoordinates.mockReturnValue({ x: 0, y: 0 });
    mockUi.getOrientation.mockReturnValue("horizontal");
    mockUi.getShipSelection.mockReturnValue({
      element: `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`,
      length: 2,
    });

    mockService.validatePlacement.mockReturnValue({ success: false, reason: "INVALID_POSITION" });
    mockController.handleHoverPreview();

    expect(mockService.validatePlacement).toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith("Placement failed: INVALID_POSITION");
    expect(mockUi.highlightCells).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ length: 2, orientation: "horizontal", start: expect.objectContaining({ x: 0, y: 0 }) })
    );
  });

  test("early return if ship invalid input", () => {
    mockUi.getCoordinates.mockReturnValue({ x: 0, y: 0 });
    mockUi.getOrientation.mockReturnValue("horizontal");
    mockUi.getShipSelection.mockReturnValue(null);

    mockController.handleHoverPreview();

    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid input for ship placement");
    expect(mockService.validatePlacement).not.toHaveBeenCalled();
    expect(mockUi.highlightCells).not.toHaveBeenCalled();
  });

  test("early return if orientation invalid input", () => {
    mockUi.getCoordinates.mockReturnValue({ x: 0, y: 0 });
    mockUi.getOrientation.mockReturnValue(null);
    mockUi.getShipSelection.mockReturnValue({
      element: `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`,
      length: 2,
    });

    mockController.handleHoverPreview();

    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid input for ship placement");
    expect(mockService.validatePlacement).not.toHaveBeenCalled();
    expect(mockUi.highlightCells).not.toHaveBeenCalled();
  });

  test("early return if coordinates invalid input", () => {
    mockUi.getCoordinates.mockReturnValue(null);
    mockUi.getOrientation.mockReturnValue("horizontal");
    mockUi.getShipSelection.mockReturnValue({
      element: `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`,
      length: 2,
    });

    mockController.handleHoverPreview();

    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid input for ship placement");
    expect(mockService.validatePlacement).not.toHaveBeenCalled();
    expect(mockUi.highlightCells).not.toHaveBeenCalled();
  });
});

describe("handleMouseOutPreview", () => {
  test("call clearHighlight", () => {
    mockController.handleMouseOutPreview();
    expect(mockUi.clearHighlight).toHaveBeenCalled();
  });
});
