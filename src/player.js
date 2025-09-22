import createGameboard from "./gameboard";

export default function createPlayer(playerId) {
  let id = playerId;
  let gameboard = createGameboard();

  return {
    get id() {
      return id;
    },

    get gameboard() {
      return gameboard;
    },

    set id(playerId) {
      id = playerId;
    },

    set gameboard(val) {
      gameboard = val;
    },
  };
}
