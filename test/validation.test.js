describe("validatePlacement", () => {
  test("returns false if placement is out of bounds", () => {
    mockStrategy.isWithinBounds.mockReturnValue(false);
    mockStrategy.calculatePositions.mockReturnValue([{ x: 0, y: 0 }]);

    const result = mockService.validatePlacement(mockPlayer, mockPlacement);

    expect(getPlacementStrategy).toHaveBeenCalledWith("horizontal");
    expect(mockStrategy.isWithinBounds).toHaveBeenCalledWith({ x: 0, y: 0 }, 2, 10);
    expect(result).toEqual({ success: false, reason: "OUT_OF_BOUNDS" });
  });

  test("returns false if placement is invalid position", () => {
    mockStrategy.isWithinBounds.mockReturnValue(true);
    mockValidator.isValidPlacement.mockReturnValue(false);
    mockStrategy.calculatePositions.mockReturnValue([{ x: 0, y: 0 }]);

    const result = mockService.validatePlacement(mockPlayer, mockPlacement);

    expect(result).toEqual({ success: false, reason: "INVALID_POSITION" });
    expect(getPlacementStrategy).toHaveBeenCalledWith("horizontal");
    expect(mockStrategy.isWithinBounds).toHaveBeenCalledWith({ x: 0, y: 0 }, 2, 10);
    expect(mockValidator.isValidPlacement).toHaveBeenCalledWith(expect.any(Array), expect.any(Array));
  });

  test("returns true if ship placement is valid", () => {
    mockStrategy.isWithinBounds.mockReturnValue(true);
    mockValidator.isValidPlacement.mockReturnValue(true);
    mockStrategy.calculatePositions.mockReturnValue([{ x: 0, y: 0 }]);

    const result = mockService.validatePlacement(mockPlayer, mockPlacement);

    expect(result).toEqual({ success: true });
    expect(getPlacementStrategy).toHaveBeenCalledWith("horizontal");
    expect(mockStrategy.isWithinBounds).toHaveBeenCalledWith({ x: 0, y: 0 }, 2, 10);
    expect(mockValidator.isValidPlacement).toHaveBeenCalledWith(expect.any(Array), expect.any(Array));
  });
});
