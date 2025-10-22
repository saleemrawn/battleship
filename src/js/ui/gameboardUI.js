import { getBoardAlphabet, getBoardNumbers } from "../helpers";

export function createGameboardUI() {
  return {
    renderGameboard(player) {
      if (!player || typeof player !== "object" || Array.isArray(player)) {
        console.error("Invalid player object:", player);
        return;
      }

      const mainContainer = document.querySelector("main");
      const board = player.gameboard.board;

      mainContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="player-container" data-player-id="${player.id}">
          <div class="board-buttons"></div>
        </div>`
      );

      const container = document.querySelector(`.player-container[data-player-id="${player.id}"] .board-buttons`);
      const html = board
        .map((row, i) =>
          row
            .map(
              (elem, j) =>
                `<button class="board-button" data-player-id="${player.id}" data-x="${j}" data-y="${i}"></button>`
            )
            .join("")
        )
        .join("");

      container.insertAdjacentHTML("beforeend", html);
      this.renderGameboardAlphabet(`.player-container[data-player-id="${player.id}"]`);
      this.renderGameboardNumbers(`.player-container[data-player-id="${player.id}"]`);
      this.renderPlayerName(`.player-container[data-player-id="${player.id}"]`, player);
    },

    enableGameboard(player) {
      const buttons = document.querySelectorAll(`.board-button[data-player-id="${player.id}"]`);
      buttons.forEach((button) => button.removeAttribute("disabled"));
    },

    disableGameboard(player) {
      const buttons = document.querySelectorAll(`.board-button[data-player-id="${player.id}"]`);
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
          `.board-button[data-player-id="${player.id}"][data-x="${coord[1]}"][data-y="${coord[0]}"]`
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

    renderGameboardAlphabet(selector) {
      if (!selector) {
        console.error(`Invalid selector: ${selector}`);
        return;
      }

      const container = document.querySelector(selector);
      container.insertAdjacentHTML("afterbegin", `<div class="board-alphabet">`);

      const letters = getBoardAlphabet();
      const html = letters.map((letter) => `<div class="letter">${letter.toUpperCase()}</div>`).join("");

      const alphabet = document.querySelector(`${selector} .board-alphabet`);
      alphabet.insertAdjacentHTML("beforeend", html);
    },

    renderGameboardNumbers(selector) {
      if (!selector) {
        console.error(`Invalid selector: ${selector}`);
        return;
      }

      const container = document.querySelector(selector);
      container.insertAdjacentHTML("afterbegin", `<div class="board-numbers">`);

      const numbers = getBoardNumbers();
      const html = numbers.map((number) => `<div class="number">${number}</div>`).join("");

      const boardNumbers = document.querySelector(`${selector} .board-numbers`);
      boardNumbers.insertAdjacentHTML("beforeend", html);
    },

    renderPlayerName(selector, player) {
      if (!selector) {
        console.error(`Invalid selector: ${selector}`);
        return;
      }

      const container = document.querySelector(selector);
      const html = `
        <div class="board-player-name">${player.name}</div>
      `;

      container.insertAdjacentHTML("beforeend", html);
    },
  };
}
