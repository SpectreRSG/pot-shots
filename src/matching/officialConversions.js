// Official conversions: paint swaps chosen by a paint maker, not by color math.
// Right now that is the Two Thin Coats conversion chart.

// Find the chart entries for a Citadel paint name. Usually one, or none.
// "chart" is the contents of src/data/two-thin-coats-chart.json.
export function findConversions(citadelName, chart) {
  if (!chart.enabled) return [];
  // The chart spells a few Citadel names differently, so fix those first.
  const fixName = name => chart.citadelNameFixes[name] || name;
  return chart.conversions.filter(c => fixName(c.citadel) === citadelName);
}
