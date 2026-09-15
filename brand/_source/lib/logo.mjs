/**
 * Logo geometry.
 *
 * The monogram is pure path data, so it exports as a genuinely portable SVG
 * with no font dependency. The wordmark is set type — those lockups render
 * exactly to PNG, and their SVG form carries a font dependency that is noted
 * in the kit's README.
 */

/* Monogram paths in a 380 × 276 box, taken from the logo artwork. */
export const MONO = { width: 380, height: 276 };

export const monogramPaths = {
  /* The gold diagonal accent. Drawn first; the letterform overlaps it. */
  accent: "M 70 148 L 124 148 L 186 276 L 132 276 Z",
  /* The letterform: two serifed stems, a thick diagonal and a hairline diagonal. */
  letter: [
    "M 30 16 L 60 16 L 60 254 L 30 254 Z",
    "M 8 0 L 82 0 L 82 16 L 8 16 Z",
    "M 0 254 L 90 254 L 90 272 L 0 272 Z",
    "M 30 0 L 96 0 L 202 256 L 162 256 Z",
    "M 326 0 L 342 0 L 192 256 L 176 256 Z",
    "M 320 16 L 350 16 L 350 254 L 320 254 Z",
    "M 298 0 L 372 0 L 372 16 L 298 16 Z",
    "M 290 254 L 380 254 L 380 272 L 290 272 Z",
  ],
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
