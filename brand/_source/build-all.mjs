/** Runs every generator in order. */
import { execFileSync } from "node:child_process";

const steps = [
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
