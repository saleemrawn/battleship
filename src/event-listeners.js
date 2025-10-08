import createPlayer from "./player";
import { gameEventController } from ".";

let human = createPlayer(1, "Player");
let computer = createPlayer(2, "Computer");

export function loadEventListeners(human, computer) {
  addGlobalEventListener("click", `.board-square[data-player-id="2"]`, (event) =>
    gameEventController.handlePlayerEvent(human, computer, event)
  );

  addGlobalEventListener("mouseup", `.board-square[data-player-id="2"]`, () => {
    gameEventController.handleComputerEvent(human, computer);
  });

  addGlobalEventListener("click", "#dialogPlayAgain", () => gameEventController.handlePlayAgainEvent(human, computer));
}

function addGlobalEventListener(type, selector, callback, parent = document) {
  parent.addEventListener(type, (event) => {
    if (event.target.matches(selector)) {
      callback(event);
    }
  });
}
