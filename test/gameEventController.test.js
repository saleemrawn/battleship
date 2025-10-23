/**
 * @jest-environment jsdom
 */

jest.mock("../src/js/helpers");
import { createGameEventController } from "../src/js/controllers/gameEventController";
import * as helper from "../src/js/helpers";
import createPlayer from "../src/js/player";

let human;
let computer;
let mockButton;
let mockShipPlacementUI;
let mockFormsUI;
let mockGameboardUI;
let mockModalUI;
let mockGameEventController;

beforeEach(() => {
  jest.clearAllMocks();
  human = createPlayer(1, "Player");
  computer = createPlayer(2, "Computer");

  mockButton = {
    target: {
      getAttribute: jest.fn((attr) => {
        const attributes = {
          "data-x": "0",
          "data-y": "0",
          "data-player-id": "1",
        };
        return attributes[attr] || null;
      }),
    },
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
    toggleTurnIndicator: jest.fn(),
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

  mockModalUI = { addGameOverModal: jest.fn(), showModal: jest.fn(), closeModal: jest.fn() };

  mockGameEventController = createGameEventController({
    shipPlacementUI: mockShipPlacementUI,
    gameboardUI: mockGameboardUI,
    formsUI: mockFormsUI,
    modalUI: mockModalUI,
  });
});

describe("handleGameSetup", () => {
  test("calls renderGameboard, renderShipForm, renderGameboardShips, toggleTurnIndicator", () => {
    mockGameEventController.handleGameSetup(human, computer);

    expect(mockGameboardUI.renderGameboard).toHaveBeenCalledWith(human);
    expect(mockFormsUI.renderShipForm).toHaveBeenCalled();
    expect(mockGameboardUI.toggleTurnIndicator).toHaveBeenCalledWith(computer);
    expect(mockShipPlacementUI.renderGameboardShips).toHaveBeenCalledWith(human);
  });
});

describe("handlePlayerEvent", () => {
  test("calls shotHitMark when board index is not null", () => {
    const spyCheckGameWinner = jest.spyOn(mockGameEventController, "checkGameWinner");
    computer.gameboard.placeShip(0, 0, 2, "horizontal");

    mockGameEventController.handlePlayerEvent(human, computer, mockButton);

    expect(mockGameboardUI.showHitMark).toHaveBeenCalledWith(mockButton);
    expect(mockGameboardUI.showMissedShots).toHaveBeenCalledWith(computer);
    expect(mockGameboardUI.disableGameboard).toHaveBeenCalledWith(computer);
    expect(spyCheckGameWinner).toHaveBeenCalledWith(human, computer);
  });
});

describe("handleComputerEvent", () => {
  test("calls itself if co-ordinates exist in visited array", () => {
    const spyHandleComputerEvent = jest.spyOn(mockGameEventController, "handleComputerEvent");

    helper.generateRandomCoordinate
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(5);

    mockGameEventController.visited.push([0, 0]);
    mockGameEventController.handleComputerEvent(human, computer);

    const visited = mockGameEventController.visited;

    expect(spyHandleComputerEvent).toHaveBeenCalledTimes(2);
    expect(visited.length).toBe(2);
    expect(visited).toContainEqual([0, 0]);
    expect(visited).toContainEqual([5, 5]);
    expect(helper.generateRandomCoordinate).toHaveBeenCalledTimes(4);
  });

  test("calls receiveAttack after 2500ms", () => {
    jest.useFakeTimers();

    const spyReceiveAttack = jest.spyOn(human.gameboard, "receiveAttack");

    helper.generateRandomCoordinate.mockReturnValueOnce(0).mockReturnValueOnce(0);

    expect(spyReceiveAttack).not.toHaveBeenCalledWith(0, 0);

    mockGameEventController.handleComputerEvent(human, computer);

    jest.advanceTimersByTime(2500);

    expect(spyReceiveAttack).toHaveBeenCalledTimes(1);
    expect(spyReceiveAttack).toHaveBeenCalledWith(0, 0);

    jest.useRealTimers();
  });

  test("calls checkGameWinner after 2500ms", () => {
    jest.useFakeTimers();

    helper.generateRandomCoordinate.mockReturnValueOnce(5).mockReturnValueOnce(5);
    spyCheckGameWinner = jest.spyOn(mockGameEventController, "checkGameWinner");

    expect(spyCheckGameWinner).not.toHaveBeenCalled();

    mockGameEventController.handleComputerEvent(human, computer);

    jest.advanceTimersByTime(2500);

    expect(spyCheckGameWinner).toHaveBeenCalledTimes(1);
    expect(spyCheckGameWinner).toHaveBeenCalledWith(computer, human);

    jest.useRealTimers();
  });

  test("calls showHitMark if hit is successful after 2500ms", () => {
    jest.useFakeTimers();

    document.querySelector = jest.fn().mockReturnValue(mockButton);

    human.gameboard.placeShip(5, 5, 2, "horizontal");
    helper.generateRandomCoordinate.mockReturnValueOnce(5).mockReturnValueOnce(5);

    expect(mockGameboardUI.showHitMark).not.toHaveBeenCalled();

    mockGameEventController.handleComputerEvent(human, computer);

    jest.advanceTimersByTime(2500);

    expect(mockGameboardUI.showHitMark).toHaveBeenCalledTimes(1);
    expect(document.querySelector).toHaveBeenCalledWith(
      `.board-button[data-player-id="${human.id}"][data-x="5"][data-y="5"]`
    );

    jest.useRealTimers();
  });

  test("calls showMissedShots after 2500ms", () => {
    jest.useFakeTimers();

    computer.gameboard.placeShip(0, 0, 2, "horizontal");
    helper.generateRandomCoordinate.mockReturnValueOnce(5).mockReturnValueOnce(5);

    expect(mockGameboardUI.showMissedShots).not.toHaveBeenCalled();

    mockGameEventController.handleComputerEvent(human, computer);

    jest.advanceTimersByTime(2500);

    expect(mockGameboardUI.showMissedShots).toHaveBeenCalledTimes(1);
    expect(mockGameboardUI.showMissedShots).toHaveBeenCalledWith(human);

    jest.useRealTimers();
  });

  test("calls enableGameboard after 2500ms", () => {
    jest.useFakeTimers();

    computer.gameboard.placeShip(0, 0, 2, "horizontal");
    helper.generateRandomCoordinate.mockReturnValueOnce(5).mockReturnValueOnce(5);

    expect(mockGameboardUI.enableGameboard).not.toHaveBeenCalled();

    mockGameEventController.handleComputerEvent(human, computer);

    jest.advanceTimersByTime(2500);

    expect(mockGameboardUI.enableGameboard).toHaveBeenCalledTimes(1);
    expect(mockGameboardUI.enableGameboard).toHaveBeenCalledWith(computer);

    jest.useRealTimers();
  });

  test("setTimeout id pushed to activeTimeouts", () => {
    jest.useFakeTimers();
    const activeTimeouts = mockGameEventController.activeTimeouts;
    computer.gameboard.placeShip(0, 0, 2, "horizontal");
    helper.generateRandomCoordinate.mockReturnValueOnce(5).mockReturnValueOnce(5);

    expect(activeTimeouts).toHaveLength(0);

    mockGameEventController.handleComputerEvent(human, computer);

    jest.advanceTimersByTime(2500);

    expect(activeTimeouts).toHaveLength(1);

    jest.useRealTimers();
  });
});

describe("handlePlayAgainEvent", () => {
  test("call resetPlayer, resetVisited, clearTimeouts, clearGameboards, handleGameSetup, closeModal", () => {
    const spyResetPlayer = jest.spyOn(mockGameEventController, "resetPlayer");
    const spyResetVisited = jest.spyOn(mockGameEventController, "resetVisited");
    const spyClearTimeouts = jest.spyOn(mockGameEventController, "clearTimeouts");
    const spyHandleGameSetup = jest.spyOn(mockGameEventController, "handleGameSetup");

    mockGameEventController.handlePlayAgainEvent(human, computer);

    expect(spyResetPlayer).toHaveBeenCalledWith(human);
    expect(spyResetPlayer).toHaveBeenCalledWith(computer);
    expect(spyResetVisited).toHaveBeenCalled();
    expect(spyClearTimeouts).toHaveBeenCalled();
    expect(spyHandleGameSetup).toHaveBeenCalledWith(human, computer);
    expect(mockGameboardUI.clearGameboards).toHaveBeenCalled();
    expect(mockModalUI.closeModal).toHaveBeenCalled();
  });
});
