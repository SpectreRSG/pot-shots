// The matching rules: which paints count as a match, and in what order.

import { METHODS } from "./methods.js";

// For the chosen paint, find the best matches in EACH other brand.
// Returns [{ brand, matches: [paint + distance, ...] }, ...], best brand first.
export function findMatches(chosenPaint, allPaints, methodKey, perBrand = 2) {
  const method = METHODS[methodKey];
  const byBrand = {};

  for (const p of allPaints) {
    if (p.brand === chosenPaint.brand) continue;          // skip the chosen paint's own brand
    if (p.metallic !== chosenPaint.metallic) continue;    // metallics only match metallics
    const distance = method.measure(chosenPaint.hex, p.hex);
    if (distance > method.max) continue;                  // drop obvious mismatches
    (byBrand[p.brand] = byBrand[p.brand] || []).push({ ...p, distance });
  }

  // Sort each brand's list, keep the best few, then order brands by their best match.
  return Object.keys(byBrand)
    .map(brand => ({
      brand,
      matches: byBrand[brand].sort((x, y) => x.distance - y.distance).slice(0, perBrand)
    }))
    .sort((a, b) => a.matches[0].distance - b.matches[0].distance);
}

// Turn a distance number into words a human understands.
export function describe(distance, methodKey) {
  const method = METHODS[methodKey];
  if (distance < method.veryClose) return "Very close";
  if (distance < method.close) return "Close";
  return "Rough match";
}
