/**
 * Generates the written sections (01, 03, 04, 05) as markdown spec sheets, and
 * "10 - BRAND GUIDELINES" as the single combined PDF.
 */
import fs from "node:fs";
import path from "node:path";
import { firm, colours, typography, hexToRgb, hexToCmyk, contrast } from "./lib/tokens.mjs";
import * as S from "./lib/strategy.mjs";
import { renderPdf, renderPng, closeBrowser } from "./lib/render.mjs";
import * as P from "./lib/print.mjs";


const md = (dir, file, body) => {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, file), body);
  console.log("  ", path.join(dir, file));
};

const allColours = [...colours.primary, ...colours.secondary];
const spec = (c) => {
  const [r, g, b] = hexToRgb(c.hex);
  const [cy, m, y, k] = hexToCmyk(c.hex);
  return { hex: c.hex.toUpperCase(), rgb: `${r}, ${g}, ${b}`, cmyk: `${cy} / ${m} / ${y} / ${k}` };
};

/* ===================== 01 - BRAND STRATEGY ============================== */
console.log("01 - BRAND STRATEGY");
const D1 = path.join("brand", "01 - BRAND STRATEGY");

md(D1, "Brand Overview.md", `# Brand Overview\n\n${S.overview}\n
## At a glance

| | |
| --- | --- |
| Firm | ${firm.name} (${firm.legalName}) |
| Brand mark | ${firm.markName} |
| Descriptor | ${firm.tagline} |
| Sector | Business law — corporate advisory, commercial contracts, dispute resolution |
| Market | South Africa |
| Web | ${firm.url} |

## The naming rule

${S.namingRule}
`);

md(D1, "Brand Personality.md", `# Brand Personality

Four traits. Each is written as a pair, because a trait without its limit becomes a caricature.

${S.personality.map((p) => `## ${p.trait}

**It is:** ${p.is}

**It is not:** ${p.isNot}
`).join("\n")}`);

md(D1, "Brand Values.md", `# Brand Values

${S.values.map((v) => `## ${v.name} — *${v.line}*\n\n${v.body}\n`).join("\n")}
These four are not marketing copy. They are the standards the firm's work is measured against, and
they map directly to the philosophy published on the website.
`);

md(D1, "Positioning.md", `# Positioning

## Positioning statement

> ${S.positioning.statement.replace(/\n/g, "\n> ")}

## Who the brand is for

| Audience | What they need |
| --- | --- |
${S.positioning.audiences.map((a) => `| ${a.name} | ${a.need} |`).join("\n")}

## What sets the firm apart

${S.positioning.differentiators.map((d) => `- ${d}`).join("\n")}

## What the brand does not claim

The brand makes no claim to rankings, awards, accolades, firm size or years of experience. If the
firm earns those, they can be added — until then, no asset, post or document should imply them.
`);

md(D1, "Tone of Voice.md", `# Tone of Voice

## Five principles

${S.voice.principles.map((p, i) => `**${i + 1}. ${p.rule}**\n\n${p.why}\n`).join("\n")}
## Rewrites

${S.voice.rewrites.map((r) => `**Instead of:**\n\n> ${r.before}\n\n**Write:**\n\n> ${r.after}\n`).join("\n---\n\n")}
## Vocabulary

**Use:** ${S.voice.vocabulary.use.join(", ")}

**Avoid:** ${S.voice.vocabulary.avoid.join(", ")}
`);

/* ===================== 03 - COLOURS ===================================== */
console.log("03 - COLOURS");
const D3 = path.join("brand", "03 - COLOURS");

const colourTable = (list) => `| Colour | HEX | RGB | CMYK | Use |
| --- | --- | --- | --- | --- |
${list.map((c) => {
  const s = spec(c);
  return `| **${c.name}** | \`${s.hex}\` | ${s.rgb} | ${s.cmyk} | ${c.role} |`;
}).join("\n")}`;

md(D3, "Primary Palette.md", `# Primary Palette\n\n${colourTable(colours.primary)}\n
## How the primary palette is used

The brand runs on a dark/light rhythm: near-black chrome (header, footer, closing bands) against
bone content sections, with gold used only as an accent.

**Gold is never a large background fill.** It appears as thin rules, underlines, icon accents,
button fills and hover states. Used as a flood colour it reads gaudy and stops reading as premium.
`);

md(D3, "Secondary Palette.md", `# Secondary Palette\n\n${colourTable(colours.secondary)}\n
## Gold Deep exists for a reason

Mmako Gold on Bone gives a contrast ratio of **${contrast(colours.primary[1].hex, colours.primary[2].hex).toFixed(2)}:1** —
below the 4.5:1 WCAG AA minimum for body text, and below 3:1 for large text. It must never be used
for text on a light ground.

Gold Deep on Bone gives **${contrast(colours.secondary[0].hex, colours.primary[2].hex).toFixed(2)}:1**, which passes.
Use Gold Deep for any gold text on light surfaces. Mmako Gold is fine for text on dark grounds,
where it reaches **${contrast(colours.primary[1].hex, colours.primary[0].hex).toFixed(2)}:1**.
`);

md(D3, "Digital + Print Specifications.md", `# Digital + Print Specifications

## Full specification

${colourTable(allColours)}

## Print notes

${allColours.filter((c) => c.print).map((c) => `**${c.name}** — ${c.print}`).join("\n\n")}

## On CMYK values

The CMYK figures above are a direct arithmetic conversion from RGB. They are a correct starting
point for flat brand colours, but they are **not a colour-managed conversion** and will shift
between coated and uncoated stock.

Before any print run, ask the printer for a draw-down or wet proof of Mmako Gold on the actual
stock, and approve against that rather than against a screen.

## On Pantone

No Pantone references are specified here. Pantone matching requires a licensed colour library and a
physical guide under controlled lighting — supplying a guessed PMS number would be worse than
supplying none. Give your printer the HEX and CMYK values above and ask them to recommend the
closest Pantone for any spot-colour work.

## Accessibility reference

Contrast ratios against the two ground colours. Values of 4.5 or above pass WCAG AA for body text;
3.0 or above passes for large text (24px / 18pt and up).

| Colour | on Bone \`#FAFAF8\` | on Ink \`#0B0B0C\` |
| --- | --- | --- |
${allColours.map((c) => {
  const onBone = contrast(c.hex, colours.primary[2].hex);
  const onInk = contrast(c.hex, colours.primary[0].hex);
  const f = (v) => `${v.toFixed(2)}:1 ${v >= 4.5 ? "✅" : v >= 3 ? "⚠️ large text only" : "❌"}`;
  return `| ${c.name} | ${f(onBone)} | ${f(onInk)} |`;
}).join("\n")}
`);

