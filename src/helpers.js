export function generateRandomCoordinate(boardSize) {
  return Math.floor(Math.random() * boardSize);
}

export function generateRandomOrientation() {
  return Math.round(Math.random()) === 0 ? "horizontal" : "vertical";
}
