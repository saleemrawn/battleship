export function createGameStateManager(callbacks) {
  const { hideForm, disableGameboard, addComputer } = callbacks;

  return {
    onAllShipsPlaced(player) {
      if (player === null) {
        console.error("Invalid player");
        return;
      }

      hideForm();
      disableGameboard(player.id);
      addComputer();
    },
  };
}
