// Remember which brands are collapsed.
// "localStorage" is a small notebook the browser keeps for this site on this device.
// try/catch means: if the browser blocks it, carry on and just forget later.

const STORAGE_KEY = "potShots.collapsedBrands";

export function loadCollapsed() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
  } catch (e) {
    return new Set(); // storage blocked or empty: start with everything open
  }
}

export function saveCollapsed(collapsed) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...collapsed]));
  } catch (e) { /* storage blocked: nothing to do */ }
}
