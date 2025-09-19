import createGameboard from "./gameboard";

export default function createPlayer(playerType) {
  let type = playerType;
  let gameboard = createGameboard();

  return {
    get type() {
      return type;
    },

    get gameboard() {
      return gameboard;
    },

    set type(val) {
      type = val;
    },

    set gameboard(val) {
      gameboard = val;
    },
  };
}
