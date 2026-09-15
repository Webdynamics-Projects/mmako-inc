/**
 * Renders public/logo-signature.png — the logo the email signatures load.
 *
 * Uses the full stacked lockup so the signature carries the MMAKO LAW wordmark,
 * not the monogram alone. Rendered at 2× the display size for retina screens.
 */
import fs from "node:fs";
import { lockupSvg } from "./lib/logo.mjs";
import { renderPng, closeBrowser } from "./lib/render.mjs";

/* Displayed at 116 × 86 in the signature; rendered at 2× for retina screens. */
const svg = lockupSvg("colour");
const [, , vw, vh] = svg.match(/viewBox="([\d.\- ]+)"/)[1].split(/\s+/).map(Number);
const W = 232;
const H = Math.round((W * vh) / vw);

const body = `<img id="art" style="display:block;width:${W}px;height:${H}px"
  src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}">`;

const buf = await renderPng({ body, selector: "#art", width: W + 40, height: H + 40, scale: 1 });
fs.writeFileSync("public/logo-signature.png", buf);
fs.mkdirSync("brand/06 - STATIONERY/Email Signature", { recursive: true });
fs.writeFileSync("brand/06 - STATIONERY/Email Signature/logo-signature.png", buf);
await closeBrowser();
console.log(`public/logo-signature.png regenerated from the artwork (${W}x${H})`);
