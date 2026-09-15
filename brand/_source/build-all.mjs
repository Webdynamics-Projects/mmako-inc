/** Runs every generator in order. */
import { execFileSync } from "node:child_process";

const steps = [
  /* Asset generators first — later steps embed what these produce. */
  "build-website-logo.mjs",
  "build-signature-logo.mjs",
  "build-word-assets.mjs",
  "build-logo.mjs",
  "build-signatures.mjs",
  "build-stationery.mjs",
  "build-documents.mjs",
  "build-digital-office.mjs",
  "build-guidelines.mjs",
  "build-word.mjs",
];

for (const step of steps) {
  execFileSync(process.execPath, [`brand/_source/${step}`], { stdio: "inherit" });
}
console.log("\nBranding kit rebuilt.");
