// A section with a heading you can tap to open or close it.
// Which sections are closed is kept in the "collapsed" Set and saved on the
// device, so the choice sticks across searches and visits.

import { saveCollapsed } from "../storage.js";

// tag       = heading level, like "h2" or "h3"
// key       = the name saved in storage (a brand name, for example)
// label     = the text shown on the heading
// count     = optional number shown in brackets after the label
// collapsed = the shared Set of closed sections
// Returns the heading and the body; put the section's content in the body.
export function collapsibleSection({ tag, key, label, count, collapsed }) {
  const heading = document.createElement(tag);
  heading.className = "brand-head";
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "brand-toggle";
  const chev = document.createElement("span");
  chev.className = "chev";
  chev.setAttribute("aria-hidden", "true");
  const name = document.createElement("span");
  name.textContent = label;
  toggle.append(chev, name);
  if (count !== undefined) {
    const countText = document.createElement("span");
    countText.className = "count";
    countText.textContent = "(" + count + ")";
    toggle.append(countText);
  }
  heading.appendChild(toggle);

  const body = document.createElement("div");
  body.className = "brand-body";

  // Show the section open or closed, based on what we remembered.
  const applyState = () => {
    const isCollapsed = collapsed.has(key);
    body.hidden = isCollapsed;
    toggle.setAttribute("aria-expanded", String(!isCollapsed));
    chev.textContent = isCollapsed ? "▸" : "▾";
  };
  applyState();

  toggle.addEventListener("click", () => {
    if (collapsed.has(key)) collapsed.delete(key);
    else collapsed.add(key);
    saveCollapsed(collapsed);
    applyState();
  });

  return { heading, body };
}
