/** Generates every file in "02 - LOGO" from the supplied artwork. */
import fs from "node:fs";
import path from "node:path";
import { colours } from "./lib/tokens.mjs";
import {
  monogramSvg, wordmarkSvg, lockupSvg, horizontalSvg, SOURCE_COLOURS,
} from "./lib/logo.mjs";
import { renderPng, closeBrowser } from "./lib/render.mjs";

const OUT = path.join("brand", "02 - LOGO");
const BONE = colours.primary[2].hex;

const dirs = ["Primary Logo", "Secondary Logo", "Monogram",
  "Black Logo", "White Logo", "Colour Logo", "Favicon"];
for (const d of dirs) fs.mkdirSync(path.join(OUT, d), { recursive: true });

const write = (dir, file, data) => {
  fs.writeFileSync(path.join(OUT, dir, file), data);
  console.log("  ", path.join(dir, file));
};

/** Rasterises an SVG at a given width, on a transparent ground. */
async function png(svg, width) {
  const vb = svg.match(/viewBox="([\d.\- ]+)"/)[1].split(/\s+/).map(Number);
  const height = Math.round((width * vb[3]) / vb[2]);
  const body = `<img id="art" style="display:block;width:${width}px;height:${height}px"
    src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}">`;
  return renderPng({ body, selector: "#art", width: width + 40, height: height + 40, scale: 1 });
}

console.log("02 - LOGO");

/* --- Primary and Colour: the stacked lockup exactly as supplied ----------- */
const primary = lockupSvg("colour");
for (const dir of ["Primary Logo", "Colour Logo"]) {
  write(dir, "mmako-logo-primary.svg", primary);
  write(dir, "mmako-logo-primary.png", await png(primary, 2000));
  /* Reversed: the ink strokes go to bone so the mark reads on dark grounds,
     while the gold stays exactly as designed. */
  const reversed = lockupSvg("colour", { ink: BONE });
  write(dir, "mmako-logo-primary-reversed.svg", reversed);
  write(dir, "mmako-logo-primary-reversed.png", await png(reversed, 2000));
}

/* --- Secondary: horizontal lockup for short bands ------------------------- */
const horizontal = horizontalSvg("colour");
write("Secondary Logo", "mmako-logo-horizontal.svg", horizontal);
write("Secondary Logo", "mmako-logo-horizontal.png", await png(horizontal, 2000));
const horizontalRev = horizontalSvg("colour", { ink: BONE });
write("Secondary Logo", "mmako-logo-horizontal-reversed.svg", horizontalRev);
write("Secondary Logo", "mmako-logo-horizontal-reversed.png", await png(horizontalRev, 2000));

/* --- Monogram ------------------------------------------------------------- */
write("Monogram", "mmako-monogram.svg", monogramSvg("colour"));
write("Monogram", "mmako-monogram.png", await png(monogramSvg("colour"), 1200));
write("Monogram", "mmako-monogram-reversed.svg", monogramSvg("colour", { ink: BONE }));
write("Monogram", "mmako-monogram-reversed.png", await png(monogramSvg("colour", { ink: BONE }), 1200));
write("Monogram", "mmako-monogram-black.svg", monogramSvg("black"));
write("Monogram", "mmako-monogram-white.svg", monogramSvg("white"));

/* --- Wordmark, supplied separately so it can be locked up independently --- */
write("Secondary Logo", "mmako-wordmark.svg", wordmarkSvg("colour"));
write("Secondary Logo", "mmako-wordmark.png", await png(wordmarkSvg("colour"), 2000));

/* --- One-colour versions -------------------------------------------------- */
write("Black Logo", "mmako-logo-black.svg", lockupSvg("black"));
write("Black Logo", "mmako-logo-black.png", await png(lockupSvg("black"), 2000));
write("Black Logo", "mmako-logo-horizontal-black.svg", horizontalSvg("black"));
write("Black Logo", "mmako-monogram-black.svg", monogramSvg("black"));

write("White Logo", "mmako-logo-white.svg", lockupSvg("white"));
write("White Logo", "mmako-logo-white.png", await png(lockupSvg("white"), 2000));
write("White Logo", "mmako-logo-horizontal-white.svg", horizontalSvg("white"));
write("White Logo", "mmako-monogram-white.svg", monogramSvg("white"));

/* --- Favicon -------------------------------------------------------------- */
const mono = monogramSvg("colour", { ink: BONE });
const vb = mono.match(/viewBox="([\d.\- ]+)"/)[1];
const [, , mw, mh] = vb.split(/\s+/).map(Number);
const pad = 0.16;
const scale = Math.min((1 - pad * 2) / mw, (1 - pad * 2) / mh) * 64;
write("Favicon", "favicon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" fill="${colours.primary[0].hex}"/>
  <g transform="translate(${((64 - mw * scale) / 2).toFixed(2)} ${((64 - mh * scale) / 2).toFixed(2)}) scale(${scale.toFixed(5)})">
${mono.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/^/gm, "  ")}
  </g>
</svg>
`);
for (const f of ["favicon.ico", "apple-touch-icon-180.png"]) {
  const src = f === "favicon.ico" ? "public/favicon.ico" : "app/icon.png";
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(OUT, "Favicon", f));
    console.log("   Favicon/" + f);
  }
}

/* --- The artwork itself, so the source travels with the kit ---------------- */
fs.copyFileSync(path.join("brand", "_source", "logo", "mmako-logo.svg"),
  path.join(OUT, "Primary Logo", "mmako-logo-source.svg"));
console.log("   Primary Logo/mmako-logo-source.svg");

await closeBrowser();
console.log(`  (artwork colours: ink ${SOURCE_COLOURS.ink}, gold ${SOURCE_COLOURS.gold})`);
