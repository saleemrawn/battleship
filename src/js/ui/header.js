import battleshipLogo from "../../img/battleship-logo.png";

export default function renderHeader(selector = "body") {
  const container = document.querySelector(selector);

  const html = `
    <header>
      <img src="${battleshipLogo}" alt="battleship logo" />
      <div class="utility-buttons">
        <button class="new-game-button">New Game</button>
      </div>
    </header>
  `;

  container.insertAdjacentHTML("afterbegin", html);
}
