/** Generates "07 - LEGAL DOCUMENTS". */
import fs from "node:fs";
import path from "node:path";
import { firm, people } from "./lib/tokens.mjs";
import { monogramSvg } from "./lib/logo.mjs";
import { renderPdf, renderPng, closeBrowser } from "./lib/render.mjs";
import * as P from "./lib/print.mjs";

const OUT = path.join("brand", "07 - LEGAL DOCUMENTS");
const a = firm.address;
const d = people.director;
const monoInk = `data:image/svg+xml;base64,${Buffer.from(monogramSvg("colour", { ink: P.INK, gold: P.GOLD })).toString("base64")}`;

const save = (dir, file, buf) => {
  fs.mkdirSync(path.join(OUT, dir), { recursive: true });
  fs.writeFileSync(path.join(OUT, dir, file), buf);
  console.log("  ", path.join(dir, file));
};

const css = P.baseCss + `
  @page{size:210mm 297mm;margin:0}
  .page{width:210mm;min-height:297mm;padding:20mm 20mm 20mm}
  .doc{font-size:9.5pt;line-height:15.5pt;color:#2A2A2C}
  .doc h2{font-size:11pt;margin:7mm 0 2.5mm;color:${P.INK}}
  .doc p{margin:0 0 3.5mm}
  .fill{color:#B9B7B0}
  .lbl{font-size:7pt;letter-spacing:.14em;text-transform:uppercase;color:${P.GOLD_DEEP};font-weight:600}
  table td{padding:0;border:0;vertical-align:top}
  .data th{font-size:7pt;letter-spacing:.12em;text-transform:uppercase;color:${P.BONE};background:${P.INK};
     padding:2.5mm 3mm;text-align:left;font-weight:600}
  .data td{padding:2.5mm 3mm;border-bottom:.5pt solid ${P.RULE};font-size:9pt;vertical-align:top}
  .num{text-align:right;white-space:nowrap}
`;

/** Every document opens with the same masthead. */
const head = () => `<table width="100%" style="margin-bottom:8mm"><tr>
  <td style="vertical-align:top">
    <img src="${monoInk}" style="height:15mm;width:auto;display:block">
    <div style="font-family:${P.SANS};font-weight:320;letter-spacing:.26em;text-indent:.26em;
                font-size:3mm;color:${P.INK};margin-top:3mm;white-space:nowrap">MMAKO LAW</div>
  </td>
  <td style="vertical-align:top;text-align:right;font-size:7.5pt;line-height:12pt;color:${P.GREY}">
    ${a.line1}<br>${a.line2}<br>${a.city}, ${a.postalCode}<br>
    <span style="color:${P.GOLD_DEEP};font-weight:600">${firm.domain}</span>
  </td>
</tr></table>
<hr class="rule-gold" style="margin:0 0 9mm;width:28mm">`;

const foot = () => `<div style="margin-top:12mm;padding-top:4mm;border-top:.5pt solid ${P.RULE};
     font-size:6.5pt;line-height:10pt;color:${P.GREY}">
  ${firm.legalName} &nbsp;·&nbsp; Reg. ${firm.registrationNumber} &nbsp;·&nbsp; VAT ${firm.vatNumber}
  &nbsp;·&nbsp; Director: ${d.name} &nbsp;·&nbsp; ${firm.email}
</div>`;

const signOff = () => `<div style="margin-top:10mm">
  <p>Yours faithfully,</p>
  <div style="height:16mm"></div>
  <div style="font-family:${P.DISPLAY};font-size:11pt;color:${P.INK}">${d.name}</div>
  <div class="lbl" style="padding-top:1mm">${d.title} &nbsp;|&nbsp; ${firm.name}</div>
</div>`;

const page = (inner) => `<div class="page"><div class="doc">${head()}${inner}${foot()}</div></div>`;

