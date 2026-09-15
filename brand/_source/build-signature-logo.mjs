/**
 * Renders public/logo-signature.png — the logo the email signatures load.
 *
 * Uses the full stacked lockup so the signature carries the MMAKO LAW wordmark,
 * not the monogram alone. Rendered at 2× the display size for retina screens.
 */
import fs from "node:fs";
import { monogramSvg, MONO, LOCKUP, WORDMARK } from "./lib/logo.mjs";
import { renderPng, closeBrowser } from "./lib/render.mjs";
import * as P from "./lib/print.mjs";

const H = 150; // monogram height at 2×; the lockup around it lands near 216px tall
const W = H * (MONO.width / MONO.height);
const svg = monogramSvg("colour", { ink: P.INK, gold: P.GOLD });

const body = `<div id="art" style="display:inline-flex;flex-direction:column;align-items:center">
  <img src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}"
       style="height:${H}px;width:${W}px;display:block">
  <div style="font-family:Inter,Arial,sans-serif;font-weight:300;
              letter-spacing:${LOCKUP.tracking}em;text-indent:${LOCKUP.tracking}em;
              font-size:${(H * LOCKUP.wordmarkSize).toFixed(1)}px;color:${P.INK};
              margin-top:${(H * LOCKUP.wordmarkGap).toFixed(1)}px;white-space:nowrap"
       >${WORDMARK}</div>
  <div style="width:${(W * LOCKUP.ruleWidth).toFixed(1)}px;height:2px;background:${P.GOLD};
              margin-top:${(H * LOCKUP.ruleGap).toFixed(1)}px"></div>
</div>`;

const buf = await renderPng({ body, selector: "#art", width: 600, height: 400, scale: 1 });
fs.writeFileSync("public/logo-signature.png", buf);
fs.mkdirSync("brand/06 - STATIONERY/Email Signature", { recursive: true });
fs.writeFileSync("brand/06 - STATIONERY/Email Signature/logo-signature.png", buf);
await closeBrowser();
console.log("public/logo-signature.png regenerated with the wordmark");
