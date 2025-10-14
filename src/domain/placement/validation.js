import { getPlacementStrategy } from "./strategies";

export function validatePlacement(player, placement) {
  const { start, length, orientation } = placement;
  const board = player.gameboard.board;
  const boardSize = board.length;

  const strategy = getPlacementStrategy(orientation);
  const positions = strategy.calculatePositions(start, length);

  if (!strategy.isWithinBounds(start, length, boardSize)) {
    return { success: false, reason: "OUT_OF_BOUNDS" };
  }

  if (!isValidPlacement(board, positions)) {
    return { success: false, reason: "INVALID_POSITION" };
  }

  return { success: true, positions };
}

function isValidPlacement(board, candidatePositions) {
  const size = board.length;

  for (const [x, y] of candidatePositions) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
        if (board[ny][nx] !== null) return false;
      }
    }
  }

  return true;
}
