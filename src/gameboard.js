import createShip from "./ship";

export default function createGameboard() {
  const gameboard = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));

  const missedShots = [];

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

    placeShip,
    receiveAttack,
    checkAllShipsSunk,
  };
}

function getValidPositions(startX, startY, shipLength, gameboard, direction) {
  while (startX <= gameboard.length && startY <= gameboard.length) {
    let placement = [];
    let isValid = true;
    let candidateX = 0;
    let candidateY = 0;

    for (let i = 0; i < shipLength; i++) {
      if (direction === "horizontal") {
        candidateX = startX + i;
        candidateY = startY;
      }

      if (direction === "vertical") {
        candidateX = startX;
        candidateY = startY + i;
      }

      if (candidateX > gameboard.length || candidateY > gameboard.length) {
        isValid = false;
        break;
      }

      if (gameboard[candidateX][candidateY] !== null) {
        isValid = false;
        break;
      }

      placement.push([candidateX, candidateY]);
      isValid = true;
    }

    if (isValid === true) {
      return placement;
    }

    if (direction === "horizontal") {
      return getValidPositions((startX = startX + 1), startY, shipLength, gameboard, direction);
    } else if (direction === "vertical") {
      return getValidPositions(startX, (startY = startY + 1), shipLength, gameboard, direction);
    }
  }

  return null;
}
