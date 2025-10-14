import createShip from "./ship";

export default function createGameboard() {
  let board = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));

  let missedShots = [];

  const placeShip = (x, y, shipLength, direction) => {
    const ship = createShip(shipLength);

    for (let i = 0; i < shipLength; i++) {
      if (direction === "horizontal") {
        board[y][x + i] = ship;
      }

      if (direction === "vertical") {
        board[y + i][x] = ship;
      }
    }
  };

  const receiveAttack = (y, x) => {
    if (board[y][x] !== null) {
      board[y][x].hit();
    } else {
      missedShots.push([y, x]);
    }
  };

  const checkAllShipsSunk = () => {
    const result = board
      .flat()
      .filter((item) => item !== null)
      .every((item) => item.isSunk() === true);

    return result;
  };

  return {
    get board() {
      return board;
    },

    get missedShots() {
      return missedShots;
    },

    set board(arr) {
      board = arr;
    },

    set missedShots(arr) {
      missedShots = arr;
    },

    placeShip,
    receiveAttack,
    checkAllShipsSunk,
  };
}
