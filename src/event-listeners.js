import { generateRandomCoordinate } from "./css/helpers";
import { showMissedShots, showHitMark, disableButton } from "./dom-handler";

const computerVisitedPositions = [];

export function loadEventListeners(playerOneObj, playerTwoObj) {
  addGlobalEventListener(
    "click",
    `.board-square[data-player-id="2"]`,
    (event) => {
      handlePlayerEvent(event, playerOneObj, playerTwoObj);
    }
  );
}

function addGlobalEventListener(type, selector, callback, parent = document) {
  parent.addEventListener(type, (event) => {
    if (event.target.matches(selector)) {
      callback(event);
    }
  });
}

function handlePlayerEvent(button, playerOneObj, playerTwoObj) {
  const x = parseInt(button.target.getAttribute("data-x"));
  const y = parseInt(button.target.getAttribute("data-y"));

  playerTwoObj.gameboard.receiveAttack(x, y);

  if (playerTwoObj.gameboard.checkAllShipsSunk() === true) {
    handleGameOverEvent(button);
  }

  if (playerTwoObj.gameboard.gameboard[x][y] !== null) {
    showHitMark(button);
  }

  disableButton(button);
  showMissedShots(playerTwoObj, 2);
  handleComputerEvent(playerOneObj);
}

function handleComputerEvent(playerOneObj) {
  const x = generateRandomCoordinate(playerOneObj.gameboard.gameboard.length);
  const y = generateRandomCoordinate(playerOneObj.gameboard.gameboard.length);
  const exists = computerVisitedPositions.some(
    ([xi, xy]) => xi === x && xy === y
  );

  if (exists) {
    return handleComputerEvent(playerOneObj);
  }

  if (playerOneObj.gameboard.checkAllShipsSunk() === true) {
    handleGameOverEvent(boardButton);
  }

  computerVisitedPositions.push([x, y]);

  const boardButton = document.querySelector(
    `.board-square[data-player-id="1"][data-x="${x}"][data-y="${y}"]`
  );

  setTimeout(() => {
    playerOneObj.gameboard.receiveAttack(x, y);

    if (playerOneObj.gameboard.gameboard[x][y] !== null) {
      showHitMark(boardButton);
    }

    showMissedShots(playerOneObj, 1);
  }, 2500);
}
