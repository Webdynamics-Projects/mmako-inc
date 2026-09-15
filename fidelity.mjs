import fs from "node:fs";
import { chromium } from "playwright";
import { lockupSvg } from "./brand/_source/lib/logo.mjs";
import { decodePng } from "./scripts/png.mjs";
const SC = process.argv[2];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const shot = async (svg, file) => {
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
  await page.setContent(`<style>html,body{margin:0;background:#fff}svg{display:block}</style>${svg}`);
  await page.waitForTimeout(250);
  fs.writeFileSync(file, await page.screenshot());
  await page.close();
};
await shot(fs.readFileSync("brand/_source/logo/mmako-logo.svg", "utf8"), `${SC}/src.png`);
await shot(lockupSvg("colour")
  .replace(/viewBox="[^"]+"/, 'viewBox="0 0 1024 1024"')
  .replace(/width="\d+" height="\d+"/, 'width="1024" height="1024"'), `${SC}/mine.png`);
await browser.close();

const a = decodePng(fs.readFileSync(`${SC}/src.png`));
const b = decodePng(fs.readFileSync(`${SC}/mine.png`));

// Exact comparison.
let diff = 0, inked = 0, maxDelta = 0;
for (let i = 0; i < a.data.length; i += 4) {
  const av = [a.data[i], a.data[i+1], a.data[i+2]], bv = [b.data[i], b.data[i+1], b.data[i+2]];
  if (av.some((v) => v < 240) || bv.some((v) => v < 240)) inked++;
  const d = Math.abs(av[0]-bv[0]) + Math.abs(av[1]-bv[1]) + Math.abs(av[2]-bv[2]);
  if (d > 24) diff++;
  if (d > maxDelta) maxDelta = d;
}
console.log(`exact:  ${diff} of ${inked} inked pixels differ (${(diff/inked*100).toFixed(3)}%), max delta ${maxDelta}`);

// Geometry comparison: 8x box-downsample removes antialiasing noise, so any
// remaining difference is a real shape or position mismatch.
const down = (img, f) => {
  const w = Math.floor(img.width/f), h = Math.floor(img.height/f), out = new Float64Array(w*h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let dy = 0; dy < f; dy++) for (let dx = 0; dx < f; dx++) {
      const i = ((y*f+dy)*img.width + (x*f+dx))*4;
      sum += (img.data[i] + img.data[i+1] + img.data[i+2]) / 3;
    }
    out[y*w+x] = sum/(f*f);
  }
  return { w, h, out };
};
const A = down(a, 8), B = down(b, 8);
let gDiff = 0, gMax = 0;
for (let i = 0; i < A.out.length; i++) {
  const d = Math.abs(A.out[i] - B.out[i]);
  if (d > 6) gDiff++;
  if (d > gMax) gMax = d;
}
console.log(`geometry: ${gDiff} of ${A.out.length} cells differ by >6/255, max ${gMax.toFixed(2)}`);
console.log(gDiff === 0 ? "GEOMETRY IDENTICAL — extraction is faithful to the artwork"
                        : "geometry mismatch — investigate");
