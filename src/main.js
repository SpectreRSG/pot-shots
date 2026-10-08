// Starts the app: loads the paints, connects the controls, draws the results.

import "./styles.css";
import { ALL_PAINTS, SOURCE_BRAND } from "./data/brands.js";
import { findMatches } from "./matching/findMatches.js";
import { DEFAULT_METHOD } from "./matching/methods.js";
import { loadCollapsed } from "./storage.js";
import { fillSourcePicker } from "./ui/sourcePicker.js";
import { renderResults } from "./ui/results.js";
import { reportLink } from "./ui/reportLink.js";
import { addChartGroup } from "./matching/officialConversions.js";
import ttcChart from "./data/two-thin-coats-chart.json";

const picker = document.getElementById("paint-picker");
const chosenBox = document.getElementById("chosen");
const chosenHex = document.getElementById("chosen-hex");
const chosenReport = document.getElementById("chosen-report");
const resultsBox = document.getElementById("results");

const sourcePaints = ALL_PAINTS.filter(p => p.brand === SOURCE_BRAND);
const collapsed = loadCollapsed();
let methodKey = DEFAULT_METHOD;   // the page starts with CIELAB

function showResults() {
  const chosen = sourcePaints[picker.value];

  // Paint the big swatch, plus a report link for the Citadel color itself.
  chosenBox.style.background = chosen.hex;
  chosenHex.textContent = chosen.name + " · " + chosen.hex;
  chosenReport.replaceChildren(reportLink({
    paint: `Citadel "${chosen.name}" (${chosen.hex})`,
    context: "The Citadel color itself."
  }, chosen.name));

  // Color matches, plus the Two Thin Coats chart's pick when the chart lists this paint.
  const groups = addChartGroup(findMatches(chosen, ALL_PAINTS, methodKey), chosen, ttcChart, methodKey);
  renderResults(resultsBox, { chosen, groups, methodKey, collapsed });
}

fillSourcePicker(picker, sourcePaints);

// Run showResults every time the dropdown changes, and once at the start.
picker.addEventListener("change", showResults);

// When the user picks a different method, remember it and refresh the results.
document.querySelectorAll('input[name="method"]').forEach(radio => {
  radio.addEventListener("change", () => {
    methodKey = radio.value;
    showResults();
  });
});

showResults();
