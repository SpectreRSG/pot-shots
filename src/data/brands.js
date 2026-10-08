// The ONE list of brands the app loads. To add a brand, import its file
// and add it to the list. The order here is the order used to break ties.

import citadel from "./citadel.json";
import armyPainter from "./army-painter.json";
import vallejo from "./vallejo.json";
import akInteractive from "./ak-interactive.json";
import proAcryl from "./pro-acryl.json";
import scale75 from "./scale75.json";
import reaper from "./reaper.json";
import twoThinCoats from "./two-thin-coats.json";

export const BRANDS = [citadel, armyPainter, vallejo, akInteractive, proAcryl, scale75, reaper, twoThinCoats];

// The brand people pick from in the dropdown.
export const SOURCE_BRAND = "Citadel";

// Every paint from every brand in one flat list. Each paint also gets its
// brand name and whether it is sample (placeholder) data.
export const ALL_PAINTS = BRANDS.flatMap(file =>
  file.paints.map(paint => ({ ...paint, brand: file.brand, sample: file.sample }))
);
