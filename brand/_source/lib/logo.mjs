/**
 * The logo, built from the designer's own vector artwork.
 *
 * brand/_source/logo/mmako-logo.svg is the authoritative source. Its paths are
 * split into monogram, wordmark and rule by logo/extract.mjs, which writes the
 * generated logo-paths.mjs that this module reads.
 *
 * Because the wordmark is real outlines rather than set type, every SVG this
 * module produces is font-independent — it renders identically everywhere, with
 * nothing to install.
 */
import { monogram, wordmark, rule, SOURCE_COLOURS } from "./logo-paths.mjs";

export { SOURCE_COLOURS };

/** Monogram dimensions, from the artwork. */
export const MONO = { width: monogram.box.w, height: monogram.box.h };

export const WORDMARK = "MMAKO LAW";

/**
 * Lockup proportions measured off the artwork, expressed relative to the
 * monogram so any part can be reconstructed at any size.
 */
export const LOCKUP = {
  wordmarkWidth: wordmark.box.w / monogram.box.w,
  wordmarkSize: wordmark.box.h / monogram.box.h,
  wordmarkGap: (wordmark.box.y - (monogram.box.y + monogram.box.h)) / monogram.box.h,
  ruleWidth: rule.box.w / monogram.box.w,
  ruleGap: (rule.box.y - (wordmark.box.y + wordmark.box.h)) / monogram.box.h,
};

/**
 * Resolves a part's fill for the requested colourway.
 * "colour" keeps ink and gold distinct; the one-colour modes flatten both.
 */
function fillFor(part, mode, { ink, gold }) {
  if (mode === "black") return "#000000";
  if (mode === "white") return "#FFFFFF";
  return part.fill === SOURCE_COLOURS.gold ? gold : ink;
}

/**
 * Emits one <path> per source colour, with that colour's subpaths concatenated.
 *
 * This grouping matters twice over. Within a colour, the even-odd rule is what
 * makes a letter's counter a hole rather than a filled blob — splitting those
 * subpaths apart fills the middle of every O and A. Across colours, keeping ink
 * and gold as separate elements means that where the gold accent overlaps the
 * letterform, the one-colour variants stay solid instead of punching a hole.
 */
const render = (parts, mode, palette) => {
  const groups = new Map();
  for (const part of parts) {
    if (!groups.has(part.fill)) groups.set(part.fill, []);
    groups.get(part.fill).push(part.d);
  }
  /* Ink first, gold over it, matching the artwork's own stacking order. */
  const ordered = [...groups].sort(([f]) => (f === SOURCE_COLOURS.gold ? 1 : -1));
  return ordered
    .map(([fill, ds]) =>
      `  <path d="${ds.join(" ")}" fill="${fillFor({ fill }, mode, palette)}" fill-rule="evenodd"` +
      /* The artwork strokes each shape in its own fill colour at 0.25 units,
         which thickens it very slightly. Preserved so output matches the
         supplied file exactly rather than approximately. */
      ` stroke="${fillFor({ fill }, mode, palette)}" stroke-width="0.25" stroke-linejoin="round"/>`)
    .join("\n");
};

const defaults = { ink: SOURCE_COLOURS.ink, gold: SOURCE_COLOURS.gold };

/** Wraps parts in an SVG whose viewBox is cropped to the given box. */
function wrap(parts, box, mode, palette, label, pad = 0) {
  const w = box.w + pad * 2;
  const h = box.h + pad * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${(box.x - pad).toFixed(3)} ${(box.y - pad).toFixed(3)} ${w.toFixed(3)} ${h.toFixed(3)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" role="img" aria-label="${label}">
${render(parts, mode, palette)}
</svg>
`;
}

/** The monogram alone. */
export function monogramSvg(mode = "colour", palette = {}) {
  return wrap(monogram.parts, monogram.box, mode, { ...defaults, ...palette },
    "Mmako Inc. monogram");
}

/** The wordmark alone. */
export function wordmarkSvg(mode = "colour", palette = {}) {
  return wrap(wordmark.parts, wordmark.box, mode, { ...defaults, ...palette },
    "Mmako Law wordmark");
}

/** The full stacked lockup exactly as supplied: monogram, wordmark, rule. */
export function lockupSvg(mode = "colour", palette = {}) {
  const parts = [...monogram.parts, ...wordmark.parts, ...rule.parts];
  const x0 = Math.min(monogram.box.x, wordmark.box.x, rule.box.x);
  const x1 = Math.max(monogram.box.x + monogram.box.w, wordmark.box.x + wordmark.box.w,
    rule.box.x + rule.box.w);
  const y0 = monogram.box.y;
  const y1 = rule.box.y + rule.box.h;
  return wrap(parts, { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }, mode,
    { ...defaults, ...palette }, "Mmako Law logo");
}

/**
 * Horizontal lockup — monogram beside the wordmark, for headers and any band
 * too short for the stacked version. Composed from the same artwork.
 */
export function horizontalSvg(mode = "colour", palette = {}) {
  const p = { ...defaults, ...palette };
  const m = monogram.box;
  const w = wordmark.box;

  /* The wordmark is a wide, widely-tracked 8-letter word, so it cannot be scaled
     up much before the lockup grows too long for a header. 0.21 of the
     monogram's height is the point where it still reads at ~38px tall while the
     whole mark stays around 4:1. */
  const scale = (m.h * 0.21) / w.h;
  const gap = m.h * 0.22;
  const tx = m.w + gap;
  const ty = (m.h - w.h * scale) / 2;
  const boxW = tx + w.w * scale;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${boxW.toFixed(3)} ${m.h.toFixed(3)}" width="${boxW.toFixed(0)}" height="${m.h.toFixed(0)}" role="img" aria-label="Mmako Law logo">
  <g transform="translate(${(-m.x).toFixed(3)} ${(-m.y).toFixed(3)})">
${render(monogram.parts, mode, p)}
  </g>
  <g transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${scale.toFixed(5)}) translate(${(-w.x).toFixed(3)} ${(-w.y).toFixed(3)})">
${render(wordmark.parts, mode, p)}
  </g>
</svg>
`;
}

/** Inline markup for embedding a component inside a larger SVG. */
export function inlineSvg(svg) {
  return svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
}
