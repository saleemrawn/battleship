import { gameEventController } from ".";
import { shipPlacementController } from ".";

export function loadEventListeners(human, computer) {
  window.addEventListener("load", () => gameEventController.handleGameSetup(human));

  addGlobalEventListener("click", `.board-square[data-player-id="2"]`, (event) =>
    gameEventController.handlePlayerEvent(human, computer, event)
  );

  addGlobalEventListener("mouseup", `.board-square[data-player-id="2"]`, () => {
    gameEventController.handleComputerEvent(human, computer);
  });

  addGlobalEventListener("click", `.board-square[data-player-id="1"]`, (event) =>
    shipPlacementController.handleAddShip(event, human, computer)
  );

  addGlobalEventListener("click", "#dialogPlayAgain", () => gameEventController.handlePlayAgainEvent(human, computer));
}

function addGlobalEventListener(type, selector, callback, parent = document) {
  parent.addEventListener(type, (event) => {
    if (event.target.matches(selector)) {
      callback(event);
    }
  });
}
