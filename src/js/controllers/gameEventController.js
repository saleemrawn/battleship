import { generateRandomCoordinate } from "../helpers";

export function createGameEventController(dependencies) {
  const { shipPlacementUI, gameboardUI, formsUI, modalUI } = dependencies;

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
      const computerBoard = computer.gameboard.board;

      computer.gameboard.receiveAttack(y, x);

      if (computerBoard[y][x] !== null) {
        gameboardUI.showHitMark(button);
      }

      gameboardUI.disableButton(button);
      gameboardUI.showMissedShots(computer);
      gameboardUI.disableGameboard(computer);
      this.checkGameWinner(human, computer);
    },

    handleComputerEvent(human, computer) {
      const boardSize = computer.gameboard.board.length;
      const x = generateRandomCoordinate(boardSize);
      const y = generateRandomCoordinate(boardSize);
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

        if (human.gameboard.board[y][x] !== null) {
          gameboardUI.showHitMark(boardButton);
        }

        this.checkGameWinner(computer, human);
        gameboardUI.showMissedShots(human);
        gameboardUI.enableGameboard(computer);
      }, 2500);

      activeTimeouts.push(id);
    },

    handlePlayAgainEvent(human, computer) {
      this.resetPlayer(human);
      this.resetPlayer(computer);
      this.resetVisited();
      this.clearTimeouts();
      gameboardUI.clearGameboards();
      this.handleGameSetup(human);
      modalUI.closeModal();
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

      player.gameboard.board = Array(10)
        .fill(null)
        .map(() => Array(10).fill(null));
      player.gameboard.missedShots = [];
    },

    checkGameWinner(player, opponent) {
      if (opponent.gameboard.checkAllShipsSunk() === true) {
        this.handleGameOverEvent(player);
      }
    },

    handleGameOverEvent(player) {
      modalUI.addGameOverModal(player);
      modalUI.showModal();
    },
  };
}
