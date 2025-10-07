export function createGameEventController(dependencies) {
  const { modalUI } = dependencies;

  return {
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
