// Tests for the paint search box. Run with: npm test
import { describe, it, expect } from "vitest";
import { nameMatches } from "../src/search.js";

describe("nameMatches", () => {
  it("finds a name from any part of it, ignoring capital letters", () => {
    expect(nameMatches("Mephiston Red", "meph")).toBe(true);
    expect(nameMatches("Mephiston Red", "RED")).toBe(true);
    expect(nameMatches("Macragge Blue", "red")).toBe(false);
  });

  it("works letter by letter", () => {
    for (const typed of ["l", "le", "lea", "lead", "leadb"]) {
      expect(nameMatches("Leadbelcher", typed)).toBe(true);
    }
  });

  it("ignores apostrophes, dashes and extra spaces", () => {
    expect(nameMatches("Bugman's Glow", "bugmans")).toBe(true);
    expect(nameMatches("Barak-Nar Burgundy", "baraknar")).toBe(true);
    expect(nameMatches("Mephiston Red", "  mephiston   red ")).toBe(true);
  });

  it("matches everything when nothing is typed", () => {
    expect(nameMatches("Abaddon Black", "")).toBe(true);
  });
});