/** Writes the print-ready PDF and a PNG preview of the same artwork. */
async function emit(dir, name, body) {
  save(dir, `${name}.pdf`, await renderPdf({ widthMm: 210, heightMm: 297, css, body }));
  save(dir, `${name}-preview.png`, await renderPng({
    body, css: css + "body{background:#fff}", selector: ".page",
    width: 794, height: 1123, transparent: false, scale: 2,
  }));
}

console.log("07 - LEGAL DOCUMENTS");

/* --- Legal letter --------------------------------------------------------- */
await emit("Legal Letter Template", "legal-letter-template", page(`
    <table width="100%" style="margin-bottom:7mm"><tr>
      <td style="vertical-align:top;width:60%">
        <div class="lbl">Addressee</div>
        <p class="fill" style="padding-top:2mm">[Name]<br>[Company]<br>[Street]<br>[City, Postal Code]</p>
      </td>
      <td style="vertical-align:top;text-align:right">
        <div class="lbl">Date</div><p class="fill" style="padding-top:2mm">[DD Month YYYY]</p>
        <div class="lbl" style="padding-top:3mm">Our Reference</div><p class="fill" style="padding-top:2mm">[REF]</p>
      </td>
    </tr></table>

    <p><strong>Dear <span class="fill">[Name]</span></strong></p>
    <h2 style="text-transform:uppercase;font-family:${P.SANS};font-size:9pt;letter-spacing:.06em">
      RE: <span class="fill">[SUBJECT OF THE MATTER]</span></h2>

    <p class="fill">[Opening paragraph — state who you act for and why you are writing, in one sentence.]</p>
    <p class="fill">[Background — the facts relied on, in date order.]</p>
    <p class="fill">[Legal position — the obligation, breach or entitlement, stated plainly.]</p>
    <p class="fill">[What you require and by when — be specific about the action and the deadline.]</p>
    <p class="fill">[Consequences of non-compliance, and reservation of rights.]</p>

    <p style="padding-top:2mm">All our client's rights remain strictly reserved.</p>
    ${signOff()}`));

/* --- Legal opinion -------------------------------------------------------- */
await emit("Legal Opinion Template", "legal-opinion-template", page(`
    <div style="background:${P.BONE_200};padding:6mm;margin-bottom:7mm">
      <div style="font-family:${P.DISPLAY};font-size:16pt;color:${P.INK}">Legal Opinion</div>
      <table width="100%" style="margin-top:4mm;font-size:8pt;line-height:13pt">
        <tr><td style="border:0;padding:0 6mm 0 0"><span class="lbl">Prepared for</span><br>
            <span class="fill">[Client]</span></td>
          <td style="border:0;padding:0 6mm 0 0"><span class="lbl">Matter</span><br>
            <span class="fill">[Matter reference]</span></td>
          <td style="border:0;padding:0"><span class="lbl">Date</span><br>
            <span class="fill">[DD Month YYYY]</span></td></tr>
      </table>
    </div>

    <h2>1. Instructions</h2>
    <p class="fill">[What you were asked to advise on, and by whom.]</p>
    <h2>2. Documents considered</h2>
    <p class="fill">[Numbered list of everything reviewed, with dates.]</p>
    <h2>3. Factual background</h2>
    <p class="fill">[The facts assumed to be correct, in date order. Flag any assumption.]</p>
    <h2>4. Issues for determination</h2>
    <p class="fill">[The questions this opinion answers, numbered.]</p>
    <h2>5. Analysis</h2>
    <p class="fill">[Law applied to facts, issue by issue, with authority.]</p>
    <h2>6. Opinion</h2>
    <p class="fill">[The conclusion on each issue, stated plainly and without hedging.]</p>
    <h2>7. Recommended next steps</h2>
    <p class="fill">[What the client should do, in order of priority.]</p>
    <h2>8. Limitations</h2>
    <p class="fill">[Scope, assumptions relied on, and that this opinion is for the addressee only.]</p>
    ${signOff()}`));

