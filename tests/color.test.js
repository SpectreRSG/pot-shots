// Tests for the color math. Run with: npm test
import { describe, it, expect } from "vitest";
import { hexToRgb, hexToLab } from "../src/color/convert.js";
import { deltaE76, labDistance, rgbDistance } from "../src/color/distance.js";

describe("hexToRgb", () => {
  it("reads each pair of hex digits as one color channel", () => {
    expect(hexToRgb("#9a1115")).toEqual({ r: 154, g: 17, b: 21 });
    expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb("#FFFFFF")).toEqual({ r: 255, g: 255, b: 255 });
  });
});

describe("hexToLab", () => {
  // Reference values for sRGB colors (D65 white), from standard color tables.
  const cases = [
    ["#ffffff", { L: 100, a: 0, b: 0 }],
    ["#000000", { L: 0, a: 0, b: 0 }],
    ["#ff0000", { L: 53.24, a: 80.09, b: 67.2 }],
    ["#00ff00", { L: 87.73, a: -86.18, b: 83.18 }],
    ["#0000ff", { L: 32.3, a: 79.19, b: -107.86 }],
    ["#808080", { L: 53.59, a: 0, b: 0 }]
  ];
  for (const [hex, expected] of cases) {
    it(`converts ${hex}`, () => {
      const lab = hexToLab(hex);
      // Close to 1 decimal place is plenty for matching paints.
      expect(lab.L).toBeCloseTo(expected.L, 1);
      expect(lab.a).toBeCloseTo(expected.a, 1);
      expect(lab.b).toBeCloseTo(expected.b, 1);
    });
  }
});

describe("deltaE76", () => {
  it("is the straight-line distance between two Lab colors", () => {
    // 3-4-5 triangle: moving 3 in L and 4 in a is a distance of 5.
    expect(deltaE76({ L: 50, a: 0, b: 0 }, { L: 53, a: 4, b: 0 })).toBe(5);
  });

  it("is zero for the same color, and the same in both directions", () => {
    expect(labDistance("#9a1115", "#9a1115")).toBe(0);
    expect(labDistance("#9a1115", "#1c4e8e")).toBeCloseTo(labDistance("#1c4e8e", "#9a1115"), 10);
  });

  it("puts black and white 100 apart", () => {
    expect(labDistance("#000000", "#ffffff")).toBeCloseTo(100, 1);
  });
});

describe("rgbDistance", () => {
  it("is the straight-line distance between two RGB colors", () => {
    expect(rgbDistance("#000000", "#030400")).toBe(5);
    expect(rgbDistance("#000000", "#ffffff")).toBeCloseTo(441.67, 2);
  });

  it("is zero for the same color", () => {
    expect(rgbDistance("#9a1115", "#9a1115")).toBe(0);
  });
});
