import { createCoordinate } from "../domain/placement/coordinate";

export function createShipPlacementUI(config = {}) {
  const { shipSelectorId = "ship-length", orientationName = "orientation" } = config;

  return {
    getShipSelection() {
      const selector = document.getElementById(shipSelectorId);
      const options = selector?.selectedOptions;

      if (!options || options.length === 0) {
        return null;
      }

      return {
        element: options[0],
        length: parseInt(options[0].value),
      };
    },

    getOrientation() {
      const input = document.querySelector(`input[name="${orientationName}"]:checked`);
      return input?.value || null;
    },

    getCoordinates(button) {
      const x = button.target.getAttribute("data-x");
      const y = button.target.getAttribute("data-y");

      if (x === null || y === null) {
        return null;
      }

      return createCoordinate(x, y);
    },

    removeShipOption(shipElement) {
      shipElement.remove();
    },

    getRemainingShips() {
      const selector = document.getElementById(shipSelectorId);
      return selector?.selectedOptions.length || 0;
    },

    highlightCells(result, placement, playerId = 1) {
      const { start, length, orientation } = placement;
      const className = result ? "ship-valid" : "ship-invalid";

      for (let i = 0; i < length; i++) {
        const x = orientation === "horizontal" ? start.x + i : start.x;
        const y = orientation === "vertical" ? start.y + i : start.y;
        const selector = `.board-square[data-player-id="${playerId}"][data-x="${x}"][data-y="${y}"]`;
        const cell = document.querySelector(selector);

        if (cell) {
          cell.classList.add(className);
        } else {
          console.warn(`Cell not found at (${x}, ${y})`);
        }
      }
    },

    clearHighlight() {
      const boardSquares = document.querySelectorAll(".board-square");
      boardSquares.forEach((sq) => {
        sq.classList.remove("ship-valid", "ship-invalid");
      });
    },

    renderGameboardShips(gameboard, playerId) {
      for (let i = 0; i < gameboard.length; i++) {
        for (let j = 0; j < gameboard[i].length; j++) {
          if (gameboard[i][j] !== null) {
            let boardButton = document.querySelector(
              `.board-square[data-player-id="${playerId}"][data-x="${j}"][data-y="${i}"]`
            );
            boardButton.classList.add("ship");
          }
        }
      }
    },
  };
}
