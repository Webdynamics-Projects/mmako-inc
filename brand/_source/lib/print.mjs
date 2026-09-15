/** Shared styling and logo helpers for every template in the kit. */
import { colours, typography } from "./tokens.mjs";
import { lockupSvg, horizontalSvg, monogramSvg } from "./logo.mjs";

export const INK = colours.primary[0].hex;
export const GOLD = colours.primary[1].hex;
export const BONE = colours.primary[2].hex;
export const GOLD_DEEP = colours.secondary[0].hex;
export const GREY = colours.secondary[2].hex;
export const BONE_200 = colours.secondary[3].hex;
export const RULE = colours.secondary[4].hex;

export const DISPLAY = `'${typography.primary.name}', ${typography.primary.fallback}`;
export const SANS = `'${typography.secondary.name}', ${typography.secondary.fallback}`;

export const baseCss = `
  body{font-family:${SANS};color:${INK};-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .page{position:relative;overflow:hidden;background:${BONE}}
  .eyebrow{font-size:7.5pt;letter-spacing:.2em;text-transform:uppercase;color:${GOLD_DEEP};font-weight:500}
  .rule-gold{background:${GOLD};height:2px;border:0}
  .hair{background:${RULE};height:1px;border:0}
  h1,h2,h3{font-family:${DISPLAY};font-weight:500;letter-spacing:-.02em;margin:0}
  p{margin:0}
  .muted{color:${GREY}}
  table{border-collapse:collapse}
`;

/* ---------------------------------------------------------------------------
   Logo helpers.

   Every mark comes from the designer's own artwork, so nothing here composes a
   lockup out of set type any more. `tone` picks the colourway: "light" reverses
   the ink to bone for dark grounds; the gold is never altered.
   --------------------------------------------------------------------------- */
const uri = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
const inkFor = (tone) => (tone === "light" ? { ink: BONE } : {});

/** Stacked lockup — monogram, wordmark and rule, as supplied. */
export const lockupUri = (tone = "dark") => uri(lockupSvg("colour", inkFor(tone)));

/** Horizontal lockup — monogram beside the wordmark, for short bands. */
export const horizontalUri = (tone = "dark") => uri(horizontalSvg("colour", inkFor(tone)));

/** Monogram alone. */
export const monoUri = (tone = "dark") => uri(monogramSvg("colour", inkFor(tone)));

/** Aspect ratios, so callers can size by height and let width follow. */
export const RATIO = {
  lockup: ratioOf(lockupSvg("colour")),
  horizontal: ratioOf(horizontalSvg("colour")),
  mono: ratioOf(monogramSvg("colour")),
};

function ratioOf(svg) {
  const [, , w, h] = svg.match(/viewBox="([\d.\- ]+)"/)[1].split(/\s+/).map(Number);
  return w / h;
}

/** An <img> for the given mark at a fixed height, in whatever CSS unit. */
export function logoImg(kind, tone, height, unit = "px") {
  const src = kind === "mono" ? monoUri(tone)
    : kind === "horizontal" ? horizontalUri(tone) : lockupUri(tone);
  const w = (height * RATIO[kind]).toFixed(2);
  return `<img src="${src}" style="height:${height}${unit};width:${w}${unit};display:block">`;
}
