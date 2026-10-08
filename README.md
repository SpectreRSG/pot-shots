# Pot Shots

Pick a Citadel base or layer paint and see the closest colors from other miniature paint brands:
Army Painter, Vallejo, AK Interactive, Pro Acryl, Scale75, Reaper, and Two Thin Coats (sample data for now).

> **Colors are approximate.** Every hex code is a screen color, not a measurement of real paint.
> Paint looks different in person, on different screens, and wet vs. dry. Treat matches as a good
> starting guess and test before you buy.

Pot Shots is an independent fan project. It is not affiliated with or endorsed by Games Workshop
or any paint brand. Citadel and all paint names are trademarks of their owners.

## Run it on your computer

You need [Node.js](https://nodejs.org) 22 or newer.

```bash
npm install          # download the tools (first time only)
npm run dev          # start a local preview, then open the link it prints
npm test             # run the tests
npm run build        # make the publishable site in dist/
```

## How it works

| Folder | What's in it |
|---|---|
| `index.html` | The page structure. |
| `src/main.js` | Starts the app and connects the pieces. |
| `src/color/` | Color math: hex to RGB to CIELAB, and the two distance measures. |
| `src/matching/` | The matching rules and the cutoffs for each method. |
| `src/ui/` | Drawing the dropdown, the results, and the "Report a problem" links. |
| `src/data/` | One JSON file per brand, plus `brands.js`, the list the app loads. |
| `scripts/` | `build-data.mjs` rebuilds `src/data/` from the source repos, using the rules in `scripts/rules/`. |
| `tests/` | Tests for the color math, the matching rules, and the data. |

**Matching, in short:** for the chosen Citadel paint, measure the distance to every paint from the
other brands. Metallics only match metallics. Anything past the hide limit is dropped. Each brand
shows its best 2, and brands are ordered by their best match.

| Method | Very close | Close | Hidden above |
|---|---|---|---|
| CIELAB (Delta E 76, default) | under 5 | under 10 | 15 |
| RGB distance | under 25 | under 45 | 60 |

## Rebuilding the paint data

```bash
npm run build-data
```

This downloads the source files at the exact commits in `scripts/rules/sources.json`, applies the rules,
rewrites the files in `src/data/`, and prints a table of counts. Check the table, run `npm test`, then
look at the changes in git before committing.

The rules live in plain JSON files, so you can read and change them without touching code:

- `scripts/rules/brands.json`: which roles (catalog sources) or ranges and name words (table sources) are kept.
- `scripts/rules/metallics.json`: paints that are metallic even though the source doesn't say so.
- `scripts/rules/sources.json`: which repo and commit each source comes from.

What's excluded: contrast, shade, wash, technical, dry, speedpaint, air and ink paints; primers,
fluorescents, transparents and mediums; Scale75 Instant Colors, Soil Works, FX and Inktensity ranges.
Scale75 Artist Range paints that share a name with another range get " (Artist)" added.

### Add a new brand

1. Add the brand to `scripts/rules/brands.json`. Copy a brand that uses the same source and change the
   `id`, `name`, `path` and keep rules. If the source has no metallic marker, list its metallics in
   `scripts/rules/metallics.json` under the same `id`.
2. Run `npm run build-data` and check the brand's counts in the table.
3. Import the new `src/data/<id>.json` in `src/data/brands.js` and add it to the `BRANDS` list.
4. Run `npm test` and `npm run dev` to check it.

A brand from a different source needs a new filter in `scripts/lib/rules.mjs`. Only use data that
has an open license, and credit it below and in `THIRD_PARTY_NOTICES.md`.

## Reporting a wrong color

Every paint in the app has a "Report a problem" link. It opens a GitHub issue form
(`.github/ISSUE_TEMPLATE/paint-correction.yml`) with the paint and context already filled in.
Reporters need a free GitHub account. GitHub handles sign-in and spam, so the site has no server,
passwords or database to protect. Reports arrive with the `data-correction` label.

## Publishing

The site is hosted on Netlify, which watches this repository. Every push to `main` runs
`npm test && npm run build` (set in `netlify.toml`). If a test fails, the live site stays as it was.

## Data sources and licenses

| Brands | Source | License |
|---|---|---|
| Citadel, Army Painter, Vallejo, AK Interactive | [Minipainter catalog](https://github.com/ArturSkowronski/minipainter) by Artur Skowronski | MIT |
| Pro Acryl (Monument), Scale75, Reaper | [miniature-paints](https://github.com/Arcturus5404/miniature-paints) by Rick Fleuren | MIT |
| Two Thin Coats | Hand-made **placeholders**, marked "sample data" in the app | n/a |

Full license texts are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

**Two Thin Coats:** the real paint data has no open license. Permission has been requested from the
Duncan Rhodes Painting Academy. Until permission or a verified, openly licensed source arrives, the
8 entries in `src/data/two-thin-coats.json` stay as clearly marked placeholders.

The code license for Pot Shots itself hasn't been chosen yet.

## Ideas for later

- **Search box:** type a paint name instead of scrolling the dropdown.
- **CIEDE2000:** a third, more accurate method. Published test values make it easy to verify.
- **Paints I own:** save a list on the device and highlight matches you already have.
- **Filter by type:** base, layer or metallic.
