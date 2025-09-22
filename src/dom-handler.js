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
            `<button class="board-square" data-player-id="${playerID}" data-x="${j}" data-y="${i}"></button>`
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

export function enableGameboard(playerID) {
  const buttons = document.querySelectorAll(
    `.board-square[data-player-id="${playerID}"]`
  );

  buttons.forEach((button) => button.removeAttribute("disabled"));
}

export function disableGameboard(playerID) {
  const buttons = document.querySelectorAll(
    `.board-square[data-player-id="${playerID}"]`
  );

  buttons.forEach((button) => button.setAttribute("disabled", ""));
}

export function disableButton(button) {
  button.target.setAttribute("disabled", "");
}

export function showMissedShots(player) {
  player.gameboard.missedShots.forEach((coord) => {
    document.querySelector(
      `.board-square[data-player-id="${player.id}"][data-x="${coord[0]}"][data-y="${coord[1]}"]`
    ).innerHTML = `<span class="mdi--checkbox-blank-circle-outline"></span>`;
  });
}

export function showHitMark(button) {
  const el = button.target instanceof Element ? button.target : button;
  el.innerHTML = `<span class="mdi--close"></span>`;
}

export function addGameOverModal(playerName) {
  const body = document.querySelector("body");
  body.insertAdjacentHTML(
    "beforebegin",
    `
    <dialog id="gameOverDialog">
      <div class="dialog-text">
        <p>Game Over!</p>
        <p>${playerName} wins!</p>
      </div>
      <div class="dialog-buttons">
        <button id="dialogPlayAgain">Play Again</button>
      </div>
    </dialog>
    `
  );
}

export function showGameOverModal() {
  const dialog = document.querySelector("#gameOverDialog");
  dialog.showModal();
}

export function closeGameOverModal() {
  const dialog = document.querySelector("#gameOverDialog");
  dialog.close();
  dialog.remove();
}

export function clearGameboards() {
  document.querySelector("main").innerHTML = "";
}
