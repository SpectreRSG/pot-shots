// Fill the dropdown with the source brand's paints, Base and Layer in their own groups.
// Each option's value is the paint's position in the "paints" list, so it stays
// the same however the list is filtered.

import { nameMatches } from "../search.js";

const GROUPS = [["base", "Base paints"], ["layer", "Layer paints"]];

// Rebuild the dropdown with only the paints whose name matches the search.
// Returns how many paints are shown.
export function fillSourcePicker(select, paints, query = "") {
  select.replaceChildren();
  let shown = 0;
  for (const [type, label] of GROUPS) {
    const group = document.createElement("optgroup");
    group.label = label;
    paints.forEach((paint, index) => {
      if (paint.type !== type || !nameMatches(paint.name, query)) return;
      const option = document.createElement("option");
      option.value = index;
      option.textContent = paint.name;
      group.appendChild(option);
      shown++;
    });
    // Skip a group with nothing in it, so the list doesn't show empty headings.
    if (group.children.length) select.appendChild(group);
  }
  return shown;
}
