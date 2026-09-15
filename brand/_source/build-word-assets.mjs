/** Renders the logo images the Word templates embed. */
import fs from "node:fs";
import path from "node:path";
import { monogramSvg, MONO, LOCKUP, WORDMARK } from "./lib/logo.mjs";
import { renderPng, closeBrowser } from "./lib/render.mjs";
import * as P from "./lib/print.mjs";

const OUT = path.join("brand", "_source", "assets");
fs.mkdirSync(OUT, { recursive: true });

/* Rendered well above display size so the logo stays crisp when printed. */
const stacked = (h, ink, gold) => {
  const w = h * (MONO.width / MONO.height);
  const svg = monogramSvg("colour", { ink, gold });
  return `<div id="art" style="display:inline-flex;flex-direction:column;align-items:center">
    <img src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}"
         style="height:${h}px;width:${w}px;display:block">
    <div style="font-family:Inter,Arial,sans-serif;font-weight:300;
                letter-spacing:${LOCKUP.tracking}em;text-indent:${LOCKUP.tracking}em;
                font-size:${(h * LOCKUP.wordmarkSize).toFixed(1)}px;color:${ink};
                margin-top:${(h * LOCKUP.wordmarkGap).toFixed(1)}px;white-space:nowrap"
         >${WORDMARK}</div>
    <div style="width:${(w * LOCKUP.ruleWidth).toFixed(1)}px;height:${Math.max(2, h * 0.015).toFixed(1)}px;
                background:${gold};margin-top:${(h * LOCKUP.ruleGap).toFixed(1)}px"></div>
  </div>`;
};

const write = async (file, body) => {
  const buf = await renderPng({ body, selector: "#art", width: 1400, height: 900, scale: 1 });
  fs.writeFileSync(path.join(OUT, file), buf);
  console.log("  ", file);
};

await write("word-logo.png", stacked(300, P.INK, P.GOLD));
await closeBrowser();
