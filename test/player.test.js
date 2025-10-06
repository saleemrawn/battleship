import createPlayer from "../src/player";

test("Player obj has gameboard property with val gameboard obj", () => {
  const newPlayer = createPlayer(0);
  expect(newPlayer).toHaveProperty("gameboard", expect.any(Object));
});
