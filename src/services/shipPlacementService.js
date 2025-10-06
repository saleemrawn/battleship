import { getPlacementStrategy } from "../domain/placement/strategies";

export function createShipPlacementService(validator, renderer) {
  return {
    placeShip(player, placement) {
      const validation = this.validatePlacement(player, placement);
      if (!validation.success) {
        return validation;
      }

      const { start, length, orientation } = placement;
      const board = player.gameboard.gameboard;

      player.gameboard.placeShip(start.x, start.y, length, orientation);
      renderer.renderGameboardShips(board, player.id);

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
