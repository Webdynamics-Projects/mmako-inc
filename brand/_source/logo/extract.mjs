/**
 * Reads the supplied artwork and writes lib/logo-paths.mjs — the real path data,
 * split into monogram, wordmark and rule, with exact bounds.
 *
 *   CHROMIUM_PATH=... node brand/_source/logo/extract.mjs
 *
 * Bounds come from the browser's own getBBox() rather than hand-rolled Bézier
 * maths, so they are exact. The generated module is committed, which keeps the
 * rest of the kit free of any browser dependency at build time.
 *
 * Only re-run this if mmako-logo.svg is replaced.
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const SRC = path.join("brand", "_source", "logo", "mmako-logo.svg");
const OUT = path.join("brand", "_source", "lib", "logo-paths.mjs");

const svg = fs.readFileSync(SRC, "utf8");

/** Splits one path's `d` attribute into its subpaths. */
const splitSubpaths = (d) =>
  d.trim().split(/(?=M)/).map((s) => s.trim()).filter(Boolean);

const paths = [...svg.matchAll(/<path d="([^"]+)"[^>]*fill="(#[0-9a-fA-F]+)"/g)]
  .map(([, d, fill]) => ({ fill: fill.toLowerCase(), subs: splitSubpaths(d) }));

if (paths.length < 2) throw new Error("Expected at least an ink path and a gold path.");

const viewBox = svg.match(/viewBox="([\d.\- ]+)"/)[1].split(/\s+/).map(Number);

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const page = await browser.newPage();
await page.setContent(`<svg id="s" xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox.join(" ")}"></svg>`);

/** Perceived lightness, 0–1. Used to spot the near-white backing shape. */
function lightness(hex) {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Exact bounds of a subpath, measured by the browser. */
const bbox = async (d) => page.evaluate((dd) => {
  const svgEl = document.getElementById("s");
  const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
  el.setAttribute("d", dd);
  svgEl.appendChild(el);
  const b = el.getBBox();
  el.remove();
  return { x: b.x, y: b.y, w: b.width, h: b.height };
}, d);

const measure = async (subs, fill) => {
  const out = [];
  for (const d of subs) out.push({ d, fill, ...(await bbox(d)) });
  return out;
};

/*
 * Identify the three roles without relying on a specific hex.
 *
 * Exports of this logo carry a backing shape the size of the whole canvas with
 * the artwork punched out of it by the even-odd rule. It is near-white, but the
 * exact value varies between exports (#ffffff in one, #fefefe in another), so
 * it is found by geometry and lightness instead: the path that covers almost
 * the entire viewBox and is very light. Of what remains, the letterform carries
 * far more subpaths than the accent.
 */
const canvasArea = viewBox[2] * viewBox[3];
const measured = [];
for (const p of paths) {
  const first = await bbox(p.subs[0]);
  measured.push({ ...p, coverage: (first.w * first.h) / canvasArea, light: lightness(p.fill) });
}

const artwork = measured.filter((p) => !(p.coverage > 0.9 && p.light > 0.85));
if (artwork.length < 2) {
  throw new Error(
    `Expected two artwork paths after dropping the background; found ${artwork.length}. ` +
    `Fills seen: ${measured.map((p) => `${p.fill} (coverage ${p.coverage.toFixed(2)}, lightness ${p.light.toFixed(2)})`).join(", ")}`,
  );
}

const byDetail = [...artwork].sort((a, b) => b.subs.length - a.subs.length);
const ink = byDetail[0];
const gold = byDetail[byDetail.length - 1];
if (ink === gold) throw new Error("Could not separate the ink path from the gold path.");

const dropped = measured.filter((p) => !artwork.includes(p));
if (dropped.length) {
  console.log(`  background dropped: ${dropped.map((p) => p.fill).join(", ")}`);
}

const inkParts = await measure(ink.subs, ink.fill);
const goldParts = await measure(gold.subs, gold.fill);
await browser.close();

/*
 * Split the lockup into its three components.
 *
 * The monogram is separated from the type below it by the largest vertical gap
 * in the artwork, which is found rather than assumed — hard-coding a y value
 * breaks the moment the canvas or the spacing changes. Below that boundary the
 * two remaining components are told apart by colour, not position: the wordmark
 * is ink and the rule is gold. Position alone is not enough, because a full
 * stop at the end of the wordmark sits lower than the letters and would
 * otherwise be swept in with the rule.
 */
const all = [...inkParts, ...goldParts];

const centres = all.map((p) => p.y + p.h / 2).sort((a, b) => a - b);
let boundary = centres[0];
let widest = 0;
for (let i = 1; i < centres.length; i++) {
  const gap = centres[i] - centres[i - 1];
  if (gap > widest) {
    widest = gap;
    boundary = (centres[i] + centres[i - 1]) / 2;
  }
}
console.log(`  monogram/type boundary at y ${boundary.toFixed(1)} (gap of ${widest.toFixed(1)})`);

const band = (p) => {
  if (p.y + p.h / 2 < boundary) return "monogram";
  return p.fill === gold.fill ? "rule" : "wordmark";
};

const group = (name) => {
  const parts = all.filter((p) => band(p) === name);
  if (!parts.length) throw new Error(`No paths landed in the "${name}" group.`);
  const x0 = Math.min(...parts.map((p) => p.x));
  const y0 = Math.min(...parts.map((p) => p.y));
  const x1 = Math.max(...parts.map((p) => p.x + p.w));
  const y1 = Math.max(...parts.map((p) => p.y + p.h));
  return { parts, box: { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } };
};

const monogram = group("monogram");
const wordmark = group("wordmark");
const rule = group("rule");

const r = (n) => Number(n.toFixed(3));
const serialise = (g) => `{
  box: { x: ${r(g.box.x)}, y: ${r(g.box.y)}, w: ${r(g.box.w)}, h: ${r(g.box.h)} },
  parts: [
${g.parts.map((p) => `    { fill: ${JSON.stringify(p.fill)}, d: ${JSON.stringify(p.d)} },`).join("\n")}
  ],
}`;

fs.writeFileSync(OUT, `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Produced by brand/_source/logo/extract.mjs from the supplied artwork at
 * brand/_source/logo/mmako-logo.svg. Re-run that script if the artwork changes.
 *
 * These are the designer's own vector paths, split into the lockup's three
 * components and measured with the browser's getBBox(). The wordmark is real
 * outlines, not set type, so every SVG the kit exports is font-independent.
 */

/** The artwork's own colours, as supplied. */
export const SOURCE_COLOURS = {
  ink: ${JSON.stringify(ink.fill)},
  gold: ${JSON.stringify(gold.fill)},
};

export const monogram = ${serialise(monogram)};

export const wordmark = ${serialise(wordmark)};

export const rule = ${serialise(rule)};
`);

console.log("Extracted from", SRC);
console.log("  ink colour :", ink.fill);
console.log("  gold colour:", gold.fill);
for (const [name, g] of [["monogram", monogram], ["wordmark", wordmark], ["rule", rule]]) {
  const b = g.box;
  console.log(`  ${name.padEnd(9)} ${g.parts.length} paths  ` +
    `x ${r(b.x)} y ${r(b.y)}  ${r(b.w)} × ${r(b.h)}  ratio ${r(b.w / b.h)}`);
}
console.log("\nLockup proportions (÷ monogram):");
console.log("  wordmark width  :", r(wordmark.box.w / monogram.box.w));
console.log("  wordmark size   :", r(wordmark.box.h / monogram.box.h));
console.log("  gap to wordmark :", r((wordmark.box.y - (monogram.box.y + monogram.box.h)) / monogram.box.h));
console.log("  rule width      :", r(rule.box.w / monogram.box.w));
console.log("  gap to rule     :", r((rule.box.y - (wordmark.box.y + wordmark.box.h)) / monogram.box.h));
console.log("→", OUT);
