import createPlayer from "../src/player";

test("Player obj has type property with value 0 for real player", () => {
  const newPlayer = createPlayer(0);
  expect(newPlayer).toHaveProperty("type", 0);
});

test("Player obj has type property with value 1 for computer player", () => {
  const newPlayer = createPlayer(1);
  expect(newPlayer).toHaveProperty("type", 1);
});

test("Player obj has gameboard property with val gameboard obj", () => {
  const newPlayer = createPlayer(0);
  expect(newPlayer).toHaveProperty("gameboard", expect.any(Object));
});
