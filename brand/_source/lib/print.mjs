/** Shared styling for every print-ready template in the kit. */
import { colours, typography } from "./tokens.mjs";

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

/** The stacked lockup, drawn inline so PDFs carry no external image. */
export function lockup({ height = 64, tone = "dark", showWordmark = true, gap = 12 }) {
  const ink = tone === "dark" ? INK : BONE;
  const mono = tone === "dark" ? "monogram-ink" : "monogram-bone";
  return `<div style="display:inline-flex;flex-direction:column;align-items:center">
    <img src="${mono}" style="height:${height}px;width:auto;display:block">
    ${showWordmark ? `<div style="font-family:${SANS};font-weight:320;letter-spacing:.26em;text-indent:.26em;
      font-size:${(height * 0.2).toFixed(1)}px;color:${ink};margin-top:${gap}px;white-space:nowrap">MMAKO LAW</div>` : ""}
  </div>`;
}