/* --- Invoice -------------------------------------------------------------- */
await emit("Invoice", "invoice-template", page(`
    <table width="100%" style="margin-bottom:7mm"><tr>
      <td style="vertical-align:top;width:55%">
        <div class="lbl">Invoice to</div>
        <p class="fill" style="padding-top:2mm">[Client name]<br>[Company]<br>[Address]<br>VAT: [Client VAT no.]</p>
      </td>
      <td style="vertical-align:top;text-align:right">
        <div style="font-family:${P.DISPLAY};font-size:17pt;color:${P.INK};padding-bottom:3mm">Invoice</div>
        <table style="margin-left:auto;font-size:8pt;line-height:13pt">
          <tr><td style="border:0;padding:0 4mm 0 0;color:${P.GREY}">Invoice no.</td>
              <td style="border:0;padding:0" class="fill">[INV-0000]</td></tr>
          <tr><td style="border:0;padding:0 4mm 0 0;color:${P.GREY}">Date</td>
              <td style="border:0;padding:0" class="fill">[DD/MM/YYYY]</td></tr>
          <tr><td style="border:0;padding:0 4mm 0 0;color:${P.GREY}">Due</td>
              <td style="border:0;padding:0" class="fill">[DD/MM/YYYY]</td></tr>
          <tr><td style="border:0;padding:0 4mm 0 0;color:${P.GREY}">Matter</td>
              <td style="border:0;padding:0" class="fill">[Matter ref]</td></tr>
        </table>
      </td>
    </tr></table>

    <table width="100%" class="data">
      <tr><th style="width:52%">Description</th><th>Date</th><th class="num">Hours</th>
          <th class="num">Rate</th><th class="num">Amount (ZAR)</th></tr>
      ${Array.from({ length: 5 }, () =>
        `<tr><td class="fill">[Description of work]</td><td class="fill">[DD/MM]</td>
             <td class="num fill">[0.0]</td><td class="num fill">[0.00]</td>
             <td class="num fill">[0.00]</td></tr>`).join("")}
    </table>

    <table style="margin:5mm 0 0 auto;width:78mm">
      <tr><td style="border:0;padding:1.5mm 0;color:${P.GREY}">Subtotal</td>
          <td class="num fill" style="border:0;padding:1.5mm 0">[0.00]</td></tr>
      <tr><td style="border:0;padding:1.5mm 0;color:${P.GREY}">Disbursements</td>
          <td class="num fill" style="border:0;padding:1.5mm 0">[0.00]</td></tr>
      <tr><td style="border:0;padding:1.5mm 0;color:${P.GREY}">VAT @ 15%</td>
          <td class="num fill" style="border:0;padding:1.5mm 0">[0.00]</td></tr>
      <tr><td style="border:0;border-top:1.5pt solid ${P.GOLD};padding:2.5mm 0;font-weight:700">Total due</td>
          <td class="num fill" style="border:0;border-top:1.5pt solid ${P.GOLD};padding:2.5mm 0;font-weight:700">
          [0.00]</td></tr>
    </table>

    <div style="background:${P.BONE_200};padding:5mm;margin-top:8mm">
      <div class="lbl">Payment details</div>
      <table style="margin-top:2.5mm;font-size:8pt;line-height:13pt">
        <tr><td style="border:0;padding:0 6mm 0 0;color:${P.GREY}">Bank</td>
            <td style="border:0;padding:0" class="fill">${firm.banking.bank}</td></tr>
        <tr><td style="border:0;padding:0 6mm 0 0;color:${P.GREY}">Account name</td>
            <td style="border:0;padding:0" class="fill">${firm.banking.accountName}</td></tr>
        <tr><td style="border:0;padding:0 6mm 0 0;color:${P.GREY}">Account number</td>
            <td style="border:0;padding:0" class="fill">${firm.banking.accountNumber}</td></tr>
        <tr><td style="border:0;padding:0 6mm 0 0;color:${P.GREY}">Branch code</td>
            <td style="border:0;padding:0" class="fill">${firm.banking.branchCode}</td></tr>
        <tr><td style="border:0;padding:0 6mm 0 0;color:${P.GREY}">Reference</td>
            <td style="border:0;padding:0" class="fill">[Invoice number]</td></tr>
      </table>
      <p style="margin:3mm 0 0;font-size:7.5pt;color:${P.GREY}">
        Payment is due within 30 days of the invoice date unless otherwise agreed in writing.</p>
    </div>`));

