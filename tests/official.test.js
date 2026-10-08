// Tests for the Two Thin Coats conversion chart. Run with: npm test
import { describe, it, expect } from "vitest";
import { findConversions } from "../src/matching/officialConversions.js";
import chart from "../src/data/two-thin-coats-chart.json";
import citadel from "../src/data/citadel.json";

describe("findConversions", () => {
  it("finds the chart entry for a Citadel paint", () => {
    const [found] = findConversions("Mephiston Red", chart);
    expect(found).toMatchObject({ twoThinCoats: "Sanguine Scarlet", tone: "midtone", armyPainter: "Vampire Red" });
  });

  it("understands the chart's different spellings", () => {
    expect(findConversions("Evil Sunz Scarlet", chart)[0].twoThinCoats).toBe("Demon Red");
    expect(findConversions("Balthasar Gold", chart)[0].twoThinCoats).toBe("Spartan Bronze");
  });

  it("returns nothing for a paint that is not on the chart", () => {
    expect(findConversions("Khorne Red", chart)).toEqual([]);
  });

  it("returns nothing when the chart is switched off", () => {
    expect(findConversions("Mephiston Red", { ...chart, enabled: false })).toEqual([]);
  });
});

describe("chart data", () => {
  it("has the 54 base and layer conversions from the chart", () => {
    expect(chart.conversions).toHaveLength(54);
  });

  it("only uses the three tones", () => {
    for (const c of chart.conversions) expect(["shadow", "midtone", "highlight"]).toContain(c.tone);
  });

  it("names a Citadel paint that exists in our data for every entry", () => {
    const names = new Set(citadel.paints.map(p => p.name));
    for (const c of chart.conversions) {
      const fixed = chart.citadelNameFixes[c.citadel] || c.citadel;
      expect(names.has(fixed), `${c.twoThinCoats}: "${c.citadel}"`).toBe(true);
    }
  });
});
