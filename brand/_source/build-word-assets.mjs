/** Renders the logo images the Word templates embed. */
import fs from "node:fs";
import path from "node:path";
import { lockupSvg } from "./lib/logo.mjs";
import { renderPng, closeBrowser } from "./lib/render.mjs";

const OUT = path.join("brand", "_source", "assets");
fs.mkdirSync(OUT, { recursive: true });

/* Rendered well above display size so the logo stays crisp when printed. */
const write = async (file, svg, width) => {
  const [, , vw, vh] = svg.match(/viewBox="([\d.\- ]+)"/)[1].split(/\s+/).map(Number);
  const height = Math.round((width * vh) / vw);
  const body = `<img id="art" style="display:block;width:${width}px;height:${height}px"
    src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}">`;
  const buf = await renderPng({ body, selector: "#art", width: width + 40, height: height + 40, scale: 1 });
  fs.writeFileSync(path.join(OUT, file), buf);
  console.log("  ", file, `${width}x${height}`);
};

await write("word-logo.png", lockupSvg("colour"), 900);
await closeBrowser();
