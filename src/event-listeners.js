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

function handlePlayerEvent(button, computer) {
  const x = parseInt(button.target.getAttribute("data-x"));
  const y = parseInt(button.target.getAttribute("data-y"));

  computer.gameboard.receiveAttack(x, y);

  if (computer.gameboard.gameboard[x][y] !== null) {
    showHitMark(button);
  }

  disableButton(button);
  showMissedShots(computer, 2);

  if (computer.gameboard.checkAllShipsSunk() === true) {
    handleGameOverEvent(button);
  }
}

function handleComputerEvent(player) {
  const x = generateRandomCoordinate(player.gameboard.gameboard.length);
  const y = generateRandomCoordinate(player.gameboard.gameboard.length);
  const exists = computerVisitedPositions.some(
    ([xi, xy]) => xi === x && xy === y
  );

  if (exists) {
    return handleComputerEvent(player);
  }

  computerVisitedPositions.push([x, y]);

  const boardButton = document.querySelector(
    `.board-square[data-player-id="1"][data-x="${x}"][data-y="${y}"]`
  );

  const id = setTimeout(() => {
    player.gameboard.receiveAttack(x, y);

    if (player.gameboard.gameboard[x][y] !== null) {
      showHitMark(boardButton);
    }

    if (player.gameboard.checkAllShipsSunk() === true) {
      handleGameOverEvent(boardButton);
    }

    showMissedShots(player, 1);
  }, 2500);

  activeTimeouts.push(id);
}

function handleGameOverEvent(button) {
  const el = button.target instanceof Element ? button.target : button;
  addGameOverModal(el.getAttribute("data-player-id"));
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
  player = createPlayer(0);
  computer = createPlayer(0);
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
