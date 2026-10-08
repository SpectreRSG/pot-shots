// Draw the "Two Thin Coats conversion" box. Hidden when the chart has no entry.

import { reportLink } from "./reportLink.js";

// How each tone is described on the page.
const TONES = {
  shadow: "Shadow (darkest of the three tones)",
  midtone: "Midtone (middle of the three tones)",
  highlight: "Highlight (lightest of the three tones)"
};

export function renderOfficial(container, { chosen, conversions, chart }) {
  container.replaceChildren();
  container.hidden = conversions.length === 0;
  if (container.hidden) return;

  const heading = document.createElement("h2");
  heading.textContent = "Two Thin Coats conversion";
  container.appendChild(heading);

  for (const c of conversions) {
    const card = document.createElement("div");
    card.className = "official-card";

    const title = document.createElement("b");
    title.textContent = c.twoThinCoats;
    const tone = document.createElement("small");
    tone.textContent = TONES[c.tone];
    const army = document.createElement("p");
    army.textContent = "Army Painter equivalent on the same chart: " + c.armyPainter;

    card.append(title, tone, army, reportLink({
      paint: `Two Thin Coats "${c.twoThinCoats}"`,
      context: `Official chart conversion for Citadel "${chosen.name}".`
    }, c.twoThinCoats));
    container.appendChild(card);
  }

  // Credit the chart, and pass on its own warning.
  const credit = document.createElement("p");
  credit.className = "official-credit";
  const link = document.createElement("a");
  link.href = chart.url;
  link.textContent = chart.title;
  credit.append(
    "From the ", link, ` (${chart.credit}). The chart notes that these are not exact matches ` +
    "between brands, so your model may look a little different."
  );
  container.appendChild(credit);
}
