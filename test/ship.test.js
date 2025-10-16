import createShip from "../src/js/ship";

let ship;

beforeEach(() => {
  ship = createShip(2);
});

test("Ship obj has length property with value 2", () => {
  expect(ship).toHaveProperty("length", 2);
});

test("Ship obj has totalHits property initialised to 0", () => {
  expect(ship).toHaveProperty("totalHits", 0);
});

test("Ship obj has hasSunk property initialised to false", () => {
  expect(ship).toHaveProperty("hasSunk", false);
});

test("Ship obj hit() method increases totalHits to 1", () => {
  ship.hit();
  expect(ship.totalHits).toEqual(1);
});

test("Ship obj isSunk() method returns false if totalHits does not equal ship length", () => {
  expect(ship.isSunk()).toBeFalsy();
});

test("Ship obj isSunk() method returns true if totalHits equals ship length", () => {
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBeTruthy();
});
