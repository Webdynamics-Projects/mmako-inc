/**
 * Renders the canonical lockup to public/logo.png — the single source file that
 * scripts/make-logo-variants.mjs consumes for the website's assets.
 *
 * This exists only while the logo is a reconstruction. When the designer's
 * original artwork arrives it replaces public/logo.png directly and this script
 * is no longer needed.
 */
import fs from "node:fs";
import { monogramSvg, MONO, LOCKUP, WORDMARK } from "./lib/logo.mjs";
import { renderPng, closeBrowser } from "./lib/render.mjs";

const INK = "#2B2B2B";  // the artwork's charcoal, not the brand ink
const GOLD = "#C0A050"; // the artwork's softer gold

const H = 420;
const W = H * (MONO.width / MONO.height);
const svg = monogramSvg("colour", { ink: INK, gold: GOLD });

const body = `<div id="art" style="display:inline-flex;flex-direction:column;align-items:center;
     background:#fff;padding:60px 80px">
  <img src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}"
       style="height:${H}px;width:${W}px;display:block">
  <div style="font-family:Inter,Arial,sans-serif;font-weight:300;
              letter-spacing:${LOCKUP.tracking}em;text-indent:${LOCKUP.tracking}em;
              font-size:${(H * LOCKUP.wordmarkSize).toFixed(1)}px;color:${INK};
              margin-top:${(H * LOCKUP.wordmarkGap).toFixed(1)}px;white-space:nowrap"
       >${WORDMARK}</div>
  <div style="width:${(W * LOCKUP.ruleWidth).toFixed(1)}px;height:${(H * 0.015).toFixed(1)}px;
              background:${GOLD};margin-top:${(H * LOCKUP.ruleGap).toFixed(1)}px"></div>
</div>`;

fs.writeFileSync("public/logo.png",
  await renderPng({ body, selector: "#art", width: 1400, height: 900, transparent: false, scale: 1 }));
await closeBrowser();
console.log("public/logo.png regenerated from the traced geometry");
