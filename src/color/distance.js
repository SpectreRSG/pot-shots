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

// How different two colors are in hue (red vs orange vs yellow...), on the Lab scale.
// It is weighted by how strong (saturated) the colors are: a hue change is easy to
// see between two bright colors, but hard to see between two greyish ones.
// Two greys always score 0, because a grey has no real hue.
export function hueDifference(hexA, hexB) {
  const a = hexToLab(hexA);
  const b = hexToLab(hexB);
  const chromaA = Math.hypot(a.a, a.b);   // color strength: 0 = grey
  const chromaB = Math.hypot(b.a, b.b);
  let angle = Math.abs(Math.atan2(a.b, a.a) - Math.atan2(b.b, b.a));   // hue angle gap
  if (angle > Math.PI) angle = 2 * Math.PI - angle;   // go the short way round the color wheel
  return 2 * Math.sqrt(chromaA * chromaB) * Math.sin(angle / 2);
}
