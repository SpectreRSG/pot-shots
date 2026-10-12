// The ONE list of brands the app loads. To add a brand, import its file
// and add it to the list. The order here is the order used to break ties.

import citadel from "./citadel.json";
import armyPainter from "./army-painter.json";
import vallejo from "./vallejo.json";
import akInteractive from "./ak-interactive.json";
import proAcryl from "./pro-acryl.json";
import scale75 from "./scale75.json";
import reaper from "./reaper.json";
import toneProWaiting from "./warhammer-tone-pro.json";

export const BRANDS = [citadel, armyPainter, vallejo, akInteractive, proAcryl, scale75, reaper, toneProWaiting];

// The brand people pick from in the dropdown.
export const SOURCE_BRAND = "Citadel";

// Every paint from every brand in one flat list. Each paint also gets its
// brand name and whether it is sample (placeholder) data.
// (Two Thin Coats is not here: it has no color data, only the conversion
// chart in two-thin-coats-chart.json.)
// Paints with no color yet (hex is null) are skipped, so a brand that is
// still waiting for color data stays hidden.
export const ALL_PAINTS = BRANDS.flatMap(file =>
  file.paints
    .filter(paint => paint.hex)
    .map(paint => ({ ...paint, brand: file.brand, sample: file.sample }))
);
