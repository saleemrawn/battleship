export function createShipPlacementController(dependencies) {
  const { service, generator, ui, formsUI, gameboardUI } = dependencies;

  function handlePlacementError(reason) {
    console.warn(`Placement failed: ${reason}`);
  }

  return {
    handleAddShip(button, player, computer) {
      const ship = ui.getShipSelection();
      const orientation = ui.getOrientation();
      const coordinates = ui.getCoordinates(button);
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

      ui.renderGameboardShips(board, player.id);
      ui.removeShipOption(ship.element);

      if (ui.getRemainingShips() === 0) {
        formsUI.hideShipForm();
        gameboardUI.renderGameboard(computer);
        generator.generateRandomGameboard(computer);
        ui.renderGameboardShips(computer.gameboard.gameboard, computer.id);
      }
    },

    handleHoverPreview(button, player) {
      const ship = ui.getShipSelection();
      const orientation = ui.getOrientation();
      const coordinates = ui.getCoordinates(button);

      if (!ship || !orientation || !coordinates) {
        console.error("Invalid input for ship placement");
        return;
      }

      const result = service.validatePlacement(player, { start: coordinates, length: ship.length, orientation });

      if (!result.success) {
        handlePlacementError(result.reason);
        ui.highlightCells(result.success, { start: coordinates, length: ship.length, orientation });
        return;
      }

      ui.highlightCells(result.success, { start: coordinates, length: ship.length, orientation });
    },

    handleMouseOutPreview() {
      ui.clearHighlight();
    },
  };
}