/* ===================== 04 - TYPOGRAPHY ================================== */
console.log("04 - TYPOGRAPHY");
const D4 = path.join("brand", "04 - TYPOGRAPHY");
const face = (t) => `- **Family:** ${t.name}
- **Classification:** ${t.classification}
- **Licence:** ${t.licence}
- **Source:** ${t.source}
- **Used for:** ${t.use}
- **Web fallback stack:** \`${t.fallback}\`
- **Office / email stack:** \`${typography.office.stack}\``;

md(D4, "Primary Font.md", `# Primary Font — ${typography.primary.name}\n\n${face(typography.primary)}\n
## Why this face

Montserrat is the geometric sans the logo's own wordmark is set in, so the type
and the mark read as one thing rather than two decisions. The serif in the
identity lives where it belongs — in the monogram — and everything set in type
is Montserrat.

It is variable, covers 300 to 700 with true italics, and is free to embed in
documents and on the web.

## Setting rules

- Headings sit at **weight 600**. 700 reads as shouting; 500 goes limp at large sizes.
- Tracking is **tightened** on headings — −0.025em at display size, easing to −0.01em
  by H4. Montserrat is drawn loose by default and headings look gappy untracked.
- Body copy is **weight 400** with **1.75 line-height**. The face is wide and its
  x-height modest, so it needs more leading than a neo-grotesque would.
- Italic is reserved for emphasis inside a headline, as in the homepage hero.
- Never set body copy below 14px. Geometric sans loses legibility faster than a
  humanist face as it shrinks.
`);

md(D4, "Secondary Font.md", `# Secondary Font

There isn't one. **${typography.primary.name} carries the whole system** — headings and body,
screen and print.

A single family is a deliberate choice, not an omission. The identity already
carries contrast between the monogram's Didone serif and the wordmark's
geometric sans; adding a third voice in the running text would muddy it. Weight,
size and tracking do the work a second family would otherwise do.

## Weights in use

| Weight | Where |
| --- | --- |
| 600 | All headings, the eyebrow label at 500 |
| 400 | Body copy, tables, captions, UI |

## Word, Outlook and anything editable

Word and Outlook cannot load webfonts. Montserrat is free, so the fix is simple:

**Install Montserrat on every machine in the firm.** Download it from
[Google Fonts](${typography.primary.source}), unzip, select all the .ttf files, right-click →
Install. Documents then match the brand exactly.

Without it, the supplied templates fall back through this stack:

\`\`\`
${typography.office.stack}
\`\`\`

Century Gothic ships with Microsoft Office on both Windows and Mac and is the
closest geometric substitute. Arial is the last resort and is on everything.
`);

