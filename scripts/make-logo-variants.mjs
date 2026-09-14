/**
 * Prepares the logo assets the site renders. No dependencies — just run it:
 *
 *   node scripts/make-logo-variants.mjs
 *
 * Input   public/logo.png             the firm's logo exactly as supplied —
 *                                     dark artwork on a white or transparent
 *                                     ground. Never modified.
 *
 * Outputs public/logo-dark.png        full lockup, trimmed, background made
 *                                     transparent, colours unchanged. For
 *                                     light surfaces.
 *         public/logo-light.png       full lockup with the dark artwork
 *                                     recoloured to off-white. For the dark
 *                                     header and footer.
 *         public/logo-mark-dark.png   just the monogram, original colours.
 *         public/logo-mark-light.png  just the monogram, reversed.
 *
 * The monogram is split off because a stacked lockup is unreadable at header
 * height — the nav pairs the mark with a typeset wordmark instead. The split
 * point is the tallest fully-transparent horizontal band inside the artwork,
 * i.e. the gap between the monogram and the wordmark below it. The gold accent
 * is preserved in every variant.
 *
 * Re-run after replacing public/logo.png, then check the printed aspect ratios
 * against the numbers at the top of components/Logo.tsx.
 */
import fs from "node:fs";
import path from "node:path";
import { decodePng, encodePng } from "./png.mjs";

const SRC = path.join("public", "logo.png");
const OUT_DARK = path.join("public", "logo-dark.png");
const OUT_LIGHT = path.join("public", "logo-light.png");
const OUT_MARK_DARK = path.join("public", "logo-mark-dark.png");
const OUT_MARK_LIGHT = path.join("public", "logo-mark-light.png");

const BONE = [0xfa, 0xfa, 0xf8]; // --color-bone
const GOLD_HUE = [25, 65];       // degrees — the accent's hue band
const WHITE_LUM = 0.88;          // above this, at low saturation, is background
const TRIM_PADDING = 2;          // px kept around the artwork

if (!fs.existsSync(SRC)) {
  console.error(
    `Missing ${SRC}.\nAdd the firm's logo there (PNG, dark artwork on white or transparent), then re-run.`,
  );
  process.exit(1);
}

const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0)
          : max === g ? (b - r) / d + 2
          :             (r - g) / d + 4;
  return [h * 60, s, l];
};

const { width, height, data } = decodePng(fs.readFileSync(SRC));

// --- Classify every pixel once ----------------------------------------------
const dark = Uint8ClampedArray.from(data);
const light = Uint8ClampedArray.from(data);
let minX = width, minY = height, maxX = -1, maxY = -1;

for (let i = 0; i < data.length; i += 4) {
  const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
  if (a === 0) continue;

  const [hue, sat, lum] = rgbToHsl(r, g, b);
  const isGold = sat > 0.2 && hue >= GOLD_HUE[0] && hue <= GOLD_HUE[1];
  const isBackground = !isGold && sat < 0.15 && lum > WHITE_LUM;

  if (isBackground) {
    dark[i + 3] = 0;
    light[i + 3] = 0;
    continue;
  }

  const px = (i / 4) % width;
  const py = Math.floor(i / 4 / width);
  if (px < minX) minX = px;
  if (px > maxX) maxX = px;
  if (py < minY) minY = py;
  if (py > maxY) maxY = py;

  if (isGold) continue; // gold stays as designed in both variants

  // Neutral dark artwork → off-white, using the pixel's darkness as coverage so
  // anti-aliased edges stay smooth rather than becoming a hard cutout.
  light[i] = BONE[0];
  light[i + 1] = BONE[1];
  light[i + 2] = BONE[2];
  light[i + 3] = Math.round(a * Math.min(1, (1 - lum) * 1.15));
}

if (maxX < 0) {
  console.error("No artwork found in the source — is public/logo.png blank?");
  process.exit(1);
}

minX = Math.max(0, minX - TRIM_PADDING);
minY = Math.max(0, minY - TRIM_PADDING);
maxX = Math.min(width - 1, maxX + TRIM_PADDING);
maxY = Math.min(height - 1, maxY + TRIM_PADDING);
const outW = maxX - minX + 1;
const outH = maxY - minY + 1;

const writeCrop = (pixels, file, cropX, cropY, cropW, cropH) => {
  const out = new Uint8ClampedArray(cropW * cropH * 4);
  for (let y = 0; y < cropH; y++) {
    const from = ((cropY + y) * width + cropX) * 4;
    out.set(pixels.subarray(from, from + cropW * 4), y * cropW * 4);
  }
  fs.writeFileSync(file, encodePng(cropW, cropH, out));
};

writeCrop(dark, OUT_DARK, minX, minY, outW, outH);
writeCrop(light, OUT_LIGHT, minX, minY, outW, outH);

console.log(`Source ${width}×${height} → trimmed to ${outW}×${outH}`);
console.log(`Full lockup aspect ratio ${(outW / outH).toFixed(4)}`);
console.log(`  ${OUT_DARK}  — full lockup, light surfaces`);
console.log(`  ${OUT_LIGHT} — full lockup, dark surfaces`);

// --- Split the monogram off the wordmark ------------------------------------
const rowHasArt = [];
for (let y = 0; y < outH; y++) {
  let art = false;
  for (let x = 0; x < outW && !art; x++) {
    if (dark[((minY + y) * width + minX + x) * 4 + 3] !== 0) art = true;
  }
  rowHasArt.push(art);
}

let best = null;
let runStart = -1;
for (let y = 0; y <= outH; y++) {
  const blank = y < outH && !rowHasArt[y];
  if (blank && runStart === -1) runStart = y;
  if (!blank && runStart !== -1) {
    const run = { start: runStart, len: y - runStart, end: y - 1 };
    // Ignore gaps hugging the very top or bottom — those aren't the split.
    if (run.start > outH * 0.15 && run.end < outH * 0.92) {
      if (!best || run.len > best.len) best = run;
    }
    runStart = -1;
  }
}

if (best) {
  const markH = best.start;
  // Re-trim horizontally: the monogram is narrower than the wordmark.
  let mMinX = outW, mMaxX = -1;
  for (let y = 0; y < markH; y++) {
    for (let x = 0; x < outW; x++) {
      if (dark[((minY + y) * width + minX + x) * 4 + 3] !== 0) {
        if (x < mMinX) mMinX = x;
        if (x > mMaxX) mMaxX = x;
      }
    }
  }
  const markW = mMaxX - mMinX + 1;
  writeCrop(dark, OUT_MARK_DARK, minX + mMinX, minY, markW, markH);
  writeCrop(light, OUT_MARK_LIGHT, minX + mMinX, minY, markW, markH);
  console.log(`\nMonogram split at row ${best.start} (gap of ${best.len}px) → ${markW}×${markH}`);
  console.log(`Monogram aspect ratio ${(markW / markH).toFixed(4)}`);
  console.log(`  ${OUT_MARK_DARK}  — monogram, light surfaces`);
  console.log(`  ${OUT_MARK_LIGHT} — monogram, dark surfaces`);
} else {
  // Not a stacked lockup, or no clear gap — fall back to the full lockup so the
  // site still renders correctly.
  writeCrop(dark, OUT_MARK_DARK, minX, minY, outW, outH);
  writeCrop(light, OUT_MARK_LIGHT, minX, minY, outW, outH);
  console.log("\nNo clear monogram/wordmark gap found — monogram files mirror the full lockup.");
}

console.log("\nIf either aspect ratio changed, update the matching numbers in components/Logo.tsx.");
