import { disableButton, renderAddShipsForm, showHitMark, showMissedShots } from "../dom-handler";
import { createModalUI } from "../ui/modalUI";

export function createGameEventController(dependencies) {
  const { shipPlacementUI, gameboardUI, formsUI } = dependencies;

  let activeTimeouts = [];
  let visited = [];

  return {
    handleGameSetup(human) {
      gameboardUI.renderGameboard(human);
      formsUI.renderShipForm();
      shipPlacementUI.renderGameboardShips(human);
    },

    handlePlayerEvent(human, computer, button) {
      const x = parseInt(button.target.getAttribute("data-x"));
      const y = parseInt(button.target.getAttribute("data-y"));
      const computerBoard = computer.gameboard.gameboard;

      computer.gameboard.receiveAttack(y, x);

      if (computerBoard[y][x] !== null) {
        gameboardUI.showHitMark(button);
      }

      gameboardUI.disableButton(button);
      gameboardUI.showMissedShots(computer);
      checkGameWinner(human, computer);
    },

    handleComputerEvent(human, computer) {
      const x = Math.floor(Math.random() * boardSize);
      const y = Math.floor(Math.random() * boardSize);
      const exists = visited.some(([xi, xy]) => xi === x && xy === y);

      if (exists) {
        return this.handleComputerEvent(human, computer);
      }

      visited.push([x, y]);

      const boardButton = document.querySelector(
        `.board-square[data-player-id="${human.id}"][data-x="${x}"][data-y="${y}"]`
      );

      const id = setTimeout(() => {
        human.gameboard.receiveAttack(y, x);

        if (human.gameboard.gameboard[y][x] !== null) {
          gameboardUI.showHitMark(boardButton);
        }

        checkGameWinner(computer, human);
        gameboardUI.showMissedShots(human);
      }, 2500);

      activeTimeouts.push(id);
    },

    handlePlayAgainEvent(human, computer) {
      this.resetPlayer(human);
      this.resetPlayer(computer);
      this.resetVisited();
      this.clearTimeouts();
      clearGameboards();
      startGame();
      closeGameOverModal();
    },

    resetVisited() {
      visited = [];
    },

    clearTimeouts() {
      for (const id of activeTimeouts) {
        clearTimeout(id);
      }

      activeTimeouts = [];
    },

    resetPlayer(player) {
      if (!player) {
        console.error("Invalid player");
        return;
      }

      player.gameboard.gameboard = Array(10)
        .fill(null)
        .map(() => Array(10).fill(null));
      player.gameboard.missedShots = [];
    },
  };
}

function checkGameWinner(player, opponent) {
  if (opponent.gameboard.checkAllShipsSunk() === true) {
    handleGameOverEvent(player);
  }
}

function handleGameOverEvent(player) {
  const modalUI = createModalUI();
  modalUI.addGameOverModal(player);
  modalUI.showModal();
}
