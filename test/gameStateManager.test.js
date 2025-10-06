import { createGameStateManager } from "../src/state/gameStateManager";

let mockPlayer;
let mockHideForm;
let mockAddComputer;
let mockDisableGameboard;
let mockGameStateManager;
let consoleErrorSpy;

beforeEach(() => {
  jest.clearAllMocks();
  mockPlayer = { id: 1, name: "Player", gameboard: {} };
  mockHideForm = jest.fn();
  mockAddComputer = jest.fn();
  mockDisableGameboard = jest.fn();

  mockGameStateManager = createGameStateManager({
    hideForm: mockHideForm,
    disableGameboard: mockDisableGameboard,
    addComputer: mockAddComputer,
  });

  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
});

describe("onAllShipsPlaced", () => {
  test("calls onAllShipsPlaced", () => {
    mockGameStateManager.onAllShipsPlaced(mockPlayer);

    expect(mockHideForm).toHaveBeenCalled();
    expect(mockDisableGameboard).toHaveBeenCalledWith(1);
    expect(mockAddComputer).toHaveBeenCalled();
  });

  test("return early if invalid player", () => {
    mockGameStateManager.onAllShipsPlaced(null);

    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid player");
    expect(mockHideForm).not.toHaveBeenCalled();
    expect(mockDisableGameboard).not.toHaveBeenCalled();
    expect(mockAddComputer).not.toHaveBeenCalled();
  });
});
