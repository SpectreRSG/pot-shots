// Rebuilds the paint files in src/data/ from the two open-source paint repos.
// Run it with:  npm run build-data
//
// What it does:
// 1. Downloads each brand's source file at the exact commit in rules/sources.json.
// 2. Keeps or drops paints using rules/brands.json.
// 3. Marks metallics using the catalog plus rules/metallics.json.
// 4. Writes one JSON file per brand and prints a short report to check.
//
// Two Thin Coats is NOT touched: src/data/two-thin-coats-chart.json is typed by hand.

import { readFile, writeFile } from "node:fs/promises";
import { filterCatalog, filterTable, parseMarkdownTable, findDuplicateNames, sortByName } from "./lib/rules.mjs";

const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));

const sources = await readJson("./rules/sources.json");
const rules = await readJson("./rules/brands.json");
const metallics = await readJson("./rules/metallics.json");

// Download one file from GitHub at a fixed commit.
async function download(source, path) {
  const url = `https://raw.githubusercontent.com/${source.repo}/${source.commit}/${path}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed (${response.status}): ${url}`);
  return response.text();
}

const report = [];
const unusedMetallics = [];

for (const brand of rules.brands) {
  const source = sources[brand.source];
  const text = await download(source, brand.path);
  const metallicNames = metallics[brand.id] || [];

  const { kept, dropped } = brand.path.endsWith(".json")
    ? filterCatalog(JSON.parse(text).paints, brand, rules.excludeRoles, metallicNames)
    : filterTable(parseMarkdownTable(text), brand, metallicNames);

  // A metallic name that matches no paint is probably a typo.
  for (const name of metallicNames) {
    if (!kept.some(p => p.name === name)) unusedMetallics.push(`${brand.name}: ${name}`);
  }

  const file = {
    brand: brand.name,
    sample: false,
    source: { title: source.title, repo: source.repo, commit: source.commit, license: source.license },
    paints: sortByName(kept)
  };
  await writeFile(new URL(`../src/data/${brand.id}.json`, import.meta.url), JSON.stringify(file, null, 2) + "\n");

  report.push({
    brand: brand.name,
    kept: kept.length,
    metallic: kept.filter(p => p.metallic).length,
    dropped: dropped.length,
    duplicates: findDuplicateNames(kept).join(", ") || "-"
  });
}

console.log("\nPaint data rebuilt. Check these numbers before saving:\n");
console.table(report);
if (unusedMetallics.length) {
  console.log("\nThese names in metallics.json matched no paint (typo?):");
  unusedMetallics.forEach(line => console.log("  " + line));
}
console.log("\nThe Two Thin Coats chart was not changed (it is typed by hand).\n");
