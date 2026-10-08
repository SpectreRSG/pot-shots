// Tests for the Two Thin Coats conversion chart. Run with: npm test
import { describe, it, expect } from "vitest";
import { findConversions, addChartGroup } from "../src/matching/officialConversions.js";
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

describe("addChartGroup", () => {
  const mephiston = { brand: "Citadel", name: "Mephiston Red", hex: "#9a1c1c", metallic: false };
  const near = { brand: "Near", matches: [{ name: "n", distance: 1 }] };
  const far = { brand: "Far", matches: [{ name: "f", distance: 99 }] };

  it("adds Two Thin Coats as a normal brand group, ordered by its best match", () => {
    const groups = addChartGroup([near, far], mephiston, chart, "lab");
    expect(groups.map(g => g.brand)).toEqual(["Near", "Two Thin Coats", "Far"]);
    const ttc = groups[1];
    expect(ttc.matches).toHaveLength(1);
    expect(ttc.matches[0]).toMatchObject({ brand: "Two Thin Coats", name: "Sanguine Scarlet" });
    expect(ttc.chart).toBe(chart); // so the section can credit the chart
  });

  it("leaves the groups alone when the paint is not on the chart", () => {
    const khorne = { ...mephiston, name: "Khorne Red" };
    expect(addChartGroup([near], khorne, chart, "lab")).toEqual([near]);
  });
});

describe("chart data", () => {
  it("gives every entry a valid hex color", () => {
    for (const c of chart.conversions) expect(c.hex, c.twoThinCoats).toMatch(/^#[0-9a-f]{6}$/);
  });

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
