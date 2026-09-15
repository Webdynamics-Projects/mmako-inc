/** Generates every file in "02 - LOGO". */
import fs from "node:fs";
import path from "node:path";
import { firm, colours } from "./lib/tokens.mjs";
import { monogramSvg, MONO, WORDMARK } from "./lib/logo.mjs";
import { renderPng, closeBrowser } from "./lib/render.mjs";

const OUT = path.join("brand", "02 - LOGO");
const INK = colours.primary[0].hex;
const GOLD = colours.primary[1].hex;

const dirs = [
  "Primary Logo", "Secondary Logo", "Monogram",
  "Black Logo", "White Logo", "Colour Logo", "Favicon",
];
for (const d of dirs) fs.mkdirSync(path.join(OUT, d), { recursive: true });

const write = (dir, file, data) => {
  fs.writeFileSync(path.join(OUT, dir, file), data);
  console.log("  ", path.join(dir, file));
};

/* --- Shared page styling for the rendered lockups ------------------------ */
const css = `
.stage{display:inline-flex;flex-direction:column;align-items:center;padding:8px}
.row{display:inline-flex;align-items:center;gap:34px;padding:8px}
.word{font-family:Inter,Arial,sans-serif;font-weight:320;letter-spacing:0.26em;white-space:nowrap;
      text-indent:0.26em;line-height:1}
.rule{height:3px}
`;

const monogramImg = (mode, h) =>
  `<img style="height:${h}px;width:auto;display:block" src="data:image/svg+xml;base64,${
    Buffer.from(monogramSvg(mode, { ink: INK, gold: GOLD })).toString("base64")
  }">`;

/** The supplied stacked lockup: monogram over wordmark over rule. */
const lockupBody = (mode) => {
  const ink = mode === "white" ? "#FFFFFF" : mode === "black" ? "#000000" : INK;
  const gold = mode === "white" ? "#FFFFFF" : mode === "black" ? "#000000" : GOLD;
  return `<div class="stage" id="art">
    ${monogramImg(mode, 276)}
    <div class="word" style="font-size:56px;color:${ink};margin-top:44px">${WORDMARK}</div>
    <div class="rule" style="width:150px;background:${gold};margin-top:30px"></div>
  </div>`;
};

/** Horizontal lockup: monogram beside the wordmark, for tight headers. */
const horizontalBody = (mode) => {
  const ink = mode === "white" ? "#FFFFFF" : mode === "black" ? "#000000" : INK;
  return `<div class="row" id="art">
    ${monogramImg(mode, 132)}
    <div class="word" style="font-size:40px;color:${ink}">${WORDMARK}</div>
  </div>`;
};

async function png(body, file, dir, width = 1800) {
  const buf = await renderPng({ body, css, selector: "#art", width, height: 1000, scale: 2 });
  write(dir, file, buf);
}

console.log("02 - LOGO");

/* --- Primary + Colour (same artwork, both named for the kit's structure) -- */
for (const dir of ["Primary Logo", "Colour Logo"]) {
  write(dir, "mmako-logo-primary.svg", lockupSvg("colour"));
  await png(lockupBody("colour"), "mmako-logo-primary.png", dir);
}

/* --- Secondary (horizontal) ---------------------------------------------- */
write("Secondary Logo", "mmako-logo-horizontal.svg", horizontalSvg("colour"));
await png(horizontalBody("colour"), "mmako-logo-horizontal.png", "Secondary Logo", 1600);
await png(horizontalBody("white"), "mmako-logo-horizontal-white.png", "Secondary Logo", 1600);

/* --- Monogram ------------------------------------------------------------ */
write("Monogram", "mmako-monogram.svg", monogramSvg("colour", { ink: INK, gold: GOLD }));
write("Monogram", "mmako-monogram-black.svg", monogramSvg("black"));
write("Monogram", "mmako-monogram-white.svg", monogramSvg("white"));
await png(`<div id="art" style="padding:8px">${monogramImg("colour", 600)}</div>`, "mmako-monogram.png", "Monogram", 900);

/* --- One-colour versions -------------------------------------------------- */
write("Black Logo", "mmako-logo-black.svg", lockupSvg("black"));
await png(lockupBody("black"), "mmako-logo-black.png", "Black Logo");
write("Black Logo", "mmako-monogram-black.svg", monogramSvg("black"));

write("White Logo", "mmako-logo-white.svg", lockupSvg("white"));
await png(lockupBody("white"), "mmako-logo-white.png", "White Logo");
write("White Logo", "mmako-monogram-white.svg", monogramSvg("white"));

/* --- Favicon -------------------------------------------------------------- */
const faviconSvg = (() => {
  /* Built from the shared geometry rather than copied by hand, so it can never
     drift from the monogram. The mark is inset on the brand's ink ground. */
  const pad = 0.15;
  const scale = (64 * (1 - pad * 2)) / MONO.width;
  const x = (64 - MONO.width * scale) / 2;
  const y = (64 - MONO.height * scale) / 2;
  const inner = monogramSvg("colour", { ink: "#FAFAF8", gold: GOLD })
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" fill="${INK}"/>
  <g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(5)})">${inner}</g>
</svg>
`;
})();
write("Favicon", "favicon.svg", faviconSvg);
fs.copyFileSync("public/favicon.ico", path.join(OUT, "Favicon", "favicon.ico"));
console.log("   Favicon/favicon.ico");
fs.copyFileSync("app/icon.png", path.join(OUT, "Favicon", "apple-touch-icon-180.png"));
console.log("   Favicon/apple-touch-icon-180.png");

/* --- SVG builders that embed the wordmark as text ------------------------- */
function lockupSvg(mode) {
  const ink = mode === "white" ? "#FFFFFF" : mode === "black" ? "#000000" : INK;
  const gold = mode === "white" ? "#FFFFFF" : mode === "black" ? "#000000" : GOLD;
  const inner = monogramSvg(mode, { ink: INK, gold: GOLD })
    .replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 460" width="560" height="460" role="img" aria-label="${firm.markName} logo">
  <g transform="translate(90 0)">${inner}</g>
  <text x="280" y="372" text-anchor="middle" font-family="Inter, Arial, sans-serif"
        font-size="56" font-weight="320" letter-spacing="14.6" fill="${ink}">${WORDMARK}</text>
  <rect x="205" y="416" width="150" height="3" fill="${gold}"/>
</svg>
`;
}

function horizontalSvg(mode) {
  const ink = mode === "white" ? "#FFFFFF" : mode === "black" ? "#000000" : INK;
  const scale = 132 / MONO.height;
  const inner = monogramSvg(mode, { ink: INK, gold: GOLD })
    .replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 140" width="660" height="140" role="img" aria-label="${firm.markName} logo">
  <g transform="translate(0 4) scale(${scale.toFixed(4)})">${inner}</g>
  <text x="216" y="84" font-family="Inter, Arial, sans-serif"
        font-size="40" font-weight="320" letter-spacing="10.4" fill="${ink}">${WORDMARK}</text>
</svg>
`;
}

await closeBrowser();
console.log("done");
