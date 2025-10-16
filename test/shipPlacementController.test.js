/**
 * @jest-environment jsdom
 */

import { createShipPlacementController } from "../src/js/controllers/shipPlacementController";
import createPlayer from "../src/js/player";

let human;
let computer;
let mockGameboardGeneratorService;
let mockShipPlacementUI;
let mockFormsUI;
let mockGameboardUI;
let mockService;
let mockShipPlacementController;
let mockButton;
let mockValidation;
let consoleWarnSpy;
let consoleErrorSpy;

beforeEach(() => {
  jest.clearAllMocks();

  mockButton = document.createElement("button");
  human = createPlayer(1, "Player");
  computer = createPlayer(2, "Computer");

  mockService = {
    placeShip: jest.fn(),
  };

  mockValidation = {
    validatePlacement: jest.fn(),
  };

  mockGameboardGeneratorService = {
    generateRandomGameboard: jest.fn(),
  };

  mockFormsUI = {
    renderShipForm: jest.fn(),
    hideShipForm: jest.fn(),
  };

  mockGameboardUI = {
    renderGameboard: jest.fn(),
    enableGameboard: jest.fn(),
    enableGameboard: jest.fn(),
    disableGameboard: jest.fn(),
    disableButton: jest.fn(),
    showHitMark: jest.fn(),
    showMissedShots: jest.fn(),
    clearGameboards: jest.fn(),
  };

  mockShipPlacementUI = {
    getShipSelection: jest.fn(),
    getOrientation: jest.fn(),
    getCoordinates: jest.fn(),
    removeShipOption: jest.fn(),
    getRemainingShips: jest.fn(),
    highlightCells: jest.fn(),
    clearHighlight: jest.fn(),
    renderGameboardShips: jest.fn(),
  };

  mockShipPlacementController = createShipPlacementController({
    service: mockService,
    generator: mockGameboardGeneratorService,
    shipPlacementUI: mockShipPlacementUI,
    formsUI: mockFormsUI,
    gameboardUI: mockGameboardUI,
  });

  consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
});

afterEach(() => {
  consoleWarnSpy.mockRestore();
  consoleErrorSpy.mockRestore();
});

