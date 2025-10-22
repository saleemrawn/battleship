import { createShipPlacementService } from "./services/shipPlacementService";
import { createShipPlacementController } from "./controllers/shipPlacementController";
import { createShipPlacementUI } from "./ui/shipPlacementUI";
import { createGameboardGeneratorService } from "./services/gameboardGeneratorService";
import { createGameEventController } from "./controllers/gameEventController";
import { createGameboardUI } from "./ui/gameboardUI";
import createPlayer from "./player";
import { createFormsUI } from "./ui/formsUI";
import { createModalUI } from "./ui/modalUI";
import renderHeader from "./ui/header";
import { loadEventListeners } from "./event-listeners";
import "../css/main.css";

const gameboardGeneratorService = createGameboardGeneratorService();
const shipPlacementService = createShipPlacementService();
const shipPlacementUI = createShipPlacementUI();
const gameboardUI = createGameboardUI();
const formsUI = createFormsUI();
const modalUI = createModalUI();

export const shipPlacementController = createShipPlacementController({
  service: shipPlacementService,
  generator: gameboardGeneratorService,
  shipPlacementUI: shipPlacementUI,
  formsUI: formsUI,
  gameboardUI: gameboardUI,
});

export const gameEventController = createGameEventController({
  shipPlacementUI: shipPlacementUI,
  gameboardUI: gameboardUI,
  formsUI: formsUI,
  modalUI: modalUI,
});

function init() {
  let human = createPlayer(1, "Player");
  let computer = createPlayer(2, "Computer");
  renderHeader();
  loadEventListeners(human, computer);
}

init();
