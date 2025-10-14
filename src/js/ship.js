export default function createShip(shipLength) {
  const length = shipLength;
  let totalHits = 0;
  let hasSunk = false;

  const hit = () => totalHits++;
  const isSunk = () => (totalHits === length ? true : false);

  return {
    get length() {
      return length;
    },

    get totalHits() {
      return totalHits;
    },

    get hasSunk() {
      return hasSunk;
    },

    hit,
    isSunk,
  };
}