describe("handleAddShip", () => {
  test("should hide form and set up computer gameboard when all ships are placed", () => {
    mockShipPlacementUI.getOrientation.mockReturnValue("horizontal");
    mockShipPlacementUI.getCoordinates.mockReturnValue({ x: 0, y: 0 });
    mockShipPlacementUI.getShipSelection.mockReturnValue({
      element: `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`,
      length: 2,
    });
    mockService.placeShip.mockReturnValue({ success: true });
    mockShipPlacementUI.getRemainingShips.mockReturnValue(0);

    mockShipPlacementController.handleAddShip(mockButton, human, computer);

    expect(mockService.placeShip).toHaveBeenCalledWith(human, {
      start: { x: 0, y: 0 },
      length: 2,
      orientation: "horizontal",
    });
    expect(mockShipPlacementUI.renderGameboardShips).toHaveBeenCalledWith(human);
    expect(mockShipPlacementUI.removeShipOption).toHaveBeenCalledWith(
      `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`
    );
    expect(mockFormsUI.hideShipForm).toHaveBeenCalled();
    expect(mockGameboardUI.disableGameboard).toHaveBeenCalledWith(human);
    expect(mockGameboardUI.renderGameboard).toHaveBeenCalledWith(computer);
    expect(mockGameboardGeneratorService.generateRandomGameboard).toHaveBeenCalledWith(computer);
    expect(mockShipPlacementUI.renderGameboardShips).toHaveBeenCalledWith(computer);
  });

  test("should not call removeShipOption, hide ship form, set up computer gameboard when placeShip is unsuccessful", () => {
    mockShipPlacementUI.getOrientation.mockReturnValue("horizontal");
    mockShipPlacementUI.getCoordinates.mockReturnValue({ x: 9, y: 9 });
    mockShipPlacementUI.getShipSelection.mockReturnValue({
      element: `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`,
      length: 2,
    });
    mockService.placeShip.mockReturnValue({ success: false });

    mockShipPlacementController.handleAddShip(mockButton, human, computer);

    expect(mockService.placeShip).toHaveBeenCalledWith(human, {
      start: { x: 9, y: 9 },
      length: 2,
      orientation: "horizontal",
    });
    expect(mockShipPlacementUI.renderGameboardShips).not.toHaveBeenCalled();
    expect(mockShipPlacementUI.removeShipOption).not.toHaveBeenCalled();
    expect(mockFormsUI.hideShipForm).not.toHaveBeenCalled();
    expect(mockGameboardUI.disableGameboard).not.toHaveBeenCalledWith(human);
    expect(mockGameboardUI.renderGameboard).not.toHaveBeenCalledWith(computer);
    expect(mockGameboardGeneratorService.generateRandomGameboard).not.toHaveBeenCalledWith(computer);
    expect(mockShipPlacementUI.renderGameboardShips).not.toHaveBeenCalledWith(computer);
  });

  test("should not hide form, set up computer gameboard if all ships not placed", () => {
    mockShipPlacementUI.getOrientation.mockReturnValue("horizontal");
    mockShipPlacementUI.getCoordinates.mockReturnValue({ x: 0, y: 0 });
    mockShipPlacementUI.getShipSelection.mockReturnValue({
      element: `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`,
      length: 2,
    });
    mockService.placeShip.mockReturnValue({ success: true });
    mockShipPlacementUI.getRemainingShips.mockReturnValue(5);

    mockShipPlacementController.handleAddShip(mockButton, human, computer);

    expect(mockService.placeShip).toHaveBeenCalledWith(human, {
      start: { x: 0, y: 0 },
      length: 2,
      orientation: "horizontal",
    });
    expect(mockShipPlacementUI.renderGameboardShips).toHaveBeenCalledWith(human);
    expect(mockShipPlacementUI.removeShipOption).toHaveBeenCalledWith(
      `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`
    );
    expect(mockFormsUI.hideShipForm).not.toHaveBeenCalled();
    expect(mockGameboardUI.disableGameboard).not.toHaveBeenCalledWith(human);
    expect(mockGameboardUI.renderGameboard).not.toHaveBeenCalledWith(computer);
    expect(mockGameboardGeneratorService.generateRandomGameboard).not.toHaveBeenCalledWith(computer);
    expect(mockShipPlacementUI.renderGameboardShips).not.toHaveBeenCalledWith(computer);
  });

  test("early return if ship is invalid", () => {
    mockShipPlacementUI.getOrientation.mockReturnValue("horizontal");
    mockShipPlacementUI.getCoordinates.mockReturnValue({ x: 0, y: 0 });
    mockShipPlacementUI.getShipSelection.mockReturnValue(null);

    mockShipPlacementController.handleAddShip(mockButton, human, computer);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid input for ship placement");
    expect(mockShipPlacementUI.renderGameboardShips).not.toHaveBeenCalledWith(human);
    expect(mockShipPlacementUI.removeShipOption).not.toHaveBeenCalled();
    expect(mockFormsUI.hideShipForm).not.toHaveBeenCalled();
    expect(mockGameboardUI.disableGameboard).not.toHaveBeenCalledWith(human);
    expect(mockGameboardUI.renderGameboard).not.toHaveBeenCalledWith(computer);
    expect(mockGameboardGeneratorService.generateRandomGameboard).not.toHaveBeenCalledWith(computer);
    expect(mockShipPlacementUI.renderGameboardShips).not.toHaveBeenCalledWith(computer);
  });

  test("early return error if orientation is invalid", () => {
    mockShipPlacementUI.getOrientation.mockReturnValue(null);
    mockShipPlacementUI.getCoordinates.mockReturnValue({ x: 0, y: 0 });
    mockShipPlacementUI.getShipSelection.mockReturnValue({
      element: `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`,
      length: 2,
    });

    mockShipPlacementController.handleAddShip(mockButton, human, computer);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid input for ship placement");
    expect(mockShipPlacementUI.renderGameboardShips).not.toHaveBeenCalledWith(human);
    expect(mockShipPlacementUI.removeShipOption).not.toHaveBeenCalled();
    expect(mockFormsUI.hideShipForm).not.toHaveBeenCalled();
    expect(mockGameboardUI.disableGameboard).not.toHaveBeenCalledWith(human);
    expect(mockGameboardUI.renderGameboard).not.toHaveBeenCalledWith(computer);
    expect(mockGameboardGeneratorService.generateRandomGameboard).not.toHaveBeenCalledWith(computer);
    expect(mockShipPlacementUI.renderGameboardShips).not.toHaveBeenCalledWith(computer);
  });

  test("early return if coordinates is invalid", () => {
    mockShipPlacementUI.getOrientation.mockReturnValue("horizontal");
    mockShipPlacementUI.getCoordinates.mockReturnValue(null);
    mockShipPlacementUI.getShipSelection.mockReturnValue({
      element: `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`,
      length: 2,
    });

    mockShipPlacementController.handleAddShip(mockButton, human, computer);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid input for ship placement");
    expect(mockShipPlacementUI.renderGameboardShips).not.toHaveBeenCalledWith(human);
    expect(mockShipPlacementUI.removeShipOption).not.toHaveBeenCalled();
    expect(mockFormsUI.hideShipForm).not.toHaveBeenCalled();
    expect(mockGameboardUI.disableGameboard).not.toHaveBeenCalledWith(human);
    expect(mockGameboardUI.renderGameboard).not.toHaveBeenCalledWith(computer);
    expect(mockGameboardGeneratorService.generateRandomGameboard).not.toHaveBeenCalledWith(computer);
    expect(mockShipPlacementUI.renderGameboardShips).not.toHaveBeenCalledWith(computer);
  });
});

