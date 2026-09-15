/**
 * Logo geometry.
 *
 * The monogram is pure path data, so it exports as a genuinely portable SVG
 * with no font dependency. The wordmark is set type — those lockups render
 * exactly to PNG, and their SVG form carries a font dependency that is noted
 * in the kit's README.
 */

/*
 * Monogram paths, traced from the supplied artwork.
 *
 * The letterform is a high-contrast Didone M: thin stems with fine bracketed
 * serifs, one thick left diagonal and one hairline right diagonal meeting at a
 * vertex just above the baseline. Proportions follow the source — 250 × 200,
 * a ratio of 1.25.
 */
export const MONO = { width: 250, height: 200 };

export const monogramPaths = {
  /* The gold accent: a slender tapered slash running at the diagonal's own
     angle (0.49 horizontal per unit of descent), parallel to the thick diagonal and
     just left of it, its top corner tucked behind the letterform and its foot
     cut on a slight angle at the baseline. */
  accent: "M 43 96 L 71 96 L 114 196 L 96 204 Z",
  /* The letterform. Drawn as overlapping parts rather than one outline, which
     keeps each stroke's weight independently adjustable. */
  letter: [
    /* left stem, then its top and foot serifs */
    "M 18 0 L 32 0 L 32 194 L 18 194 Z",
    "M 4 0 L 46 0 L 46 6 L 4 6 Z",
    "M 0 188 L 50 188 L 50 200 L 0 200 Z",
    /* thick left diagonal, top-left down to the vertex */
    "M 18 0 L 58 0 L 144 196 L 114 196 Z",
    /* hairline right diagonal, vertex up to the top right */
    "M 214 0 L 226 0 L 142 196 L 130 196 Z",
    /* right stem, then its top and foot serifs */
    "M 212 0 L 230 0 L 230 194 L 212 194 Z",
    "M 200 0 L 244 0 L 244 6 L 200 6 Z",
    "M 196 188 L 250 188 L 250 200 L 196 200 Z",
  ],
};

/** Lockup metrics, expressed as a share of the monogram, taken from the source. */
export const LOCKUP = {
  wordmarkSize: 0.200,   // font-size ÷ monogram height
  wordmarkGap: 0.205,    // space under the monogram ÷ monogram height
  tracking: 0.44,        // em
  ruleWidth: 0.41,       // ÷ monogram width
  ruleGap: 0.10,         // space under the wordmark ÷ monogram height
};

/**
 * Returns the monogram as a standalone SVG string.
 * `mode` is "colour" (charcoal + gold), "black" or "white" — the one-colour
 * versions flatten the accent into the same ink as the letterform.
 */
export function monogramSvg(mode = "colour", { ink = "#0B0B0C", gold = "#C9A227" } = {}) {
  const letterFill = mode === "white" ? "#FFFFFF" : mode === "black" ? "#000000" : ink;
  const accentFill =
    mode === "white" ? "#FFFFFF" : mode === "black" ? "#000000" : gold;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MONO.width} ${MONO.height}" width="${MONO.width}" height="${MONO.height}" role="img" aria-label="Mmako Inc. monogram">
  <path d="${monogramPaths.accent}" fill="${accentFill}"/>
  <g fill="${letterFill}">
${monogramPaths.letter.map((d) => `    <path d="${d}"/>`).join("\n")}
  </g>
</svg>
`;
}

/** Inline monogram markup for embedding inside a larger SVG or HTML page. */
export function monogramMarkup(mode, palette, scale = 1, x = 0, y = 0) {
  const inner = monogramSvg(mode, palette)
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "");
  return `<g transform="translate(${x} ${y}) scale(${scale})">${inner}</g>`;
}

export const WORDMARK = "MMAKO LAW";
