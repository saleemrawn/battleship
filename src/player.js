import createGameboard from "./gameboard";

export default function createPlayer(playerType) {
  const type = playerType;
  const gameboard = createGameboard();

  return {
    get type() {
      return type;
    },

    get gameboard() {
      return gameboard;
    },
  };
}
