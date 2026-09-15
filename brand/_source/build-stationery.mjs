/** Generates the print items in "06 - STATIONERY". */
import fs from "node:fs";
import path from "node:path";
import { firm, people } from "./lib/tokens.mjs";
import { renderPdf, renderPng, closeBrowser } from "./lib/render.mjs";
import * as P from "./lib/print.mjs";

const OUT = path.join("brand", "06 - STATIONERY");
const a = firm.address;

/* The supplied lockup, sized by height in millimetres. */
const lockup = (h, tone) => P.logoImg("lockup", tone === "dark" ? "dark" : "light", h, "mm");
const monoInk = P.monoUri("dark");

const save = (dir, file, buf) => {
  fs.mkdirSync(path.join(OUT, dir), { recursive: true });
  fs.writeFileSync(path.join(OUT, dir, file), buf);
  console.log("  ", path.join(dir, file));
};

console.log("06 - STATIONERY");

/* --- Letterhead — A4 210×297mm ------------------------------------------- */
const letterheadCss = P.baseCss + `
  @page{size:210mm 297mm;margin:0}
  .page{width:210mm;height:297mm;padding:22mm 20mm 18mm}
  .foot{position:absolute;left:20mm;right:20mm;bottom:12mm;font-size:7pt;line-height:11pt;color:${P.GREY}}
`;
const letterheadBody = `<div class="page">
  <table width="100%"><tr>
    <td style="vertical-align:top">${lockup(17, "dark")}</td>
    <td style="vertical-align:top;text-align:right;font-size:8pt;line-height:13pt;color:${P.GREY}">
      ${a.line1}<br>${a.line2}<br>${a.city}, ${a.postalCode}<br>
      <span style="color:${P.GOLD_DEEP};font-weight:600">${firm.domain}</span>
    </td>
  </tr></table>

  <hr class="rule-gold" style="margin:9mm 0 0;width:28mm">

  <!-- Body area. Content sits between the rule above and the footer below. -->
  <div style="min-height:185mm;padding-top:14mm;font-size:10pt;line-height:16pt;color:${P.GREY}">
    <span style="color:#B9B7B0">[ Letter body area — 210 × 297 mm, live text area 170 mm wide ]</span>
  </div>

  <div class="foot">
    <hr class="hair" style="margin:0 0 5mm">
    <table width="100%"><tr>
      <td>${firm.legalName} &nbsp;·&nbsp; Reg. ${firm.registrationNumber} &nbsp;·&nbsp; VAT ${firm.vatNumber}</td>
      <td style="text-align:right">Director: ${people.director.name} &nbsp;·&nbsp; ${firm.email}</td>
    </tr></table>
  </div>
</div>`;
save("Letterhead", "letterhead-a4.pdf",
  await renderPdf({ body: letterheadBody, css: letterheadCss, widthMm: 210, heightMm: 297 }));

/* --- Business card — 90×50mm plus 3mm bleed ------------------------------- */
const CARD_W = 96, CARD_H = 56; // 90×50 trim + 3mm bleed all round
const cardCss = P.baseCss + `
  @page{margin:0}
  .page{width:${CARD_W}mm;height:${CARD_H}mm;display:flex;align-items:center;justify-content:center;position:relative}
  /* Trim marks are for the printer's reference; the live area sits 5mm inside. */
  .trim{position:absolute;inset:3mm;border:.25pt dashed rgba(0,0,0,.25)}
`;
const cardFront = `<div class="page" style="background:${P.INK}">
  ${lockup(15, "light")}
</div>`;
const cardBack = `<div class="page" style="background:${P.BONE};display:block;padding:9mm 8mm">
  <div style="font-family:${P.DISPLAY};font-size:12pt;line-height:14pt;color:${P.INK}">${people.director.name}</div>
  <div class="eyebrow" style="padding-top:1.5mm">${people.director.title}</div>
  <hr class="rule-gold" style="margin:4mm 0;width:12mm">
  <div style="font-size:7.5pt;line-height:12pt;color:${P.GREY}">
    ${people.director.phone}<br>
    ${people.director.email}<br>
    <span style="color:${P.GOLD_DEEP};font-weight:600">${firm.domain}</span>
  </div>
  <div style="position:absolute;left:8mm;bottom:8mm;font-size:6.5pt;line-height:9.5pt;color:${P.GREY}">
    ${a.line1}, ${a.line2}<br>${a.city}, ${a.postalCode}
  </div>
</div>`;
save("Business Card", "business-card-front.pdf",
  await renderPdf({ body: cardFront, css: cardCss, widthMm: CARD_W, heightMm: CARD_H }));
