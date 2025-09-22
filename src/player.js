import createGameboard from "./gameboard";

export default function createPlayer(playerId, playerName) {
  let id = playerId;
  let name = playerName;
  let gameboard = createGameboard();

  return {
    get id() {
      return id;
    },

    get name() {
      return name;
    },

    get gameboard() {
      return gameboard;
    },

    set id(playerId) {
      id = playerId;
    },

    set name(playerName) {
      name = playerName;
    },

    set gameboard(val) {
      gameboard = val;
    },
  };
}
