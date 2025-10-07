import createPlayer from "../src/player";
import { createGameboardGeneratorService } from "../src/services/gameboardGeneratorService";

let gameboardGenerator;
let player;
let mockInvalidPlayer;
let consoleErrorSpy;

beforeEach(() => {
  jest.clearAllMocks();
  gameboardGenerator = createGameboardGeneratorService();
  player = createPlayer(1, "Player");
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
});

describe("generateRandomGameboard", () => {
  test("returns early if player is invalid", () => {
    gameboardGenerator.generateRandomGameboard(mockInvalidPlayer);
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Invalid player: ${mockInvalidPlayer}`);
  });

  test("player gameboard returns array with 17 ships", () => {
    gameboardGenerator.generateRandomGameboard(player);
    const ships = player.gameboard.gameboard.flat().filter((pos) => pos !== null);
    expect(ships.length).toEqual(17);
  });
});
