// The filtering rules used by build-data.mjs.
// These are "pure" functions: data in, data out, no downloading or file writing.
// That keeps them easy to read and easy to test.

// Turn red/green/blue numbers (0-255) into a hex code like "#9a1115".
export function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(n => Number(n).toString(16).padStart(2, "0")).join("");
}

// Squash repeated spaces: "Warfront  Range" becomes "Warfront Range".
export function cleanSpaces(text) {
  return text.replace(/\s+/g, " ").trim();
}

// True if the name contains any of the words as a whole word.
// Whole words matter: "Ink" must not catch "Pink".
export function hasAnyWord(name, words = []) {
  return words.some(word => new RegExp(`\\b${word}\\b`, "i").test(name));
}

// Read a Markdown table (the |a|b|c| kind) into a list of objects,
// using the header row for the property names.
export function parseMarkdownTable(markdown) {
  const lines = markdown.split("\n").filter(line => line.startsWith("|"));
  const split = line => line.trim().replace(/^\||\|$/g, "").split("|").map(cell => cell.trim());
  const headers = split(lines[0]);
  // lines[1] is the |---|---| divider, so the rows start at lines[2].
  return lines.slice(2).map(line => {
    const cells = split(line);
    return Object.fromEntries(headers.map((h, i) => [h, cells[i]]));
  });
}

// Catalog sources (Citadel, Army Painter, Vallejo, AK Interactive).
// Each catalog paint looks like { name, usage_roles: [...], color_families: [...], rgb: {r,g,b} }.
export function filterCatalog(catalogPaints, brand, excludeRoles, metallicNames = []) {
  const kept = [];
  const dropped = [];
  for (const p of catalogPaints) {
    const roles = p.usage_roles || [];
    const families = p.color_families || [];
    const hasKeepRole = roles.some(r => brand.keepRoles.includes(r));
    const badRole = roles.find(r => excludeRoles.includes(r));
    if (!hasKeepRole || badRole) {
      dropped.push({ name: p.name, reason: badRole ? `role "${badRole}"` : `roles ${roles.join(", ") || "none"}` });
      continue;
    }
    kept.push({
      name: p.name,
      hex: rgbToHex(p.rgb.r, p.rgb.g, p.rgb.b),
      // Only Citadel's base/layer split is shown in the app.
      type: roles.includes("base") ? "base" : "layer",
      metallic: roles.includes("metallic") || families.includes("metallic") || metallicNames.includes(p.name)
    });
  }
  return { kept, dropped };
}

// Table sources (Pro Acryl, Scale75, Reaper).
// Each row looks like { Name, Set, R, G, B, ... }.
export function filterTable(rows, brand, metallicNames = []) {
  const kept = [];
  const dropped = [];
  for (const row of rows) {
    const name = cleanSpaces(row.Name || "");
    const range = cleanSpaces(row.Set || "");
    if (!name) continue;
    if (!brand.keepRanges.includes(range)) {
      dropped.push({ name, reason: `range "${range}"` });
      continue;
    }
    if (hasAnyWord(name, brand.excludeNameWords)) {
      dropped.push({ name, reason: "name word" });
      continue;
    }
    kept.push({ name, hex: rgbToHex(row.R, row.G, row.B), type: "layer", metallic: metallicNames.includes(name), range });
  }

  // Some brands repeat a name in two ranges. Label the copies from one range
  // (for Scale75: "White (Artist)") so people can tell them apart.
  if (brand.labelDuplicates) {
    const { range, suffix } = brand.labelDuplicates;
    const namesElsewhere = new Set(kept.filter(p => p.range !== range).map(p => p.name));
    for (const p of kept) {
      if (p.range === range && namesElsewhere.has(p.name)) p.name += suffix;
    }
  }

  // The range was only needed for the step above.
  return { kept: kept.map(({ range, ...paint }) => paint), dropped };
}

// Names that appear more than once in a brand (worth a look in the report).
export function findDuplicateNames(paints) {
  const seen = new Set();
  const dupes = new Set();
  for (const p of paints) (seen.has(p.name) ? dupes : seen).add(p.name);
  return [...dupes];
}

// Sort paints A to Z, ignoring capital letters, so the files are easy to scan.
// (Paints with the same name keep their original order.)
export function sortByName(paints) {
  const key = p => p.name.toLowerCase();
  return [...paints].sort((a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0));
}
