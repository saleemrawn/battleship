import { validatePlacement } from "../domain/placement/validation";
import { generateRandomCoordinate, generateRandomOrientation, getShipsInformation } from "../helpers";

export function createGameboardGeneratorService() {
  return {
    generateRandomGameboard(player) {
      if (!player) {
        console.error(`Invalid player: ${player}`);
        return;
      }

      const board = player.gameboard.board;
      const size = board.length;
      const shipsInfo = getShipsInformation();

      for (const ship of shipsInfo) {
        let placed = false;

        while (!placed) {
          let candidatePositions = [];
          let orientation = generateRandomOrientation();
          let x = generateRandomCoordinate(size);
          let y = generateRandomCoordinate(size);

          const result = validatePlacement(player, {
            start: { x, y },
            length: ship.length,
            orientation: orientation,
          });

          if (result.success) {
            candidatePositions.push(result.positions);
            player.gameboard.placeShip(x, y, candidatePositions.flat().length, orientation);
            placed = true;
          }
        }
      }
    },
  };
}
