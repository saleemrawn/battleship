export function getPlacementStrategy(orientation) {
  const strategy = placementStrategies[orientation];
  if (!strategy) {
    throw new Error(`Unknown orientation: ${orientation}`);
  }
  return strategy;
}

const placementStrategies = {
  horizontal: {
    calculatePositions: (start, length) => {
      return Array.from({ length }, (_, i) => [start.x + i, start.y]);
    },

    isWithinBounds: (start, length, boardSize) => {
      return start.x + length <= boardSize;
    },
  },

  vertical: {
    calculatePositions: (start, length) => {
      return Array.from({ length }, (_, i) => [start.x, start.y + i]);
    },

    isWithinBounds: (start, length, boardSize) => {
      return start.y + length <= boardSize;
    },
  },
};
