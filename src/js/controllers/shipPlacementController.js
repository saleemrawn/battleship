import { validatePlacement } from "../domain/placement/validation";

export function createShipPlacementController(dependencies) {
  const { service, generator, shipPlacementUI, formsUI, gameboardUI } = dependencies;

  const handlePlacementError = (reason) => {
    console.warn(`Placement failed: ${reason}`);
  };

  return {
    handleAddShip(button, human, computer) {
      const ship = shipPlacementUI.getShipSelection();
      const orientation = shipPlacementUI.getOrientation();
      const coordinates = shipPlacementUI.getCoordinates(button);

      if (!ship || !orientation || !coordinates) {
        console.error("Invalid input for ship placement");
        return;
      }

      const result = service.placeShip(human, { start: coordinates, length: ship.length, orientation });

      if (!result.success) {
        handlePlacementError(result.reason);
        return;
      }

      shipPlacementUI.renderGameboardShips(human);
      shipPlacementUI.removeShipOption(ship.element);

      if (shipPlacementUI.getRemainingShips() === 0) {
        formsUI.hideShipForm();
        gameboardUI.disableGameboard(human);
        gameboardUI.renderGameboard(computer);
        gameboardUI.toggleTurnIndicator(human);
        generator.generateRandomGameboard(computer);
        shipPlacementUI.renderGameboardShips(computer);
      }
    },

    handleHoverPreview(button, player) {
      const ship = shipPlacementUI.getShipSelection();
      const orientation = shipPlacementUI.getOrientation();
      const coordinates = shipPlacementUI.getCoordinates(button);

      if (!ship || !orientation || !coordinates) {
        console.error("Invalid input for ship placement");
        return;
      }

      const result = validatePlacement(player, { start: coordinates, length: ship.length, orientation });

      if (!result.success) {
        handlePlacementError(result.reason);
        shipPlacementUI.highlightCells(result.success, { start: coordinates, length: ship.length, orientation });
        return;
      }

      shipPlacementUI.highlightCells(result.success, { start: coordinates, length: ship.length, orientation });
    },

    handleMouseOutPreview() {
      shipPlacementUI.clearHighlight();
    },
  };
}
