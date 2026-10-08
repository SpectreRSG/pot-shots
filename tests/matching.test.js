// Tests for the matching rules. Run with: npm test
import { describe, it, expect } from "vitest";
import { findMatches, describe as label } from "../src/matching/findMatches.js";
import { METHODS } from "../src/matching/methods.js";

// A small made-up paint list, so each rule is easy to see.
const chosen = { brand: "Citadel", name: "Test Red", hex: "#800000", metallic: false };
const shiny = { brand: "Citadel", name: "Test Gold", hex: "#a57c3a", metallic: true };

const paints = [
  chosen,
  { brand: "Citadel", name: "Other Citadel Red", hex: "#800000", metallic: false },
  { brand: "Brand A", name: "A exact", hex: "#800000", metallic: false },
  { brand: "Brand A", name: "A near", hex: "#820000", metallic: false },
  { brand: "Brand A", name: "A third", hex: "#840000", metallic: false },
  { brand: "Brand A", name: "A metallic red", hex: "#800000", metallic: true },
  { brand: "Brand B", name: "B near", hex: "#860000", metallic: false },
  { brand: "Brand C", name: "C far", hex: "#0000ff", metallic: false },
  { brand: "Brand C", name: "C gold", hex: "#a57c3a", metallic: true }
];

const names = groups => groups.flatMap(g => g.matches.map(m => m.name));

describe("findMatches", () => {
  it("never matches paints from the chosen paint's own brand", () => {
    const groups = findMatches(chosen, paints, "lab");
    expect(groups.map(g => g.brand)).not.toContain("Citadel");
  });

  it("keeps regular paints away from metallics", () => {
    expect(names(findMatches(chosen, paints, "lab"))).not.toContain("A metallic red");
  });

  it("keeps metallics away from regular paints", () => {
    const matches = findMatches(shiny, paints, "lab").flatMap(g => g.matches);
    expect(matches.map(m => m.name)).toContain("C gold");
    expect(matches.every(m => m.metallic)).toBe(true);
  });

  it("hides obvious mismatches", () => {
    expect(names(findMatches(chosen, paints, "lab"))).not.toContain("C far");
    expect(names(findMatches(chosen, paints, "rgb"))).not.toContain("C far");
  });

  it("shows at most 2 per brand, best first", () => {
    const brandA = findMatches(chosen, paints, "lab").find(g => g.brand === "Brand A");
    expect(brandA.matches.map(m => m.name)).toEqual(["A exact", "A near"]);
  });

  it("orders brands by their single best match", () => {
    const groups = findMatches(chosen, paints, "lab");
    expect(groups.map(g => g.brand)).toEqual(["Brand A", "Brand B"]);
  });

  it("returns an empty list when nothing is close", () => {
    const lonely = { brand: "Citadel", name: "Odd", hex: "#00ffff", metallic: false };
    expect(findMatches(lonely, paints, "lab")).toEqual([]);
  });
});

describe("cutoffs", () => {
  it("uses the agreed numbers for each method", () => {
    expect(METHODS.lab).toMatchObject({ veryClose: 5, close: 10, max: 15 });
    expect(METHODS.rgb).toMatchObject({ veryClose: 25, close: 45, max: 60 });
  });

  it("keeps a paint exactly at the hide limit, and hides one just past it", () => {
    // Swap in a fake measure that returns the paint's made-up distance.
    const fake = { ...METHODS.lab, measure: (a, b) => Number(b) };
    METHODS.test = fake;
    const list = [
      { brand: "X", name: "at limit", hex: "15", metallic: false },
      { brand: "Y", name: "past limit", hex: "15.01", metallic: false }
    ];
    try {
      expect(names(findMatches(chosen, list, "test"))).toEqual(["at limit"]);
    } finally {
      delete METHODS.test;
    }
  });

  it("labels distances using CIELAB cutoffs", () => {
    expect(label(4.99, "lab")).toBe("Very close");
    expect(label(5, "lab")).toBe("Close");
    expect(label(9.99, "lab")).toBe("Close");
    expect(label(10, "lab")).toBe("Rough match");
  });

  it("labels distances using RGB cutoffs", () => {
    expect(label(24.9, "rgb")).toBe("Very close");
    expect(label(25, "rgb")).toBe("Close");
    expect(label(45, "rgb")).toBe("Rough match");
  });
});
