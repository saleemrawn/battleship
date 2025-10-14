import { getShipsInformation } from "../helpers";

export function createFormsUI(containerSelector = "main") {
  return {
    renderShipForm() {
      const mainContainer = document.querySelector(containerSelector);

      if (!mainContainer) {
        console.error(`Container "${containerSelector}" not found`);
        return null;
      }

      this.hideShipForm();

      const ships = getShipsInformation();
      const html = `
        <div class="ships-container">
          <h2>Add ships</h2>
          <div class="ship-controls">
            <div class="control-group">
              <label for="ship-length">Ships</label>
              <select name="ship-length" id="ship-length">
                ${ships
                  .map(
                    (ship) =>
                      `<option value="${ship.length}" data-ship-name="${ship.name}">${ship.name} (${ship.length})</option>`
                  )
                  .join("")}
              </select>
            </div>
            
            <fieldset>
              <legend>Orientation:</legend>
              <div class="radio-group">
                <input type="radio" id="horizontal" value="horizontal" name="orientation" checked />
                <label for="horizontal">Horizontal</label>
              </div>
              <div class="radio-group">
                <input type="radio" id="vertical" value="vertical" name="orientation" />
                <label for="vertical">Vertical</label>
              </div>
            </fieldset>
          </div>
        </div>
      `;

      mainContainer.insertAdjacentHTML("beforeend", html);
    },

    hideShipForm() {
      const container = document.querySelector(".ships-container");
      container?.remove();
    },
  };
}
