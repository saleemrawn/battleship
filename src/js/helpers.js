export function generateRandomCoordinate(boardSize) {
  return Math.floor(Math.random() * boardSize);
}

export function generateRandomOrientation() {
  return Math.round(Math.random()) === 0 ? "horizontal" : "vertical";
}

export function getShipsInformation() {
  const ships = [
    { name: "Patrol Boat", length: 2 },
    { name: "Submarine", length: 3 },
    { name: "Destroyer", length: 3 },
    { name: "Battleship", length: 4 },
    { name: "Carrier", length: 5 },
  ];

  return ships;
}

export function getAlphabet() {
  const str = "abcdefjhij";
  return str.split("");
}
