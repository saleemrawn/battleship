import { validatePlacement } from "../domain/placement/validation";

export function createShipPlacementService() {
  return {
    placeShip(player, placement) {
      const validation = validatePlacement(player, placement);
      const { start, length, orientation } = placement;

      if (!validation.success) {
        return validation;
      }

      player.gameboard.placeShip(start.x, start.y, length, orientation);

      return { success: true };
    },
  };
}
