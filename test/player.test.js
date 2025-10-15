import createPlayer from "../src/js/player";

let player;

beforeEach(() => {
  player = createPlayer(1, "Human");
});

test("Player has gameboard property with value gameboard obj", () => {
  expect(player).toHaveProperty("gameboard", expect.any(Object));
});

test("Player has name property with value Human", () => {
  expect(player).toHaveProperty("name", "Human");
});

test("Player has id property with value 1", () => {
  expect(player).toHaveProperty("id", 1);
});
