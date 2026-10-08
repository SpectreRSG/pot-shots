// Tests for the data rules (scripts/lib/rules.mjs) and the finished data files.
import { describe, it, expect } from "vitest";
import { filterCatalog, filterTable, hasAnyWord, parseMarkdownTable, rgbToHex, sortByName } from "../scripts/lib/rules.mjs";
import { BRANDS, ALL_PAINTS } from "../src/data/brands.js";

describe("build rules", () => {
  const excludeRoles = ["contrast", "shade", "air"];

  it("keeps catalog paints with a wanted role and drops any with an excluded role", () => {
    const brand = { keepRoles: ["base", "layer", "metallic"] };
    const catalog = [
      { name: "Keep", usage_roles: ["layer"], rgb: { r: 1, g: 2, b: 3 } },
      { name: "Air version", usage_roles: ["layer", "air"], rgb: { r: 1, g: 2, b: 3 } },
      { name: "Shade", usage_roles: ["shade"], rgb: { r: 1, g: 2, b: 3 } }
    ];
    expect(filterCatalog(catalog, brand, excludeRoles).kept.map(p => p.name)).toEqual(["Keep"]);
  });

  it("marks metallics from the catalog role, the color family, or the override list", () => {
    const brand = { keepRoles: ["base", "layer", "metallic"] };
    const rgb = { r: 0, g: 0, b: 0 };
    const catalog = [
      { name: "By role", usage_roles: ["metallic"], rgb },
      { name: "By family", usage_roles: ["base"], color_families: ["metallic"], rgb },
      { name: "By list", usage_roles: ["base"], rgb },
      { name: "Plain", usage_roles: ["base"], rgb }
    ];
    const kept = filterCatalog(catalog, brand, excludeRoles, ["By list"]).kept;
    expect(kept.map(p => p.metallic)).toEqual([true, true, true, false]);
  });

  it("matches excluded words as whole words only", () => {
    expect(hasAnyWord("Black Ink", ["Ink"])).toBe(true);
    expect(hasAnyWord("Hot Pink", ["Ink"])).toBe(false);
  });

  it("reads Markdown tables, cleans spaces, and labels Artist Range copies", () => {
    const md = [
      "|Name|Set|R|G|B|",
      "|---|---|---|---|---|",
      "|White|Warfront  Range|255|255|255|",
      "|White|Artist Range|250|250|250|",
      "|Black Ink|Artist Range|0|0|0|",
      "|Splash|Instant Colors Range|9|9|9|"
    ].join("\n");
    const brand = {
      keepRanges: ["Warfront Range", "Artist Range"],
      excludeNameWords: ["Ink"],
      labelDuplicates: { range: "Artist Range", suffix: " (Artist)" }
    };
    const kept = filterTable(parseMarkdownTable(md), brand).kept;
    expect(kept.map(p => p.name)).toEqual(["White", "White (Artist)"]);
    expect(kept[1].hex).toBe("#fafafa");
  });

  it("writes hex in lowercase with two digits per channel", () => {
    expect(rgbToHex(1, 171, 255)).toBe("#01abff");
  });

  it("sorts A to Z ignoring capital letters", () => {
    expect(sortByName([{ name: "b" }, { name: "A" }, { name: "a" }]).map(p => p.name)).toEqual(["A", "a", "b"]);
  });
});

describe("data files", () => {
  it("has the 162 Citadel base and layer paints", () => {
    const citadel = ALL_PAINTS.filter(p => p.brand === "Citadel");
    expect(citadel).toHaveLength(162);
    expect(citadel.every(p => p.type === "base" || p.type === "layer")).toBe(true);
  });

  it("gives every paint a name, a valid hex code and a true/false metallic flag", () => {
    for (const p of ALL_PAINTS) {
      expect(p.name, p.brand).toBeTruthy();
      expect(p.hex, `${p.brand} ${p.name}`).toMatch(/^#[0-9a-f]{6}$/);
      expect(typeof p.metallic, `${p.brand} ${p.name}`).toBe("boolean");
    }
  });

  it("marks only Two Thin Coats as sample data", () => {
    expect(BRANDS.filter(b => b.sample).map(b => b.brand)).toEqual(["Two Thin Coats"]);
  });

  it("flags the hand-checked Citadel metallics", () => {
    const leadbelcher = ALL_PAINTS.find(p => p.brand === "Citadel" && p.name === "Leadbelcher");
    expect(leadbelcher.metallic).toBe(true);
  });
});