md(D4, "Typography Hierarchy.md", `# Typography Hierarchy

All ${typography.primary.name}. The levels differ by weight, size and tracking.

| Level | Weight | Screen | Print | Tracking | Use |
| --- | --- | --- | --- | --- | --- |
${typography.scale.map((s) =>
  `| **${s.level}** | ${s.weight} | ${s.web} | ${s.print} | ${s.tracking} | ${s.use} |`).join("\n")}

## Rules

- One Display or H1 per page. Never two.
- Heading levels are never skipped — an H3 always sits under an H2.
- The eyebrow label is not a heading. It labels the section that follows and carries no
  heading semantics in markup.
- Body copy is never centred over more than two lines.
- Uppercase is always tracked. Montserrat's caps are wide already; set without
  added tracking they look accidental rather than deliberate.
`);

/* ===================== 05 - VISUAL SYSTEM =============================== */
console.log("05 - VISUAL SYSTEM");
const D5 = path.join("brand", "05 - VISUAL SYSTEM");

md(D5, "Graphic Elements.md", `# Graphic Elements

The visual system is deliberately small. Four elements carry it.

## 1. The gold hairline

A 1–2px gold rule, 28–40px long, set above a section heading or beneath a logo. It is the brand's
most-used device and its most restrained.

## 2. The diagonal

The angled stroke taken from the monogram's gold accent. Used sparingly as a large background
element, at low opacity, never as decoration on top of content.

## 3. The dark surface

Near-black with two soft gold radial glows and a faint 72px grid. This is what gives dark sections
depth in the absence of photography. It is defined in \`app/globals.css\` as \`.surface-dark\` and
reproduced in the social and office templates.

## 4. Generous whitespace

Space is an element, not leftover room. Sections carry 80–128px of vertical padding on screen and
20–26mm on print. Resist filling it.

## What the system does not use

Drop shadows, gradients as decoration, rounded corners above 2px, stock illustration, gavels,
scales of justice, columns, or any other legal cliché.
`);

md(D5, "Iconography.md", `# Iconography

- **Style:** line only, never filled
- **Stroke:** 1.25px on a 24×24 grid, round caps and joins
- **Colour:** inherits the surrounding text colour; gold only when the icon is the accent
- **Construction:** geometric — circles, straight lines and simple arcs

Icons are drawn, not sourced. The site's set lives in \`components/Icons.tsx\` and covers clarity,
commercial judgment, speed, advocacy and directional arrows. Extend that set in the same style
rather than importing an off-the-shelf icon library, which will not match the stroke weight.

Never use filled, duotone or cartoon icons. They break the restraint the rest of the system depends on.
`);

md(D5, "Photography Style.md", `# Photography Style

**The firm has no photography yet.** Until it does, the brand deliberately uses no imagery rather
than stock photography — the abstract gold-line figure and textured dark surface stand in.

When photography is commissioned, it should follow this direction:

## Direction

- **Natural light.** Available light, no hard flash, no studio gloss.
- **Architectural and environmental.** The office, the city, working surfaces. People at work
  rather than posed against a backdrop.
- **Muted and warm.** Desaturated, warm-neutral grade that sits with bone and near-black. Gold may
  appear in the scene but is never added in post.
- **Unposed.** Mid-conversation, mid-work. No folded arms, no handshakes, no boardroom stock poses.
- **Room to breathe.** Compose with negative space so type can sit over the image.

## Never

Gavels, scales of justice, law libraries, stock handshakes, skylines with lens flare, or any image
that could appear on a competitor's site.

## Treatment

Images on dark sections carry a near-black overlay at 55–70% so text stays legible. Never place
text over an untreated photograph.
`);

md(D5, "Layout Guidelines.md", `# Layout Guidelines

## Grid

- **Screen:** 12 columns, max content width 1152px, 20px gutters at mobile and 32px from tablet up.
- **Print (A4):** single column, 20mm margins, 170mm live text width.

## Composition

- **Asymmetric by default.** Headings sit left in a 4–5 column block with content in the remaining
  7–8. Centred layouts are reserved for single-purpose moments.
- **Dark/light rhythm.** Sections alternate between bone, bone-200 and dark surfaces. Never place
  two dark sections adjacent without a light band between them.
- **One idea per band.** If a section needs two headings, it is two sections.

## Spacing scale

Use multiples of 4px on screen: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.

## Responsive

Mobile-first. Multi-column grids collapse to a single column below 640px. Nothing scrolls
horizontally except tables, diagrams and code, each inside its own scroll container.
`);

