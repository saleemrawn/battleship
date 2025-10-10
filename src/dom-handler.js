export function renderGameboardShips(gameboard, playerID) {
  for (let i = 0; i < gameboard.length; i++) {
    for (let j = 0; j < gameboard[i].length; j++) {
      if (gameboard[i][j] !== null) {
        let boardButton = document.querySelector(
          `.board-square[data-player-id="${playerID}"][data-x="${i}"][data-y="${j}"]`
        );
        boardButton.classList.add("ship");
      }
    }
  }
}

export function clearGameboards() {
  document.querySelector("main").innerHTML = "";
}
