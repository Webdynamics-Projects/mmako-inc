/**
 * Generates the website's logo assets from the supplied artwork.
 *
 *   npm run logo
 *
 * Writes SVGs rather than rasters — the mark is vector, so the site should
 * serve it as vector: crisp at every size, a fraction of the weight, and no
 * colour variants to maintain by hand. The favicon still needs raster forms,
 * which are rendered here from the same paths.
 */
import fs from "node:fs";
import path from "node:path";
import { lockupSvg, horizontalSvg, monogramSvg } from "./lib/logo.mjs";
import { colours } from "./lib/tokens.mjs";
import { encodePng, decodePng } from "../../scripts/png.mjs";
import { renderPng, closeBrowser } from "./lib/render.mjs";

const BONE = colours.primary[2].hex;
const INK = colours.primary[0].hex;

const write = (file, data) => {
  fs.writeFileSync(file, data);
  const size = Buffer.byteLength(data);
  console.log("  ", file, `(${size < 1024 ? size + " B" : (size / 1024).toFixed(1) + " KB"})`);
};

/* Two tones of each mark: artwork colours for light grounds, ink reversed to
   bone for the dark header and footer. Gold is never altered. */
write("public/logo.svg", lockupSvg("colour"));
write("public/logo-light.svg", lockupSvg("colour", { ink: BONE }));
write("public/logo-mark.svg", horizontalSvg("colour"));
write("public/logo-mark-light.svg", horizontalSvg("colour", { ink: BONE }));
write("public/logo-monogram.svg", monogramSvg("colour"));
write("public/logo-monogram-light.svg", monogramSvg("colour", { ink: BONE }));

/* --- Favicons, rendered from the same paths ------------------------------- */
const mono = monogramSvg("colour", { ink: BONE });
const [, , mw, mh] = mono.match(/viewBox="([\d.\- ]+)"/)[1].split(/\s+/).map(Number);

/** The monogram centred on the brand's ink ground, at the given square size. */
async function icon(size) {
  const pad = 0.17;
  const scale = Math.min((size * (1 - pad * 2)) / mw, (size * (1 - pad * 2)) / mh);
  const body = `<div id="art" style="width:${size}px;height:${size}px;background:${INK};
       display:flex;align-items:center;justify-content:center">
    <img style="width:${(mw * scale).toFixed(2)}px;height:${(mh * scale).toFixed(2)}px;display:block"
         src="data:image/svg+xml;base64,${Buffer.from(mono).toString("base64")}">
  </div>`;
  return renderPng({ body, selector: "#art", width: size + 40, height: size + 40,
    transparent: false, scale: 1 });
}

write("app/icon.png", await icon(180));

/* PNG-in-ICO, which every browser still asking for /favicon.ico accepts. */
const small = decodePng(await icon(32));
const png32 = encodePng(small.width, small.height, small.data);
const header = Buffer.alloc(6);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0);
entry.writeUInt8(32, 1);
entry.writeUInt16LE(1, 4);
entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(png32.length, 8);
entry.writeUInt32LE(22, 12);
write("public/favicon.ico", Buffer.concat([header, entry, png32]));

/* The artwork itself, served for anyone who wants the original. */
fs.copyFileSync(path.join("brand", "_source", "logo", "mmako-logo.svg"), "public/logo-source.svg");
console.log("   public/logo-source.svg");

await closeBrowser();
