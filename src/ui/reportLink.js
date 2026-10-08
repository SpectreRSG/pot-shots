// "Report a problem" links.
// Each link opens a new GitHub issue with the paint details already filled in.
// The person signs in to GitHub to send it, so GitHub (not this site) handles
// accounts, passwords and spam bots. This site never sees any of it.

// The GitHub repository that receives the reports ("owner/name").
export const REPO = "SpectreRSG/pot-shots";

// Build the link. "paint" and "context" match field ids in
// .github/ISSUE_TEMPLATE/paint-correction.yml, so GitHub pre-fills them.
export function buildReportUrl({ paint, context }) {
  const params = new URLSearchParams({
    template: "paint-correction.yml",
    title: `Color problem: ${paint}`,
    paint,
    context
  });
  return `https://github.com/${REPO}/issues/new?${params}`;
}

// Make the link element. It opens in a new tab so the person keeps their place.
export function reportLink(details, paintName) {
  const link = document.createElement("a");
  link.className = "report-link";
  link.href = buildReportUrl(details);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Report a problem";
  // Screen readers hear which paint the link is about.
  link.setAttribute("aria-label", `Report a problem with ${paintName} (opens GitHub in a new tab)`);
  return link;
}
