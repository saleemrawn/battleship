import createShip from "./ship";

export default function createGameboard() {
  let gameboard = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));

  let missedShots = [];

  const placeShip = (x, y, shipLength, direction) => {
    const ship = createShip(shipLength);

    for (let i = 0; i < shipLength; i++) {
      if (direction === "horizontal") {
        gameboard[y][x + i] = ship;
      }

      if (direction === "vertical") {
        gameboard[y + i][x] = ship;
      }
    }
  };

  const receiveAttack = (x, y) => {
    if (gameboard[x][y] !== null) {
      gameboard[x][y].hit();
    } else {
      missedShots.push([x, y]);
    }
  };

  const checkAllShipsSunk = () => {
    const result = gameboard
      .flat()
      .filter((item) => item !== null)
      .every((item) => item.isSunk() === true);

    return result;
  };

  return {
    get gameboard() {
      return gameboard;
    },

    get missedShots() {
      return missedShots;
    },

    set gameboard(arr) {
      gameboard = arr;
    },

    set missedShots(arr) {
      missedShots = arr;
    },

    placeShip,
    receiveAttack,
    checkAllShipsSunk,
  };
}
