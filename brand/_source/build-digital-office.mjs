/** Generates "08 - DIGITAL" and "09 - OFFICE". */
import fs from "node:fs";
import path from "node:path";
import { firm } from "./lib/tokens.mjs";
import { renderPng, renderPdf, closeBrowser } from "./lib/render.mjs";
import * as P from "./lib/print.mjs";

const a = firm.address;
const monoBone = P.monoUri("light");
const monoInk = P.monoUri("dark");

const save = (base, dir, file, buf) => {
  fs.mkdirSync(path.join(base, dir), { recursive: true });
  fs.writeFileSync(path.join(base, dir, file), buf);
  console.log("  ", path.join(dir, file));
};

/* The dark surface used across the brand: gold glow plus a faint grid. */
const darkSurface = `
  background-color:${P.INK};
  background-image:
    radial-gradient(ellipse 80% 60% at 75% 0%, rgba(187,155,102,.16), transparent 60%),
    radial-gradient(ellipse 60% 50% at 0% 100%, rgba(187,155,102,.07), transparent 65%),
    linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.022) 1px, transparent 1px);
  background-size:100% 100%,100% 100%,72px 72px,72px 72px;`;

const lockup = (h, tone) => P.logoImg("lockup", tone, h, "px");

const css = P.baseCss + `.canvas{display:flex;overflow:hidden;position:relative}`;

const png = async (body, w, h) =>
  renderPng({ body, css, selector: "#c", width: w, height: h, transparent: false, scale: 1 });

/* ========================= 08 - DIGITAL ================================== */
const D = path.join("brand", "08 - DIGITAL");
console.log("08 - DIGITAL");

/* LinkedIn banner — 1584×396, with the safe zone kept clear of the avatar. */
save(D, "LinkedIn", "linkedin-banner-1584x396.png", await png(`
  <div id="c" class="canvas" style="width:1584px;height:396px;${darkSurface}
       align-items:center;padding:0 96px 0 420px">
    <div>
      <div style="font-family:${P.SANS};font-size:15px;letter-spacing:.22em;text-transform:uppercase;
                  color:${P.GOLD};margin-bottom:18px">${firm.tagline}</div>
      <div style="font-family:${P.DISPLAY};font-size:52px;line-height:1.12;color:${P.BONE};max-width:820px">
        Legal counsel built for<br><em style="color:${P.GOLD}">how the world actually moves</em>
      </div>
      <div style="font-family:${P.SANS};font-size:17px;color:rgba(227,225,217,.72);margin-top:22px">
        ${firm.domain}
      </div>
    </div>
    <div style="position:absolute;left:0;top:0;bottom:0;width:4px;background:${P.GOLD}"></div>
  </div>`, 1584, 396));

save(D, "LinkedIn", "linkedin-profile-400x400.png", await png(`
  <div id="c" class="canvas" style="width:400px;height:400px;background:${P.INK};
       align-items:center;justify-content:center">
    <img src="${monoBone}" style="height:176px;width:auto;display:block">
  </div>`, 400, 400));

/* Social templates */
save(D, "Social Templates", "social-quote-1080x1080.png", await png(`
  <div id="c" class="canvas" style="width:1080px;height:1080px;${darkSurface}
       flex-direction:column;justify-content:space-between;padding:84px">
    <img src="${monoBone}" style="height:92px;width:auto;display:block">
    <div>
      <div style="width:64px;height:2px;background:${P.GOLD};margin-bottom:38px"></div>
      <div style="font-family:${P.DISPLAY};font-size:60px;line-height:1.22;color:${P.BONE}">
        A contract isn't paperwork you sign to start the work — it's the map everyone
        reads when something goes wrong.
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;
                font-family:${P.SANS};font-size:22px;color:rgba(227,225,217,.66)">
      <span>${firm.domain}</span>
      <span style="font-size:16px;letter-spacing:.2em;text-transform:uppercase;color:${P.GOLD}">
        ${firm.tagline}</span>
    </div>
  </div>`, 1080, 1080));

save(D, "Social Templates", "social-announcement-1080x1080.png", await png(`
  <div id="c" class="canvas" style="width:1080px;height:1080px;background:${P.BONE};
       flex-direction:column;justify-content:space-between;padding:84px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <img src="${monoInk}" style="height:92px;width:auto;display:block">
      <span style="font-family:${P.SANS};font-size:15px;letter-spacing:.2em;text-transform:uppercase;
                   color:${P.GOLD_DEEP};padding-top:14px">[Category]</span>
    </div>
    <div>
      <div style="width:64px;height:2px;background:${P.GOLD};margin-bottom:38px"></div>
      <div style="font-family:${P.DISPLAY};font-size:66px;line-height:1.16;color:${P.INK}">
        [Headline goes here — keep it to two lines]
      </div>
      <div style="font-family:${P.SANS};font-size:26px;line-height:1.6;color:${P.GREY};margin-top:28px;
                  max-width:760px">
        [One supporting sentence. Say the thing plainly.]
      </div>
    </div>
    <div style="font-family:${P.SANS};font-size:22px;color:${P.GREY}">${firm.domain}</div>
  </div>`, 1080, 1080));

