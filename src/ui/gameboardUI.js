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
  };
}