/* ===================== 10 - BRAND GUIDELINES ============================ */
console.log("10 - BRAND GUIDELINES");
const D10 = path.join("brand", "10 - BRAND GUIDELINES");
fs.mkdirSync(D10, { recursive: true });

const gCss = P.baseCss + `
  @page{size:210mm 297mm;margin:0}
  .page{width:210mm;height:297mm;padding:22mm 20mm;position:relative;page-break-after:always;
        display:flex;flex-direction:column}
  .page:last-child{page-break-after:auto}
  .pnum{position:absolute;right:20mm;bottom:12mm;font-size:7pt;color:${P.GREY}}
  .sec{position:absolute;left:20mm;bottom:12mm;font-size:7pt;letter-spacing:.14em;
       text-transform:uppercase;color:${P.GOLD_DEEP}}
  h1{font-size:26pt;line-height:30pt;margin-bottom:5mm}
  h2{font-size:14pt;margin:8mm 0 3mm}
  h3{font-size:10.5pt;margin:6mm 0 2mm}
  p,li{font-size:9pt;line-height:15pt;color:#2A2A2C}
  ul{margin:0 0 3mm;padding-left:5mm}
  .lead{font-size:11pt;line-height:18pt;color:${P.GREY}}
  .sw{height:26mm;border:.5pt solid rgba(0,0,0,.08)}
  .swl{font-size:7pt;line-height:10.5pt;color:${P.GREY};padding-top:2mm}
  .swn{font-family:${P.SANS};font-size:8.5pt;font-weight:600;color:${P.INK}}
  .tbl{width:100%;margin-top:3mm}
  .tbl th{font-size:6.5pt;letter-spacing:.12em;text-transform:uppercase;color:${P.BONE};
          background:${P.INK};padding:2mm 2.5mm;text-align:left}
  .tbl td{padding:2mm 2.5mm;border-bottom:.5pt solid ${P.RULE};font-size:8pt;vertical-align:top}
  .do{border-left:2pt solid #3F7D4E;padding-left:4mm;margin-bottom:3mm}
  .dont{border-left:2pt solid #A33A3A;padding-left:4mm;margin-bottom:3mm}
  .note{background:${P.BONE_200};padding:5mm;font-size:8pt;line-height:13.5pt;margin-top:4mm}
`;

let pageNo = 0;
const pg = (section, inner) => {
  pageNo++;
  return `<div class="page">${inner}
    <div class="sec">${section}</div><div class="pnum">${pageNo}</div></div>`;
};

const swatch = (c) => {
  const s = spec(c);
  return `<td style="padding:0 3mm 6mm 0;vertical-align:top;width:25%">
    <div class="sw" style="background:${c.hex}"></div>
    <div class="swn" style="padding-top:2mm">${c.name}</div>
    <div class="swl">${s.hex}<br>RGB ${s.rgb}<br>CMYK ${s.cmyk}</div>
  </td>`;
};

const rows = (list, per = 4) => {
  const out = [];
  for (let i = 0; i < list.length; i += per) {
    out.push(`<tr>${list.slice(i, i + per).map(swatch).join("")}</tr>`);
  }
  return `<table style="width:100%">${out.join("")}</table>`;
};

const cover = `<div class="page" style="background-color:${P.INK};
  background-image:radial-gradient(ellipse 80% 60% at 75% 0%, rgba(183,150,94,.18), transparent 60%);
  justify-content:space-between;padding:26mm 22mm">
  <div style="display:flex;flex-direction:column;align-items:flex-start">
    ${P.logoImg("lockup", "light", 62, "mm")}
  </div>
  <div>
    <div style="width:26mm;height:1.2mm;background:${P.GOLD};margin-bottom:8mm"></div>
    <div style="font-family:${P.DISPLAY};font-size:30pt;line-height:34pt;color:${P.BONE}">
      Brand Guidelines</div>
    <div style="font-family:${P.SANS};font-size:10pt;color:rgba(227,225,217,.65);margin-top:5mm">
      ${firm.name} &nbsp;·&nbsp; Version 1.2 &nbsp;·&nbsp; ${new Date().toLocaleDateString("en-ZA", { month: "long", year: "numeric" })}
    </div>
  </div>
</div>`;