save(D, "Social Templates", "social-portrait-1080x1350.png", await png(`
  <div id="c" class="canvas" style="width:1080px;height:1350px;${darkSurface}
       flex-direction:column;justify-content:space-between;padding:90px">
    ${lockup(110, "light")}
    <div>
      <div style="width:64px;height:2px;background:${P.GOLD};margin-bottom:40px"></div>
      <div style="font-family:${P.DISPLAY};font-size:72px;line-height:1.16;color:${P.BONE}">
        [Headline — two or three lines maximum]
      </div>
      <div style="font-family:${P.SANS};font-size:28px;line-height:1.6;
                  color:rgba(227,225,217,.72);margin-top:32px">
        [Supporting line.]
      </div>
    </div>
    <div style="font-family:${P.SANS};font-size:24px;color:${P.GOLD}">${firm.domain}</div>
  </div>`, 1080, 1350));

/* Email assets — a header banner for campaign mail. */
save(D, "Email Assets", "email-header-600x180.png", await png(`
  <div id="c" class="canvas" style="width:600px;height:180px;${darkSurface}
       align-items:center;padding:0 44px">
    ${lockup(64, "light")}
    <div style="margin-left:auto;text-align:right;font-family:${P.SANS};font-size:13px;
                letter-spacing:.2em;text-transform:uppercase;color:${P.GOLD}">${firm.tagline}</div>
  </div>`, 600, 180));

/* Website assets already live in the site repo; mirror the key ones here. */
fs.mkdirSync(path.join(D, "Website Assets"), { recursive: true });
/* The site now serves the mark as vector, so these mirror the SVGs it uses. */
for (const f of ["logo.svg", "logo-light.svg", "logo-mark.svg", "logo-mark-light.svg",
                 "logo-monogram.svg", "logo-monogram-light.svg", "favicon.ico"]) {
  fs.copyFileSync(path.join("public", f), path.join(D, "Website Assets", f));
  console.log("   Website Assets/" + f);
}

/* ========================= 09 - OFFICE =================================== */
const O = path.join("brand", "09 - OFFICE");
console.log("09 - OFFICE");

const officeCss = P.baseCss + `@page{margin:0}.page{display:flex;overflow:hidden;position:relative}`;

/* Door sign — 300 × 100 mm, brushed-dark plate. */
const doorBody = `<div class="page" style="width:300mm;height:100mm;${darkSurface}
     align-items:center;justify-content:center;gap:18mm">
  ${P.logoImg("mono", "light", 38, "mm")}
  <div style="border-left:1.5pt solid ${P.GOLD};padding-left:14mm">
    ${P.logoImg("horizontal", "light", 13, "mm")}
    <div style="font-family:${P.SANS};font-size:4mm;letter-spacing:.2em;text-transform:uppercase;
                color:${P.GOLD};margin-top:6mm">${firm.tagline}</div>
  </div>
</div>`;
save(O, "Door Signs", "door-sign-300x100mm.pdf",
  await renderPdf({ body: doorBody, css: officeCss, widthMm: 300, heightMm: 100 }));

/* Reception signage — 900 × 300 mm. */
const signBody = `<div class="page" style="width:900mm;height:300mm;background:${P.BONE};
     flex-direction:column;align-items:center;justify-content:center">
  ${P.logoImg("lockup", "dark", 190, "mm")}
</div>`;
save(O, "Office Signage", "reception-signage-900x300mm.pdf",
  await renderPdf({ body: signBody, css: officeCss, widthMm: 900, heightMm: 300 }));

/* Presentation folder — front face artwork, A4 capacity (220 × 310 mm). */
const folderBody = `<div class="page" style="width:226mm;height:316mm;${darkSurface}
     flex-direction:column;justify-content:space-between;padding:26mm 22mm">
  ${lockup(150, "light")}
  <div>
    <div style="width:22mm;height:1.2mm;background:${P.GOLD};margin-bottom:9mm"></div>
    <div style="font-family:${P.DISPLAY};font-size:15mm;line-height:1.2;color:${P.BONE};max-width:150mm">
      Legal counsel built for how the world actually moves
    </div>
  </div>
  <div style="font-family:${P.SANS};font-size:3.6mm;line-height:6mm;color:rgba(227,225,217,.66)">
    ${a.line1}, ${a.line2}, ${a.city}, ${a.postalCode}<br>
    <span style="color:${P.GOLD}">${firm.domain}</span> &nbsp;·&nbsp; ${firm.email}
  </div>
</div>`;
save(O, "Presentation Folder", "presentation-folder-front-226x316mm.pdf",
  await renderPdf({ body: folderBody, css: officeCss, widthMm: 226, heightMm: 316 }));

/* Previews */
const prev = async (body, w, h, dir, file) =>
  save(O, dir, file, await renderPng({
    body, css: officeCss + "body{background:#fff}", selector: ".page",
    width: Math.round(w * 3.2), height: Math.round(h * 3.2), transparent: false, scale: 1,
  }));
await prev(doorBody, 300, 100, "Door Signs", "door-sign-preview.png");
await prev(signBody, 900, 300, "Office Signage", "reception-signage-preview.png");
await prev(folderBody, 226, 316, "Presentation Folder", "presentation-folder-preview.png");

await closeBrowser();
console.log("done");
