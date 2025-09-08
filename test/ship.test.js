import createShip from "../src/ship";

test("Ship obj has length property with value 2", () => {
  const newShip = createShip(2);
  expect(newShip).toHaveProperty("length", 2);
});

test("Ship obj has totalHits property initialised to 0", () => {
  const newShip = createShip(2);
  expect(newShip).toHaveProperty("totalHits", 0);
});

test("Ship obj has hasSunk property initialised to false", () => {
  const newShip = createShip(2);
  expect(newShip).toHaveProperty("hasSunk", false);
});

test("Ship obj hit() method increases totalHits to 1", () => {
  const newShip = createShip(2);
  newShip.hit();
  expect(newShip.totalHits).toEqual(1);
});

test("Ship obj isSunk() method returns false if totalHits does not equal ship length", () => {
  const newShip = createShip(2);
  expect(newShip.isSunk()).toBeFalsy();
});

test("Ship obj isSunk() method returns true if totalHits equals ship length", () => {
  const newShip = createShip(2);
  newShip.hit();
  newShip.hit();
  expect(newShip.isSunk()).toBeTruthy();
});