/* --- Proposal / quotation -------------------------------------------------- */
await emit("Proposal - Quotation", "proposal-template", page(`
    <div style="font-family:${P.DISPLAY};font-size:22pt;line-height:26pt;color:${P.INK};margin-bottom:2mm">
      Proposal</div>
    <p class="fill" style="font-size:11pt">[Matter or engagement name]</p>
    <table width="100%" style="margin:6mm 0 8mm;font-size:8pt;line-height:13pt">
      <tr><td style="border:0;padding:0 6mm 0 0"><span class="lbl">Prepared for</span><br>
          <span class="fill">[Client]</span></td>
        <td style="border:0;padding:0 6mm 0 0"><span class="lbl">Date</span><br>
          <span class="fill">[DD Month YYYY]</span></td>
        <td style="border:0;padding:0"><span class="lbl">Valid until</span><br>
          <span class="fill">[DD Month YYYY]</span></td></tr>
    </table>

    <h2>1. Your situation as we understand it</h2>
    <p class="fill">[Restate the client's problem in their words. If this is wrong, nothing below holds.]</p>
    <h2>2. What we propose to do</h2>
    <p class="fill">[The work, broken into phases with what each delivers.]</p>
    <h2>3. What is not included</h2>
    <p class="fill">[Explicit exclusions — this is what prevents scope disputes later.]</p>
    <h2>4. Fees</h2>
    <table width="100%" class="data" style="margin-top:3mm">
      <tr><th style="width:56%">Phase</th><th>Basis</th><th class="num">Fee (ZAR, excl. VAT)</th></tr>
      ${Array.from({ length: 4 }, () =>
        `<tr><td class="fill">[Phase]</td><td class="fill">[Fixed / hourly / retainer]</td>
             <td class="num fill">[0.00]</td></tr>`).join("")}
      <tr><td colspan="2" style="border:0;border-top:1.5pt solid ${P.GOLD};padding:2.5mm 3mm;font-weight:700">
          Total</td>
        <td class="num fill" style="border:0;border-top:1.5pt solid ${P.GOLD};padding:2.5mm 3mm;font-weight:700">
          [0.00]</td></tr>
    </table>
    <h2>5. Timing</h2>
    <p class="fill">[Start date, key milestones, and what we need from the client to hold them.]</p>
    <h2>6. Terms</h2>
    <p class="fill">[Payment terms, disbursements, and how either side can end the engagement.]</p>

    <div style="margin-top:9mm;padding-top:5mm;border-top:.5pt solid ${P.RULE}">
      <div class="lbl">Accepted for and on behalf of the client</div>
      <table width="100%" style="margin-top:7mm">
        <tr><td style="border:0;border-bottom:.5pt solid ${P.INK};width:46%;height:10mm"></td>
            <td style="border:0;width:8%"></td>
            <td style="border:0;border-bottom:.5pt solid ${P.INK};width:46%"></td></tr>
        <tr><td style="border:0;padding-top:1.5mm;font-size:7pt;color:${P.GREY}">Signature</td>
            <td style="border:0"></td>
            <td style="border:0;padding-top:1.5mm;font-size:7pt;color:${P.GREY}">Date</td></tr>
      </table>
    </div>`));

await closeBrowser();
console.log("done");
