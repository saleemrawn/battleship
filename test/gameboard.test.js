import createGameboard from "../src/js/gameboard";

let gameboard;

beforeEach(() => {
  gameboard = createGameboard();
});

describe("board array", () => {
  test("Gameboard obj has gameboard array ", () => {
    expect(gameboard.board).toEqual(expect.any(Array));
  });

  test("Gameboard array has total length of 100 elements", () => {
    expect(gameboard.board.flat()).toHaveLength(100);
  });
});

describe("placeShip", () => {
  test("ship added to array index [5][5] and [5][6]", () => {
    gameboard.placeShip(5, 5, 2, "horizontal");

    expect(gameboard.board[5][5]).toMatchObject({
      length: 2,
      totalHits: 0,
      hasSunk: false,
    });

    expect(gameboard.board[5][6]).toMatchObject({
      length: 2,
      totalHits: 0,
      hasSunk: false,
    });
  });
});

describe("receiveAttack", () => {
  test("totalHits increased by 1 for attack on ship", () => {
    gameboard.placeShip(5, 5, 2, "horizontal");
    gameboard.receiveAttack(5, 5);
    expect(gameboard.board[5][5].totalHits).toEqual(1);
  });

  test("co-ordinates [1,1] added to missedShots array", () => {
    gameboard.receiveAttack(1, 1);
    expect(gameboard.missedShots).toEqual(expect.arrayContaining([[1, 1]]));
  });
});

describe("checkAllShipsSunk", () => {
  test("returns true when all ships have sunk", () => {
    gameboard.placeShip(1, 1, 2, "horizontal");
    gameboard.receiveAttack(1, 1);
    gameboard.receiveAttack(1, 2);

    expect(gameboard.checkAllShipsSunk()).toBeTruthy();
  });

  test("returns false when not all ships have sunk", () => {
    gameboard.placeShip(1, 1, 2, "horizontal");
    gameboard.placeShip(9, 5, 2, "vertical");
    gameboard.placeShip(5, 7, 2, "horizontal");
    gameboard.receiveAttack(1, 1);
    gameboard.receiveAttack(1, 2);

    expect(gameboard.checkAllShipsSunk()).toBeFalsy();
  });
});
