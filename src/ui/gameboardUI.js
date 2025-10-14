export function createGameboardUI() {
  return {
    renderGameboard(player) {
      if (!player || typeof player !== "object" || Array.isArray(player)) {
        console.error("Invalid player object:", player);
        return;
      }

      const mainContainer = document.querySelector("main");
      const board = player.gameboard.gameboard;

      mainContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="player-container" data-player-id="${player.id}"></div>`
      );

      const container = document.querySelector(`.player-container[data-player-id="${player.id}"]`);
      const html = board
        .map((row, i) =>
          row
            .map(
              (elem, j) =>
                `<button class="board-square" data-player-id="${player.id}" data-x="${j}" data-y="${i}"></button>`
            )
            .join("")
        )
        .join("");

      container.insertAdjacentHTML("beforeend", html);
    },

    enableGameboard(player) {
      const buttons = document.querySelectorAll(`.board-square[data-player-id="${player.id}"]`);
      buttons.forEach((button) => button.removeAttribute("disabled"));
    },

    disableGameboard(player) {
      const buttons = document.querySelectorAll(`.board-square[data-player-id="${player.id}"]`);
      buttons.forEach((button) => button.setAttribute("disabled", ""));
    },

    disableButton(button) {
      button.target.setAttribute("disabled", "");
    },

    showHitMark(button) {
      const el = button.target instanceof Element ? button.target : button;
      el.innerHTML = `<span class="mdi--close"></span>`;
    },

    showMissedShots(player) {
      player.gameboard.missedShots.forEach((coord) => {
        document.querySelector(
          `.board-square[data-player-id="${player.id}"][data-x="${coord[1]}"][data-y="${coord[0]}"]`
        ).innerHTML = `<span class="mdi--checkbox-blank-circle-outline"></span>`;
      });
    },

    clearGameboards(selector = "main") {
      if (!selector) {
        console.error("Invalid selector");
        return null;
      }

      document.querySelector(selector).innerHTML = "";
    },
  };
}
