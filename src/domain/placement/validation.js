import { getPlacementStrategy } from "./strategies";
import { isValidPlacement } from "../../helpers";

export function validatePlacement(player, placement) {
  const { start, length, orientation } = placement;
  const board = player.gameboard.gameboard;
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
