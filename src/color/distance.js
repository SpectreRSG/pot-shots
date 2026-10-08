// How far apart two colors are. A smaller number means a closer match.

import { hexToRgb, hexToLab } from "./convert.js";

// "Delta E 76": straight-line distance between two Lab colors.
// Rough guide: under 2 you can barely see a difference, under 10 they look similar.
export function deltaE76(labA, labB) {
  return Math.sqrt(
    (labA.L - labB.L) ** 2 +
    (labA.a - labB.a) ** 2 +
    (labA.b - labB.b) ** 2
  );
}

// Delta E 76 for two hex codes.
export function labDistance(hexA, hexB) {
  return deltaE76(hexToLab(hexA), hexToLab(hexB));
}

// The simple method: straight-line distance using red, green, and blue numbers.
export function rgbDistance(hexA, hexB) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return Math.sqrt(
    (a.r - b.r) ** 2 +
    (a.g - b.g) ** 2 +
    (a.b - b.b) ** 2
  );
}
