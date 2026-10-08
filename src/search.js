// Search paints by name as the user types.

// Make names easy to compare: lowercase, and ignore apostrophes, dashes and
// extra spaces, so "bugmans", "Bugman's" and "bugman s" all find Bugman's Glow.
export function simplify(text) {
  return text.toLowerCase().replace(/['’`-]/g, "").replace(/\s+/g, " ").trim();
}

// True if the paint name contains what was typed, anywhere in the name.
// An empty search matches every paint.
export function nameMatches(name, query) {
  return simplify(name).includes(simplify(query));
}