save("Business Card", "business-card-back.pdf",
  await renderPdf({ body: cardBack, css: cardCss, widthMm: CARD_W, heightMm: CARD_H }));

/* --- Envelope — DL 220×110mm --------------------------------------------- */
const envCss = P.baseCss + `@page{margin:0}.page{width:220mm;height:110mm;padding:14mm 16mm}`;
const envBody = `<div class="page">
  <table><tr>
    <td style="vertical-align:middle;padding-right:8mm">
      <img src="${monoInk}" style="height:13mm;width:auto;display:block">
    </td>
    <td style="vertical-align:middle;border-left:1.5pt solid ${P.GOLD};padding-left:8mm;
               font-size:8pt;line-height:12.5pt;color:${P.GREY}">
      <span style="font-family:${P.DISPLAY};font-size:10pt;color:${P.INK}">${firm.name}</span><br>
      ${a.line1}, ${a.line2}<br>${a.city}, ${a.postalCode}
    </td>
  </tr></table>
  <!-- Recipient window area, kept clear of the return address. -->
  <div style="position:absolute;left:95mm;top:52mm;font-size:8pt;color:#C6C4BD">
    [ Recipient address area ]
  </div>
</div>`;
save("Envelope", "envelope-dl-220x110.pdf",
  await renderPdf({ body: envBody, css: envCss, widthMm: 220, heightMm: 110 }));

/* --- Compliment slip — 210×99mm (A4 in three) ----------------------------- */
const slipCss = P.baseCss + `@page{margin:0}.page{width:210mm;height:99mm;padding:14mm 20mm}`;
const slipBody = `<div class="page">
  <table width="100%"><tr>
    <td style="vertical-align:top">${lockup(13, "dark")}</td>
    <td style="vertical-align:top;text-align:right">
      <div style="font-family:${P.DISPLAY};font-size:15pt;color:${P.INK}">With Compliments</div>
    </td>
  </tr></table>
  <hr class="rule-gold" style="margin:7mm 0 0;width:22mm">
  <div style="position:absolute;left:20mm;right:20mm;bottom:11mm;font-size:7pt;line-height:11pt;color:${P.GREY}">
    <hr class="hair" style="margin:0 0 4mm">
    ${a.line1}, ${a.line2}, ${a.city}, ${a.postalCode}
    &nbsp;·&nbsp; ${firm.email}
    &nbsp;·&nbsp; <span style="color:${P.GOLD_DEEP};font-weight:600">${firm.domain}</span>
  </div>
</div>`;
save("Compliment Slip", "compliment-slip-210x99.pdf",
  await renderPdf({ body: slipBody, css: slipCss, widthMm: 210, heightMm: 99 }));

/* PNG previews, so the kit can be reviewed without opening every PDF. */
const preview = async (body, css, w, h, dir, file) =>
  save(dir, file, await renderPng({
    body, css: css + `body{background:#fff}`, selector: ".page",
    width: Math.round(w * 3.78), height: Math.round(h * 3.78), transparent: false, scale: 2,
  }));
await preview(letterheadBody, letterheadCss, 210, 297, "Letterhead", "letterhead-a4-preview.png");
await preview(cardFront, cardCss, CARD_W, CARD_H, "Business Card", "business-card-front-preview.png");
await preview(cardBack, cardCss, CARD_W, CARD_H, "Business Card", "business-card-back-preview.png");
await preview(slipBody, slipCss, 210, 99, "Compliment Slip", "compliment-slip-preview.png");
await preview(envBody, envCss, 220, 110, "Envelope", "envelope-preview.png");

await closeBrowser();
console.log("done");
