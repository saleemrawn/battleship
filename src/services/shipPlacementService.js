import { getPlacementStrategy } from "../domain/placement/strategies";

export function createShipPlacementService(validator) {
  return {
    placeShip(player, placement) {
      const validation = this.validatePlacement(player, placement);
      const { start, length, orientation } = placement;

      if (!validation.success) {
        return validation;
      }

      player.gameboard.placeShip(start.x, start.y, length, orientation);

      return { success: true };
    },

    validatePlacement(player, placement) {
      const { start, length, orientation } = placement;
      const board = player.gameboard.gameboard;
      const boardSize = board.length;

      const strategy = getPlacementStrategy(orientation);
      const positions = strategy.calculatePositions(start, length);

      if (!strategy.isWithinBounds(start, length, boardSize)) {
        return { success: false, reason: "OUT_OF_BOUNDS" };
      }

      if (!validator.isValidPlacement(board, positions)) {
        return { success: false, reason: "INVALID_POSITION" };
      }

      return { success: true };
    },
  };
}
