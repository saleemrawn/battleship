import { disableButton, renderAddShipsForm, renderGameboard, showHitMark, showMissedShots } from "../dom-handler";
import { createModalUI } from "../ui/modalUI";

export function createGameEventController(dependencies) {
  const { ui } = dependencies;

  let activeTimeouts = [];
  let visited = [];

  return {
    handlePlayerEvent(human, computer, button) {
      const x = parseInt(button.target.getAttribute("data-x"));
      const y = parseInt(button.target.getAttribute("data-y"));
      const computerBoard = computer.gameboard.gameboard;

      computer.gameboard.receiveAttack(y, x);

      if (computerBoard[y][x] !== null) {
        showHitMark(button);
      }

      disableButton(button);
      showMissedShots(computer);
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
          showHitMark(boardButton);
        }

        checkGameWinner(computer, human);
        showMissedShots(human);
      }, 2500);

      activeTimeouts.push(id);
    },

    handlePlayAgainEvent() {
      this.resetPlayers();
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

    resetPlayers(human, computer) {
      if (!human || !computer) {
        console.error("Invalid players");
        return;
      }

      human = createPlayer(1, "Player");
      computer = createPlayer(2, "Computer");
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