describe("handleHoverPreview", () => {
  test("hover validation successful", () => {
    mockShipPlacementUI.getCoordinates.mockReturnValue({ x: 0, y: 0 });
    mockShipPlacementUI.getOrientation.mockReturnValue("horizontal");
    mockShipPlacementUI.getShipSelection.mockReturnValue({
      element: `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`,
      length: 2,
    });

    mockValidation.validatePlacement.mockReturnValue({ success: true });
    mockShipPlacementController.handleHoverPreview(mockButton, human);

    expect(mockShipPlacementUI.highlightCells).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ length: 2, orientation: "horizontal", start: expect.objectContaining({ x: 0, y: 0 }) })
    );
  });

  test("hover validation unsuccessful", () => {
    mockShipPlacementUI.getCoordinates.mockReturnValue({ x: 9, y: 9 });
    mockShipPlacementUI.getOrientation.mockReturnValue("horizontal");
    mockShipPlacementUI.getShipSelection.mockReturnValue({
      element: `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`,
      length: 2,
    });

    mockValidation.validatePlacement.mockReturnValue({ success: false, reason: "OUT_OF_BOUNDS" });
    mockShipPlacementController.handleHoverPreview(mockButton, human);

    expect(consoleWarnSpy).toHaveBeenCalledWith("Placement failed: OUT_OF_BOUNDS");
    expect(mockShipPlacementUI.highlightCells).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ length: 2, orientation: "horizontal", start: expect.objectContaining({ x: 9, y: 9 }) })
    );
  });

  test("early return if ship invalid input", () => {
    mockShipPlacementUI.getCoordinates.mockReturnValue({ x: 0, y: 0 });
    mockShipPlacementUI.getOrientation.mockReturnValue("horizontal");
    mockShipPlacementUI.getShipSelection.mockReturnValue(null);

    mockShipPlacementController.handleHoverPreview(mockButton, human);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid input for ship placement");
    expect(mockValidation.validatePlacement).not.toHaveBeenCalled();
    expect(mockShipPlacementUI.highlightCells).not.toHaveBeenCalled();
  });

  test("early return if orientation invalid input", () => {
    mockShipPlacementUI.getCoordinates.mockReturnValue({ x: 0, y: 0 });
    mockShipPlacementUI.getOrientation.mockReturnValue(null);
    mockShipPlacementUI.getShipSelection.mockReturnValue({
      element: `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`,
      length: 2,
    });

    mockShipPlacementController.handleHoverPreview(mockButton, human);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid input for ship placement");
    expect(mockValidation.validatePlacement).not.toHaveBeenCalled();
    expect(mockShipPlacementUI.highlightCells).not.toHaveBeenCalled();
  });

  test("early return if coordinates invalid input", () => {
    mockShipPlacementUI.getCoordinates.mockReturnValue(null);
    mockShipPlacementUI.getOrientation.mockReturnValue("horizontal");
    mockShipPlacementUI.getShipSelection.mockReturnValue({
      element: `<option value="2" data-ship-name="Patrol Boat">Patrol Boat (2)</option>`,
      length: 2,
    });

    mockShipPlacementController.handleHoverPreview(mockButton, human);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid input for ship placement");
    expect(mockValidation.validatePlacement).not.toHaveBeenCalled();
    expect(mockShipPlacementUI.highlightCells).not.toHaveBeenCalled();
  });
});

describe("handleMouseOutPreview", () => {
  test("call clearHighlight", () => {
    mockShipPlacementController.handleMouseOutPreview();
    expect(mockShipPlacementUI.clearHighlight).toHaveBeenCalled();
  });
});
