export function createModalUI(config = {}) {
  const { containerSelector = "body", modalSelector = "gameOverDialog" } = config;

  const modalId = `#${modalSelector}`;

  return {
    addGameOverModal(player) {
      const container = document.querySelector(containerSelector);
      const template = document.createElement("template");
      const name = player.name;

      if (!container) {
        console.error(`Modal ${containerSelector} not found`);
        return;
      }

      template.innerHTML = `
        <dialog id="${modalSelector}">
          <div class="dialog-text">
              <div>Game Over!</div>
              <div><span class="winnerName"></span> wins!</div>
          </div>
          <div class="dialog-buttons">
              <button id="dialogPlayAgain">Play Again</button>
          </div>
        </dialog>
      `;

      const dialog = template.content.firstElementChild;
      dialog.querySelector(".winnerName").textContent = name;

      container.prepend(dialog);
    },

    showModal() {
      const dialog = document.querySelector(modalId);
      if (!dialog) {
        console.error(`Modal ${modalId} not found`);
        return;
      }

      dialog.showModal();
    },

    closeModal() {
      const dialog = document.querySelector(modalId);
      if (!dialog) {
        console.error(`Modal ${modalId} not found`);
        return;
      }

      dialog.close();
      dialog.remove();
    },
  };
}
