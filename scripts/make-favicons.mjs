/**
 * Builds the browser icons from the logo monogram. No dependencies:
 *
 *   node scripts/make-favicons.mjs
 *
 * Requires public/logo-mark-light.png, so run make-logo-variants.mjs first.
 *
 * Outputs app/icon.png          180×180, used for the tab icon and when the
 *                               site is saved to a phone home screen.
 *         public/favicon.ico    32×32, for older browsers that still ask for it.
 *
 * Both place the reversed monogram on the brand's near-black ground, so the
 * icon reads at small sizes instead of dissolving into a light background.
 */
import fs from "node:fs";
import path from "node:path";
import { decodePng, encodePng } from "./png.mjs";

const SRC = path.join("public", "logo-mark-light.png");
const OUT_PNG = path.join("app", "icon.png");
const OUT_ICO = path.join("public", "favicon.ico");

const INK = [0x0b, 0x0b, 0x0c]; // --color-ink
const PADDING = 0.16;           // share of the canvas left clear on each side

if (!fs.existsSync(SRC)) {
  console.error(`Missing ${SRC}. Run: node scripts/make-logo-variants.mjs`);
  process.exit(1);
}

const mark = decodePng(fs.readFileSync(SRC));

/**
 * Renders the monogram centred on an ink square of the given size.
 * Downscales with a box filter, which is what suits a large source shrinking
 * to icon dimensions.
 */
function render(size) {
  const out = new Uint8ClampedArray(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    out[i * 4] = INK[0];
    out[i * 4 + 1] = INK[1];
    out[i * 4 + 2] = INK[2];
    out[i * 4 + 3] = 255;
  }

  const box = size * (1 - PADDING * 2);
  const scale = Math.min(box / mark.width, box / mark.height);
  const drawW = Math.round(mark.width * scale);
  const drawH = Math.round(mark.height * scale);
  const offsetX = Math.round((size - drawW) / 2);
  const offsetY = Math.round((size - drawH) / 2);

  for (let y = 0; y < drawH; y++) {
    for (let x = 0; x < drawW; x++) {
      // Average the source pixels that fall inside this destination pixel.
      const x0 = Math.floor((x / drawW) * mark.width);
      const x1 = Math.max(x0 + 1, Math.floor(((x + 1) / drawW) * mark.width));
      const y0 = Math.floor((y / drawH) * mark.height);
      const y1 = Math.max(y0 + 1, Math.floor(((y + 1) / drawH) * mark.height));

      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let sy = y0; sy < y1; sy++) {
        for (let sx = x0; sx < x1; sx++) {
          const s = (sy * mark.width + sx) * 4;
          const alpha = mark.data[s + 3] / 255;
          r += mark.data[s] * alpha;
          g += mark.data[s + 1] * alpha;
          b += mark.data[s + 2] * alpha;
          a += alpha;
          n++;
        }
      }
      if (n === 0 || a === 0) continue;

      // Composite the averaged source colour over the ink ground.
      const cover = a / n;
      const sr = r / a, sg = g / a, sb = b / a;
      const d = ((offsetY + y) * size + offsetX + x) * 4;
      out[d] = Math.round(sr * cover + INK[0] * (1 - cover));
      out[d + 1] = Math.round(sg * cover + INK[1] * (1 - cover));
      out[d + 2] = Math.round(sb * cover + INK[2] * (1 - cover));
      out[d + 3] = 255;
    }
  }

  return encodePng(size, size, out);
}

fs.writeFileSync(OUT_PNG, render(180));

// Wrap a 32×32 PNG in an ICO container (PNG-in-ICO, supported since Vista).
const small = render(32);
const header = Buffer.alloc(6);
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image
const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0);    // width
entry.writeUInt8(32, 1);    // height
entry.writeUInt16LE(1, 4);  // colour planes
entry.writeUInt16LE(32, 6); // bits per pixel
entry.writeUInt32LE(small.length, 8);
entry.writeUInt32LE(22, 12); // offset to the image data
fs.writeFileSync(OUT_ICO, Buffer.concat([header, entry, small]));

console.log(`${OUT_PNG} written (180×180)`);
console.log(`${OUT_ICO} written (32×32, ${small.length + 22} bytes)`);