const body = [
  cover,

  pg("01 — Brand Strategy", `<h1>Brand overview</h1>
    <p class="lead">${S.overview.split("\n\n")[0]}</p>
    <p style="margin-top:4mm">${S.overview.split("\n\n")[1]}</p>
    <h2>The naming rule</h2>
    ${S.namingRule.split("\n\n").map((p) => `<p>${p}</p>`).join("")}
    <div class="note"><strong>Open item.</strong> This rule assumes "Mmako Law" is the brand mark and
    "Mmako Inc." the written name. Confirm before this document is circulated.</div>`),

  pg("01 — Brand Strategy", `<h1>Personality</h1>
    <p class="lead">Four traits. Each is written as a pair, because a trait without its limit
    becomes a caricature.</p>
    ${S.personality.map((p) => `<h3>${p.trait}</h3>
      <div class="do"><p><strong>Is:</strong> ${p.is}</p></div>
      <div class="dont"><p><strong>Is not:</strong> ${p.isNot}</p></div>`).join("")}`),

  pg("01 — Brand Strategy", `<h1>Values</h1>
    ${S.values.map((v) => `<h3>${v.name} — <em style="color:${P.GOLD_DEEP}">${v.line}</em></h3>
      <p>${v.body}</p>`).join("")}
    <h2>Positioning</h2>
    <p style="border-left:2pt solid ${P.GOLD};padding-left:5mm">${S.positioning.statement}</p>
    <h2>What the brand does not claim</h2>
    <p>No rankings, awards, accolades, firm size or years of experience. If the firm earns those they
    can be added — until then no asset should imply them.</p>`),

  pg("01 — Brand Strategy", `<h1>Tone of voice</h1>
    ${S.voice.principles.map((p, i) => `<h3>${i + 1}. ${p.rule}</h3><p>${p.why}</p>`).join("")}
    <h2>Rewrites</h2>
    ${S.voice.rewrites.slice(0, 2).map((r) => `
      <div class="dont"><p>${r.before}</p></div>
      <div class="do"><p>${r.after}</p></div>`).join("")}
    <h2>Vocabulary</h2>
    <div class="do"><p><strong>Use:</strong> ${S.voice.vocabulary.use.join(", ")}</p></div>
    <div class="dont"><p><strong>Avoid:</strong> ${S.voice.vocabulary.avoid.join(", ")}</p></div>`),

  pg("02 — Logo", `<h1>The logo</h1>
    <p class="lead">The primary logo is the stacked lockup: monogram, wordmark, gold rule.</p>
    <table style="width:100%;margin-top:6mm"><tr>
      <td style="width:50%;padding-right:4mm;vertical-align:top">
        <div style="background:${P.BONE_200};padding:10mm;display:flex;justify-content:center">
          ${P.logoImg("lockup", "dark", 44, "mm")}
        </div>
        <p style="font-size:7.5pt;color:${P.GREY};padding-top:2mm">Primary — on light</p>
      </td>
      <td style="width:50%;vertical-align:top">
        <div style="background:${P.INK};padding:10mm;display:flex;justify-content:center">
          ${P.logoImg("lockup", "light", 44, "mm")}
        </div>
        <p style="font-size:7.5pt;color:${P.GREY};padding-top:2mm">Primary — reversed</p>
      </td>
    </tr></table>
    <h2>Clear space</h2>
    <p>Keep clear space around the logo equal to the height of the monogram's bottom serif on all
    sides. Nothing — type, image edge or rule — enters that space.</p>
    <h2>Minimum size</h2>
    <ul>
      <li>Full lockup: 24mm wide in print, 120px on screen. Below that the wordmark stops reading.</li>
      <li>Monogram alone: 8mm in print, 32px on screen.</li>
    </ul>
    <h2>Which version to use</h2>
    <ul>
      <li><strong>Primary (stacked)</strong> — covers, letterhead, folders, signage, anywhere with vertical room.</li>
      <li><strong>Secondary (horizontal)</strong> — website header and any band under 60px tall.</li>
      <li><strong>Monogram</strong> — favicon, social avatar, email signature, stamps and small marks.</li>
      <li><strong>Black / White</strong> — single-colour print, embroidery, etching, faxes, newspaper.</li>
    </ul>`),

  pg("02 — Logo", `<h1>Logo misuse</h1>
    <p class="lead">Each of these breaks the mark. None of them is acceptable, in any medium.</p>
    <div class="dont"><p><strong>Do not</strong> stretch, squash or otherwise change the proportions.</p></div>
    <div class="dont"><p><strong>Do not</strong> recolour the mark. Gold and ink are fixed; the only
      alternatives are the supplied all-black and all-white versions.</p></div>
    <div class="dont"><p><strong>Do not</strong> retype the wordmark. MMAKO LAW appears only as the
      supplied artwork, never reset in a font.</p></div>
    <div class="dont"><p><strong>Do not</strong> add effects — shadows, glows, bevels, outlines or gradients.</p></div>
    <div class="dont"><p><strong>Do not</strong> rotate the logo or set it on an angle.</p></div>
    <div class="dont"><p><strong>Do not</strong> place the colour logo on a mid-tone background or a
      busy photograph. Use the reversed version on dark, and the dark version on light.</p></div>
    <div class="dont"><p><strong>Do not</strong> box the logo, or lock it up with another mark
      without clear space between them.</p></div>
    <div class="dont"><p><strong>Do not</strong> use the monogram and the full lockup together in
      the same composition.</p></div>`),

  pg("03 — Colours", `<h1>Primary palette</h1>
    <p class="lead">Three colours carry the brand. Everything else supports them.</p>
    ${rows(colours.primary, 3)}
    <h2>Secondary palette</h2>
    ${rows(colours.secondary, 4)}
    <div class="note"><strong>Gold is an accent, never a field.</strong> It appears as thin rules,
    underlines, icon accents, button fills and hover states. Flooded across a large area it stops
    reading as premium.</div>`),

  pg("03 — Colours", `<h1>Colour in use</h1>
    <h2>Contrast</h2>
    <p>Mmako Gold on Bone reaches only
    <strong>${contrast(colours.primary[1].hex, colours.primary[2].hex).toFixed(2)}:1</strong> — below the
    4.5:1 WCAG AA minimum. It must never be used for text on a light ground. Use Gold Deep instead,
    which reaches <strong>${contrast(colours.secondary[0].hex, colours.primary[2].hex).toFixed(2)}:1</strong>.
    On dark grounds Mmako Gold is fine, at
    <strong>${contrast(colours.primary[1].hex, colours.primary[0].hex).toFixed(2)}:1</strong>.</p>
    <table class="tbl">
      <tr><th>Colour</th><th>On Bone</th><th>On Ink</th><th>Safe as text on</th></tr>
      ${allColours.map((c) => {
        const ob = contrast(c.hex, colours.primary[2].hex);
        const oi = contrast(c.hex, colours.primary[0].hex);
        /* Graded per ground — a colour that passes on ink says nothing about
           whether it passes on bone, so the two are never merged. */
        const grade = (v) => v >= 4.5 ? "AA" : v >= 3 ? "large only" : "—";
        const safe = [
          ob >= 4.5 ? "Bone" : ob >= 3 ? "Bone (large)" : null,
          oi >= 4.5 ? "Ink" : oi >= 3 ? "Ink (large)" : null,
        ].filter(Boolean);
        return `<tr><td>${c.name}</td>
          <td>${ob.toFixed(2)}:1 &nbsp;<span style="color:${P.GREY}">${grade(ob)}</span></td>
          <td>${oi.toFixed(2)}:1 &nbsp;<span style="color:${P.GREY}">${grade(oi)}</span></td>
          <td>${safe.length ? safe.join(", ") : "Neither — non-text use only"}</td></tr>`;
      }).join("")}
    </table>
    <p style="font-size:7.5pt;color:${P.GREY};margin-top:2mm">AA = passes 4.5:1 for body text.
    "large only" = passes 3:1, so 24px / 18pt and above. "—" = not usable as text on that ground.</p>
    <h2>Print</h2>
    ${allColours.filter((c) => c.print).map((c) => `<p><strong>${c.name}</strong> — ${c.print}</p>`).join("")}
    <div class="note"><strong>CMYK values are arithmetic, not colour-managed.</strong> They will shift
    between coated and uncoated stock. Ask the printer for a draw-down of Mmako Gold on the actual
    stock and approve against that, not a screen. No Pantone references are specified — supplying a
    guessed PMS number would be worse than supplying none.</div>`),

  pg("04 — Typography", `<h1>Typography</h1>
    <p class="lead">One family carries the whole system. ${typography.primary.name} is the geometric
    sans the logo's own wordmark is set in, so the type and the mark read as one thing.</p>
    <table style="width:100%;margin:6mm 0"><tr>
      <td style="width:50%;padding-right:5mm;vertical-align:top">
        <div style="font-family:${P.DISPLAY};font-weight:600;letter-spacing:-.03em;
                    font-size:46pt;line-height:48pt;color:${P.INK}">Aa</div>
        <h3 style="margin-top:3mm">Weight 600 — headings</h3>
        <p style="font-size:8pt">Tracking tightened, −0.025em at display size easing to −0.01em by H4.
        Montserrat is drawn loose; headings look gappy untracked.</p>
      </td>
      <td style="width:50%;vertical-align:top">
        <div style="font-family:${P.SANS};font-weight:400;font-size:46pt;line-height:48pt;color:${P.INK}">Aa</div>
        <h3 style="margin-top:3mm">Weight 400 — body</h3>
        <p style="font-size:8pt">1.75 line-height on screen. The face is wide with a modest
        x-height, so it needs more leading than a neo-grotesque.</p>
      </td>
    </tr></table>
    <p style="font-size:8pt;color:${P.GREY}">${typography.primary.classification} &nbsp;·&nbsp;
      ${typography.primary.licence}</p>
    <h2>Hierarchy</h2>
    <table class="tbl">
      <tr><th>Level</th><th>Weight</th><th>Screen</th><th>Print</th><th>Tracking</th><th>Use</th></tr>
      ${typography.scale.map((s) => `<tr><td><strong>${s.level}</strong></td><td>${s.weight}</td>
        <td>${s.web}</td><td>${s.print}</td><td>${s.tracking}</td><td>${s.use}</td></tr>`).join("")}
    </table>
    <div class="note"><strong>There is no second family.</strong> The identity already carries
    contrast between the monogram's Didone serif and the wordmark's geometric sans — a third voice
    in the running text would muddy it. Weight, size and tracking do the work a second family
    would otherwise do.<br><br>
    <strong>Word and Outlook cannot load webfonts.</strong> Montserrat is free, so install it on
    every machine in the firm and documents match the brand exactly. Without it the supplied
    templates fall back through <code>${typography.office.stack}</code> — Century Gothic ships with
    Office on Windows and Mac; Arial is on everything.</div>`),

  pg("05 — Visual System", `<h1>Visual system</h1>
    <p class="lead">The system is deliberately small. Four elements carry it.</p>
    <h3>1. The gold hairline</h3>
    <p>A 1–2px gold rule, 28–40px long, above a section heading or beneath a logo. The most-used
    device and the most restrained.</p>
    <div style="width:34px;height:2px;background:${P.GOLD};margin:3mm 0 5mm"></div>
    <h3>2. The diagonal</h3>
    <p>The angled stroke from the monogram's gold accent, used sparingly as a large background
    element at low opacity. Never decoration on top of content.</p>
    <h3>3. The dark surface</h3>
    <p>Near-black with two soft gold radial glows and a faint 72px grid. This is what gives dark
    sections depth without photography.</p>
    <h3>4. Generous whitespace</h3>
    <p>Space is an element, not leftover room. 80–128px vertical padding on screen, 20–26mm in print.</p>
    <h2>Iconography</h2>
    <p>Line only, 1.25px stroke on a 24×24 grid, round caps and joins, geometric construction. Icons
    inherit the surrounding text colour. Never filled, duotone or cartoon.</p>
    <h2>Never</h2>
    <p>Drop shadows, decorative gradients, corner radii above 2px, stock illustration, gavels, scales
    of justice, columns, or any other legal cliché.</p>`),

  pg("05 — Visual System", `<h1>Photography</h1>
    <p class="lead">The firm has no photography yet. Until it does, the brand deliberately uses none
    rather than stock — the abstract gold-line figure and dark surface stand in.</p>
    <h2>Direction, when commissioned</h2>
    <ul>
      <li><strong>Natural light.</strong> Available light, no hard flash, no studio gloss.</li>
      <li><strong>Architectural and environmental.</strong> The office, the city, working surfaces.
        People at work rather than posed.</li>
      <li><strong>Muted and warm.</strong> Desaturated, warm-neutral grade that sits with bone and
        near-black. Gold may appear in the scene but is never added in post.</li>
      <li><strong>Unposed.</strong> Mid-conversation, mid-work. No folded arms, no handshakes.</li>
      <li><strong>Room to breathe.</strong> Compose with negative space so type can sit over the image.</li>
    </ul>
    <h2>Never</h2>
    <p>Gavels, scales of justice, law libraries, stock handshakes, or any image that could appear on
    a competitor's site.</p>
    <h2>Layout</h2>
    <ul>
      <li><strong>Screen:</strong> 12 columns, 1152px max content width, 20–32px gutters.</li>
      <li><strong>Print:</strong> single column, 20mm margins, 170mm live text width.</li>
      <li><strong>Asymmetric by default.</strong> Headings left in 4–5 columns, content in the rest.</li>
      <li><strong>Dark/light rhythm.</strong> Never two dark sections adjacent.</li>
      <li><strong>Spacing:</strong> multiples of 4px — 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128.</li>
    </ul>`),

  pg("06–09 — Applications", `<h1>Applications</h1>
    <p class="lead">Every item below is supplied as a finished file in the kit. Anything the firm
    types into is supplied as an editable Word document; anything a printer produces is supplied as
    a print-ready PDF.</p>
    <h2>Stationery</h2>
    <table class="tbl">
      <tr><th>Item</th><th>Size</th><th>Format</th></tr>
      <tr><td>Letterhead</td><td>A4 — 210 × 297 mm</td><td><strong>Word (.docx)</strong> + PDF + PNG preview</td></tr>
      <tr><td>Document template</td><td>A4, with page numbers and heading styles</td><td><strong>Word (.docx)</strong></td></tr>
      <tr><td>Business card</td><td>90 × 50 mm trim, 96 × 56 mm with bleed</td><td>PDF, front and back</td></tr>
      <tr><td>Envelope</td><td>DL — 220 × 110 mm</td><td>PDF</td></tr>
      <tr><td>Compliment slip</td><td>210 × 99 mm</td><td>PDF</td></tr>
      <tr><td>Email signature</td><td>560 px wide</td><td>HTML + plain text, two variants</td></tr>
    </table>
    <h2>Legal documents</h2>
    <table class="tbl">
      <tr><th>Item</th><th>Format</th></tr>
      <tr><td>Legal letter template</td><td><strong>Word (.docx)</strong> + A4 PDF + PNG preview</td></tr>
      <tr><td>Legal opinion template</td><td><strong>Word (.docx)</strong> + A4 PDF + PNG preview</td></tr>
      <tr><td>Invoice</td><td><strong>Word (.docx)</strong> + A4 PDF + PNG preview</td></tr>
      <tr><td>Proposal / quotation</td><td><strong>Word (.docx)</strong> + A4 PDF + PNG preview</td></tr>
    </table>
    <h2>Digital</h2>
    <table class="tbl">
      <tr><th>Item</th><th>Size</th></tr>
      <tr><td>LinkedIn banner</td><td>1584 × 396 px</td></tr>
      <tr><td>LinkedIn profile image</td><td>400 × 400 px</td></tr>
      <tr><td>Social — quote card</td><td>1080 × 1080 px</td></tr>
      <tr><td>Social — announcement</td><td>1080 × 1080 px</td></tr>
      <tr><td>Social — portrait</td><td>1080 × 1350 px</td></tr>
      <tr><td>Email header</td><td>600 × 180 px</td></tr>
    </table>
    <h2>Office</h2>
    <table class="tbl">
      <tr><th>Item</th><th>Size</th></tr>
      <tr><td>Door sign</td><td>300 × 100 mm</td></tr>
      <tr><td>Reception signage</td><td>900 × 300 mm</td></tr>
      <tr><td>Presentation folder, front face</td><td>226 × 316 mm</td></tr>
    </table>`),

  pg("Open items", `<h1>Before this goes to print</h1>
    <p class="lead">Three things must be settled. Each affects finished artwork.</p>
    <div class="note" style="margin:0 0 6mm"><strong>Settled since version 1.1.</strong> The palette
    now takes its gold straight from the logo artwork — <strong>#B7965E</strong> — so the mark and
    everything around it finally agree. Gold Deep and Gold Bright were re-derived from it at the
    same hue. Separately, the whole type system moved to Montserrat, the geometric sans the logo's
    own wordmark is set in.</div>
    <h3>1. Mmako Law or Mmako Inc.</h3>
    <p>The naming rule on page 2 assumes the logo is the brand mark and Mmako Inc. the written name.
    Confirm it.</p>
    <h3>2. Company details are placeholders</h3>
    <p>Registration number, VAT number and banking details appear as bracketed placeholders on the
    letterhead, invoice and legal templates. Supply them before anything is printed or issued.</p>
    <h3>3. The confidentiality notice needs sign-off</h3>
    <p>The wording in the email signature is a reasonable general form. It has not been reviewed
    against the firm's professional-indemnity or Legal Practice Council obligations.</p>
    <div class="note">This document is version 1.2. Once the three items above are closed, reissue
    it as version 1.3 and circulate that as the governing version.</div>`),
].join("");

fs.writeFileSync(path.join(D10, "Mmako Inc. Brand Guidelines.pdf"),
  await renderPdf({ body, css: gCss, widthMm: 210, heightMm: 297 }));
console.log("   Mmako Inc. Brand Guidelines.pdf", `(${pageNo + 1} pages)`);

/* Optional page-by-page PNG dump, for reviewing the layout without a PDF reader. */
if (process.env.PREVIEW_DIR) {
  fs.mkdirSync(process.env.PREVIEW_DIR, { recursive: true });
  for (let i = 0; i <= pageNo; i++) {
    const buf = await renderPng({
      body, css: gCss + `.page:not(:nth-of-type(${i + 1})){display:none!important}`,
      selector: `.page:nth-of-type(${i + 1})`,
      width: 794, height: 1123, transparent: false, scale: 2,
    });
    fs.writeFileSync(path.join(process.env.PREVIEW_DIR, `page-${String(i + 1).padStart(2, "0")}.png`), buf);
  }
  console.log(`   ${pageNo + 1} page previews -> ${process.env.PREVIEW_DIR}`);
}

await closeBrowser();
console.log("done");
