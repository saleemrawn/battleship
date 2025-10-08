import { generateRandomCoordinate } from "./helpers";
import {
  showMissedShots,
  showHitMark,
  disableButton,
  addGameOverModal,
  showGameOverModal,
  closeGameOverModal,
  clearGameboards,
} from "./dom-handler";
import createPlayer from "./player";

let human = createPlayer(1, "Player");
let computer = createPlayer(2, "Computer");

export function loadEventListeners() {
  addGlobalEventListener("click", `.board-square[data-player-id="2"]`, (event) => {
    handlePlayerEvent(event, computer);
  });

  addGlobalEventListener("mouseup", `.board-square[data-player-id="2"]`, () => {
    handleComputerEvent(human);
  });

  addGlobalEventListener("click", "#dialogPlayAgain", () => handlePlayAgainEvent(human, computer));
}

function addGlobalEventListener(type, selector, callback, parent = document) {
  parent.addEventListener(type, (event) => {
    if (event.target.matches(selector)) {
      callback(event);
    }
  });
}

function handlePlayAgainEvent() {
  resetPlayers();
  resetComputerVisitedPositions();
  clearAllTimeouts();
  clearGameboards();
  startGame();
  closeGameOverModal();
}

function resetPlayers() {
  human = createPlayer(1, "Player");
  computer = createPlayer(2, "Computer");
}

function resetComputerVisitedPositions() {
  computerVisitedPositions = [];
}

function clearAllTimeouts() {
  for (const id of activeTimeouts) {
    clearTimeout(id);
  }

  activeTimeouts = [];
}
