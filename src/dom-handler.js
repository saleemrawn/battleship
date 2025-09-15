export function renderGameboard(gameboard, playerID) {
  const mainContainer = document.querySelector("main");

  mainContainer.insertAdjacentHTML(
    "beforeend",
    `
    <div class="player-container" data-player-id="${playerID}">
        <div class="overlay hide"></div>
    </div>
    `
  );

  const playerContainer = document.querySelector(
    `.player-container[data-player-id="${playerID}"]`
  );

  const html = gameboard
    .map((row, i) =>
      row
        .map(
          (elem, j) =>
            `<button class="board-square" data-player-id="${playerID}" data-x="${i}" data-y="${j}"></button>`
        )
        .join("")
    )
    .join("");

  playerContainer.insertAdjacentHTML("beforeend", html);
}

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
