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

let computerVisitedPositions = [];
let activeTimeouts = [];
let player = createPlayer(1, "Player");
let computer = createPlayer(2, "Computer");

export function loadEventListeners() {
  addGlobalEventListener(
    "click",
    `.board-square[data-player-id="2"]`,
    (event) => {
      handlePlayerEvent(event, computer);
    }
  );

  addGlobalEventListener("mouseup", `.board-square[data-player-id="2"]`, () => {
    handleComputerEvent(player);
  });

  addGlobalEventListener("click", "#dialogPlayAgain", () =>
    handlePlayAgainEvent(player, computer)
  );
}

function addGlobalEventListener(type, selector, callback, parent = document) {
  parent.addEventListener(type, (event) => {
    if (event.target.matches(selector)) {
      callback(event);
    }
  });
}

function handlePlayerEvent(button, opponent) {
  const x = parseInt(button.target.getAttribute("data-x"));
  const y = parseInt(button.target.getAttribute("data-y"));

  opponent.gameboard.receiveAttack(x, y);

  if (opponent.gameboard.gameboard[x][y] !== null) {
    showHitMark(button);
  }

  disableButton(button);
  showMissedShots(opponent);

  if (opponent.gameboard.checkAllShipsSunk() === true) {
    handleGameOverEvent(player.name);
  }
}

function handleComputerEvent(opponent) {
  const x = generateRandomCoordinate(opponent.gameboard.gameboard.length);
  const y = generateRandomCoordinate(opponent.gameboard.gameboard.length);
  const exists = computerVisitedPositions.some(
    ([xi, xy]) => xi === x && xy === y
  );

  if (exists) {
    return handleComputerEvent(opponent);
  }

  computerVisitedPositions.push([x, y]);

  const boardButton = document.querySelector(
    `.board-square[data-player-id="${opponent.id}"][data-x="${x}"][data-y="${y}"]`
  );

  const id = setTimeout(() => {
    opponent.gameboard.receiveAttack(x, y);

    if (opponent.gameboard.gameboard[x][y] !== null) {
      showHitMark(boardButton);
    }

    if (opponent.gameboard.checkAllShipsSunk() === true) {
      handleGameOverEvent(computer.name);
    }

    showMissedShots(opponent);
  }, 2500);

  activeTimeouts.push(id);
}

function handleGameOverEvent(playerName) {
  addGameOverModal(playerName);
  showGameOverModal();
}

function handlePlayAgainEvent() {
  resetPlayers(player, computer);
  resetComputerVisitedPositions();
  clearAllTimeouts();
  clearGameboards();
  startGame();
  closeGameOverModal();
}

function resetPlayers() {
  player = createPlayer(1, "Player");
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
