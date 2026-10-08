// Official conversions: paint swaps chosen by a paint maker, not by color math.
// Right now that is the Two Thin Coats conversion chart.

import { METHODS } from "./methods.js";

// Find the chart entries for a Citadel paint name. Usually one, or none.
// "chart" is the contents of src/data/two-thin-coats-chart.json.
export function findConversions(citadelName, chart) {
  if (!chart.enabled) return [];
  // The chart spells a few Citadel names differently, so fix those first.
  const fixName = name => chart.citadelNameFixes[name] || name;
  return chart.conversions.filter(c => fixName(c.citadel) === citadelName);
}

// Add the chart's pick to the brand groups from findMatches(), as a normal
// "Two Thin Coats" brand group, and keep brands ordered by their best match.
// The chart's pick is always shown, however far its color is: the paint maker chose it.
export function addChartGroup(groups, chosen, chart, methodKey) {
  const matches = findConversions(chosen.name, chart).map(c => ({
    brand: "Two Thin Coats",
    name: c.twoThinCoats,
    hex: c.hex,
    distance: METHODS[methodKey].measure(chosen.hex, c.hex)
  }));
  if (matches.length === 0) return groups;
  return [...groups, { brand: "Two Thin Coats", matches, chart }]
    .sort((a, b) => a.matches[0].distance - b.matches[0].distance);
}
