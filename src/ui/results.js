// Draw the match list: one collapsible section per brand.

import { describe } from "../matching/findMatches.js";
import { METHODS } from "../matching/methods.js";
import { collapsibleSection } from "./collapsible.js";
import { reportLink } from "./reportLink.js";

// groups    = the result of findMatches()
// collapsed = a Set of brand names the user has closed (shared across searches)
export function renderResults(container, { chosen, groups, methodKey, collapsed }) {
  container.replaceChildren();

  if (groups.length === 0) {
    container.textContent = "No close matches found for this paint.";
    return;
  }

  for (const group of groups) {
    const { heading, body } = collapsibleSection({
      tag: "h3", key: group.brand, label: group.brand, count: group.matches.length, collapsed
    });

    for (const match of group.matches) {
      body.appendChild(matchRow(match, chosen, methodKey));
    }
    // Two Thin Coats picks come from their chart, so link and credit it.
    if (group.chart) body.appendChild(chartCredit(group.chart));

    container.append(heading, body);
  }
}

// One row: a color swatch, the paint name, how close it is, and a report link.
function matchRow(match, chosen, methodKey) {
  const row = document.createElement("div");
  row.className = "match";

  const swatch = document.createElement("div");
  swatch.className = "swatch";
  swatch.style.background = match.hex;

  const text = document.createElement("div");
  const title = document.createElement("b");
  title.textContent = match.name;
  const detail = document.createElement("small");
  detail.textContent = describe(match.distance, methodKey) + (match.sample ? " · sample data" : "");
  text.append(title, detail);
  text.appendChild(reportLink({
    paint: `${match.brand} "${match.name}" (${match.hex})`,
    context: `Shown as a match for Citadel "${chosen.name}" (${chosen.hex}) using ${METHODS[methodKey].label}.`
  }, match.name));

  row.append(swatch, text);
  return row;
}

// The credit line under the Two Thin Coats section, with a link to the chart.
function chartCredit(chart) {
  const credit = document.createElement("p");
  credit.className = "chart-credit";
  const link = document.createElement("a");
  link.href = chart.url;
  link.textContent = chart.title;
  credit.append(
    "From the ", link, ` (${chart.credit}). The chart notes that these are not exact matches ` +
    "between brands, so your model may look a little different."
  );
  return credit;
}
