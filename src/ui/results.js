// Draw the match list: one collapsible section per brand.

import { describe } from "../matching/findMatches.js";
import { METHODS } from "../matching/methods.js";
import { saveCollapsed } from "../storage.js";
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
    const heading = document.createElement("h3");
    heading.className = "brand-head";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "brand-toggle";
    const chev = document.createElement("span");
    chev.className = "chev";
    chev.setAttribute("aria-hidden", "true");
    const name = document.createElement("span");
    name.textContent = group.brand;
    const count = document.createElement("span");
    count.className = "count";
    count.textContent = "(" + group.matches.length + ")";
    toggle.append(chev, name, count);
    heading.appendChild(toggle);

    const body = document.createElement("div");
    body.className = "brand-body";

    // Show the section open or closed, based on what we remembered.
    const applyState = () => {
      const isCollapsed = collapsed.has(group.brand);
      body.hidden = isCollapsed;
      toggle.setAttribute("aria-expanded", String(!isCollapsed));
      chev.textContent = isCollapsed ? "▸" : "▾";
    };
    applyState();

    toggle.addEventListener("click", () => {
      if (collapsed.has(group.brand)) collapsed.delete(group.brand);
      else collapsed.add(group.brand);
      saveCollapsed(collapsed);
      applyState();
    });

    for (const match of group.matches) {
      body.appendChild(matchRow(match, chosen, methodKey));
    }

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
