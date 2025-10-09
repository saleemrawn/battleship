export function createShipPlacementController(dependencies) {
  const { service, generator, shipPlacementUI, formsUI, gameboardUI } = dependencies;

  function handlePlacementError(reason) {
    console.warn(`Placement failed: ${reason}`);
  }

  return {
    handleAddShip(button, player, computer) {
      const ship = shipPlacementUI.getShipSelection();
      const orientation = shipPlacementUI.getOrientation();
      const coordinates = shipPlacementUI.getCoordinates(button);
      const board = player.gameboard.gameboard;

      if (!ship || !orientation || !coordinates) {
        console.error("Invalid input for ship placement");
        return;
      }

      const result = service.placeShip(player, { start: coordinates, length: ship.length, orientation });

      if (!result.success) {
        handlePlacementError(result.reason);
        return;
      }

      shipPlacementUI.renderGameboardShips(board, player.id);
      shipPlacementUI.removeShipOption(ship.element);

      if (shipPlacementUI.getRemainingShips() === 0) {
        formsUI.hideShipForm();
        gameboardUI.renderGameboard(computer);
        generator.generateRandomGameboard(computer);
        shipPlacementUI.renderGameboardShips(computer.gameboard.gameboard, computer.id);
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

      const result = service.validatePlacement(player, { start: coordinates, length: ship.length, orientation });

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
