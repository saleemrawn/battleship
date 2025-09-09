import createGameboard from "../src/gameboard";

test("Gameboard obj has gameboard array ", () => {
  const newGameboard = createGameboard();
  expect(newGameboard.gameboard).toEqual(expect.any(Array));
});

test("Gameboard array has total length of 100 elements", () => {
  const newGameboard = createGameboard();
  expect(newGameboard.gameboard.flat()).toHaveLength(100);
});

test("placeShip method adds ship to array index 5, 5", () => {
  const newGameboard = createGameboard();
  newGameboard.placeShip(5, 5, 2);
  expect(newGameboard.gameboard[5][5]).toMatchObject({
    length: 2,
    totalHits: 0,
    hasSunk: false,
  });
});

test("receiveAttack increases totalHits to 1 for ship at co-ordinates 5, 5", () => {
  const newGameboard = createGameboard();
  newGameboard.placeShip(5, 5, 2);
  newGameboard.receiveAttack(5, 5);
  expect(newGameboard.gameboard[5][5].totalHits).toEqual(1);
});

test("receiveAttack adds co-ordinates 1, 1 to missedShots", () => {
  const newGameboard = createGameboard();
  newGameboard.receiveAttack(1, 1);
  expect(newGameboard.missedShots).toEqual(expect.arrayContaining([[1, 1]]));
});

test("checkAllShipsSunk returns true when all ships have sunk", () => {
  const newGameboard = createGameboard();

  newGameboard.placeShip(1, 1, 2);
  newGameboard.placeShip(9, 5, 2);
  newGameboard.placeShip(5, 7, 2);

  newGameboard.receiveAttack(1, 1);
  newGameboard.receiveAttack(1, 1);
  newGameboard.receiveAttack(9, 5);
  newGameboard.receiveAttack(9, 5);
  newGameboard.receiveAttack(5, 7);
  newGameboard.receiveAttack(5, 7);

  expect(newGameboard.checkAllShipsSunk()).toBeTruthy();
});

test("checkAllShipsSunk returns false when not all ships have sunk", () => {
  const newGameboard = createGameboard();

  newGameboard.placeShip(1, 1, 2);
  newGameboard.placeShip(9, 5, 2);
  newGameboard.placeShip(5, 7, 2);

  newGameboard.receiveAttack(1, 1);
  newGameboard.receiveAttack(1, 1);

  expect(newGameboard.checkAllShipsSunk()).toBeFalsy();
});
