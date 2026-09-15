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

const WHITE = "#ffffff";
const ink = paths.find((p) => p.fill !== WHITE && p.subs.length > 5);
const gold = paths.find((p) => p.fill !== WHITE && p.subs.length <= 5);
if (!ink || !gold) throw new Error("Could not identify the ink and gold paths.");

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const page = await browser.newPage();
await page.setContent(`<svg id="s" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"></svg>`);

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

const inkParts = await measure(ink.subs, ink.fill);
const goldParts = await measure(gold.subs, gold.fill);
await browser.close();

/* The lockup stacks monogram, wordmark and rule, so a subpath's vertical
   position is enough to say which component it belongs to. */
const all = [...inkParts, ...goldParts];
const band = (p) => (p.y + p.h / 2 < 600 ? "monogram" : p.y + p.h / 2 < 700 ? "wordmark" : "rule");

const group = (name) => {
  const parts = all.filter((p) => band(p) === name);
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
