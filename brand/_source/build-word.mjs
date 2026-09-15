/**
 * Builds the editable Word templates.
 *
 * These are the documents the firm types into, so they are .docx rather than
 * PDF. Every one carries the same branded header and footer, and is set in
 * Montserrat — the brand family, which is free and should be installed on the
 * firm's machines. Word falls back to Century Gothic then Arial without it.
 */
import fs from "node:fs";
import path from "node:path";
import {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, Header, Footer, PageNumber, ShadingType,
  HeadingLevel, TabStopType, TabStopPosition,
} from "docx";
import { firm, people, colours, typography } from "./lib/tokens.mjs";

const a = firm.address;
const d = people.director;

const INK = colours.primary[0].hex.replace("#", "");
const GOLD = colours.primary[1].hex.replace("#", "");
const GOLD_DEEP = colours.secondary[0].hex.replace("#", "");
const GREY = colours.secondary[2].hex.replace("#", "");
const RULE = colours.secondary[4].hex.replace("#", "");
const PANEL = colours.secondary[3].hex.replace("#", "");
const FILL = "B9B7B0"; // placeholder text

/* Word cannot load webfonts, so these name the family directly. Montserrat is
   free — the firm should install it on their machines and these documents then
   match the brand exactly. Word falls back on its own if it is missing; the
   documented fallback is Century Gothic, then Arial. */
const SERIF = typography.office.display; // Montserrat, at heading weights
const SANS = typography.office.body;     // Montserrat, at body weight

const LOGO = fs.readFileSync(path.join("brand", "_source", "assets", "word-logo.png"));
const LOGO_W = 96;                       // px at 96dpi ≈ 25mm
const LOGO_H = Math.round(LOGO_W / 1.345); // the artwork's lockup ratio

const NONE = { style: BorderStyle.NONE, size: 0, color: "auto" };
const noBorders = { top: NONE, bottom: NONE, left: NONE, right: NONE };

/* --- small builders -------------------------------------------------------- */
const t = (text, o = {}) => new TextRun({
  text, font: o.font ?? SANS, size: o.size ?? 19, color: o.color ?? "2A2A2C",
  bold: o.bold, italics: o.italics, allCaps: o.caps, characterSpacing: o.spacing,
});

const p = (runs, o = {}) => new Paragraph({
  children: Array.isArray(runs) ? runs : [runs],
  alignment: o.align, heading: o.heading, spacing: { before: o.before ?? 0, after: o.after ?? 120 },
  border: o.border, shading: o.shading, indent: o.indent, tabStops: o.tabStops,
});

/** Placeholder the user types over. */
const fill = (text, o = {}) => t(text, { ...o, color: FILL });

/** Small uppercase gold label. */
const label = (text) => p(t(text, { size: 14, bold: true, caps: true, color: GOLD_DEEP, spacing: 28 }), { after: 60 });

/** A gold rule, drawn as a paragraph bottom border rather than a table. */
const goldRule = (width = 12) => new Paragraph({
  children: [t("")], spacing: { before: 60, after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: width, color: GOLD, space: 1 } },
  indent: { right: 8600 },
});

const hairline = () => new Paragraph({
  children: [t("")], spacing: { before: 0, after: 80 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 1 } },
});

const cell = (children, o = {}) => new TableCell({
  children, width: { size: o.width, type: WidthType.DXA }, borders: o.borders ?? noBorders,
  shading: o.shading, margins: o.margins, verticalAlign: o.valign,
  columnSpan: o.span,
});

const layoutTable = (rows, columnWidths) => new Table({
  rows, columnWidths, width: { size: columnWidths.reduce((x, y) => x + y, 0), type: WidthType.DXA },
  borders: noBorders,
});

/* --- header and footer ------------------------------------------------------ */
function header() {
  return new Header({
    children: [
      layoutTable([
        new TableRow({
          children: [
            cell([new Paragraph({
              children: [new ImageRun({
                type: "png", data: LOGO,
                transformation: { width: LOGO_W, height: LOGO_H },
              })],
              spacing: { after: 0 },
            })], { width: 3200 }),
            cell([
              p(t(a.line1, { size: 15, color: GREY }), { align: AlignmentType.RIGHT, after: 0 }),
              p(t(a.line2, { size: 15, color: GREY }), { align: AlignmentType.RIGHT, after: 0 }),
              p(t(`${a.city}, ${a.postalCode}`, { size: 15, color: GREY }), { align: AlignmentType.RIGHT, after: 0 }),
              p(t(firm.domain, { size: 15, color: GOLD_DEEP, bold: true }), { align: AlignmentType.RIGHT, after: 0 }),
            ], { width: 6000 }),
          ],
        }),
      ], [3200, 6000]),
      goldRule(),
    ],
  });
}

function footer({ pageNumbers = false } = {}) {
  const left = `${firm.legalName}  ·  Reg. ${firm.registrationNumber}  ·  VAT ${firm.vatNumber}`;
  const right = `Director: ${d.name}  ·  ${firm.email}`;
  return new Footer({
    children: [
      hairline(),
      new Paragraph({
        children: [
          t(left, { size: 13, color: GREY }),
          new TextRun({ text: "\t", font: SANS }),
          t(right, { size: 13, color: GREY }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 0 },
      }),
      ...(pageNumbers ? [new Paragraph({
        children: [t("Page ", { size: 13, color: GREY }),
          new TextRun({ children: [PageNumber.CURRENT], size: 13, color: GREY, font: SANS }),
          t(" of ", { size: 13, color: GREY }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 13, color: GREY, font: SANS })],
        alignment: AlignmentType.RIGHT, spacing: { before: 60, after: 0 },
      })] : []),
    ],
  });
}

/** Shared document shell: A4, 20mm margins, brand styles, branded header/footer. */
function doc(children, { pageNumbers = false, title } = {}) {
  return new Document({
    creator: firm.legalName,
    title: title ?? firm.name,
    description: `${firm.name} document template`,
    styles: {
      default: {
        document: { run: { font: SANS, size: 19, color: "2A2A2C" }, paragraph: { spacing: { line: 300 } } },
      },
      paragraphStyles: [
        { id: "Title", name: "Title", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: SERIF, size: 40, color: INK, bold: true }, paragraph: { spacing: { after: 160 } } },
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: SERIF, size: 26, color: INK, bold: true }, paragraph: { spacing: { before: 320, after: 120 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: SERIF, size: 22, color: INK, bold: true }, paragraph: { spacing: { before: 260, after: 100 }, outlineLevel: 1 } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: SANS, size: 19, color: INK, bold: true }, paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },          // A4
          margin: { top: 1985, right: 1134, bottom: 1418, left: 1134, header: 680, footer: 567 },
        },
      },
      headers: { default: header() },
      footers: { default: footer({ pageNumbers }) },
      children,
    }],
  });
}

/* --- document bodies -------------------------------------------------------- */
const signOff = () => [
  p(t("Yours faithfully,"), { before: 320 }),
  p(t(""), { after: 520 }),
  p(t(d.name, { font: SERIF, size: 22, color: INK, bold: true }), { after: 40 }),
  p(t(`${d.title}  |  ${firm.name}`, { size: 14, bold: true, caps: true, color: GOLD_DEEP, spacing: 28 })),
];

const addressDateBlock = () => layoutTable([
  new TableRow({
    children: [
      cell([
        label("Addressee"),
        p(fill("[Name]"), { after: 0 }), p(fill("[Company]"), { after: 0 }),
        p(fill("[Street]"), { after: 0 }), p(fill("[City, Postal Code]"), { after: 0 }),
      ], { width: 5600 }),
      cell([
        p(t("Date", { size: 14, bold: true, caps: true, color: GOLD_DEEP, spacing: 28 }), { align: AlignmentType.RIGHT, after: 60 }),
        p(fill("[DD Month YYYY]"), { align: AlignmentType.RIGHT, after: 160 }),
        p(t("Our Reference", { size: 14, bold: true, caps: true, color: GOLD_DEEP, spacing: 28 }), { align: AlignmentType.RIGHT, after: 60 }),
        p(fill("[REF]"), { align: AlignmentType.RIGHT, after: 0 }),
      ], { width: 3600 }),
    ],
  }),
], [5600, 3600]);

const dataTable = (headers, widths, rows) => new Table({
  columnWidths: widths,
  width: { size: widths.reduce((x, y) => x + y, 0), type: WidthType.DXA },
  rows: [
    new TableRow({
      tableHeader: true,
      children: headers.map((h, i) => cell(
        [p(t(h.text, { size: 13, bold: true, caps: true, color: "FAFAF8", spacing: 24 }),
           { align: h.align, after: 0 })],
        { width: widths[i], shading: { type: ShadingType.CLEAR, fill: INK, color: "auto" },
          margins: { top: 90, bottom: 90, left: 110, right: 110 } },
      )),
    }),
    ...rows.map((r) => new TableRow({
      children: r.map((c, i) => cell(
        [p(fill(c.text), { align: c.align, after: 0 })],
        { width: widths[i],
          borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 3, color: RULE } },
          margins: { top: 90, bottom: 90, left: 110, right: 110 } },
      )),
    })),
  ],
});

const R = AlignmentType.RIGHT;

/* 1. Letterhead — header and footer only, body left clear. */
const letterhead = () => [
  p(fill("[ Begin typing here. The header and footer are set — do not edit them. ]"), { before: 200 }),
];

/* 2. General document template — adds a title block, styles and page numbers. */
const template = () => [
  p(t("[Document title]", { font: SERIF, size: 40, color: INK, bold: true }), { after: 100 }),
  p(fill("[Subtitle or matter reference]"), { after: 320 }),
  p(t("Heading 1", { font: SERIF, size: 26, color: INK, bold: true }), { heading: HeadingLevel.HEADING_1 }),
  p(fill("[Body text. The Heading 1, 2 and 3 styles are set up in the Styles gallery, so a table of contents and the navigation pane both work.]")),
  p(t("Heading 2", { font: SERIF, size: 22, color: INK, bold: true }), { heading: HeadingLevel.HEADING_2 }),
  p(fill("[Body text.]")),
  p(t("Heading 3", { size: 19, bold: true, color: INK }), { heading: HeadingLevel.HEADING_3 }),
  p(fill("[Body text.]")),
];

/* 3. Legal letter */
const legalLetter = () => [
  addressDateBlock(),
  p(t(""), { after: 200 }),
  p([t("Dear ", { bold: true }), fill("[Name]", { bold: true })], { after: 200 }),
  p([t("RE: ", { bold: true, caps: true, spacing: 12 }), fill("[SUBJECT OF THE MATTER]", { bold: true, caps: true, spacing: 12 })], { after: 200 }),
  p(fill("[Opening paragraph — state who you act for and why you are writing, in one sentence.]")),
  p(fill("[Background — the facts relied on, in date order.]")),
  p(fill("[Legal position — the obligation, breach or entitlement, stated plainly.]")),
  p(fill("[What you require and by when — be specific about the action and the deadline.]")),
  p(fill("[Consequences of non-compliance, and reservation of rights.]")),
  p(t("All our client's rights remain strictly reserved."), { before: 120 }),
  ...signOff(),
];

/* 4. Legal opinion */
const legalOpinion = () => [
  new Table({
    columnWidths: [9200],
    width: { size: 9200, type: WidthType.DXA },
    borders: noBorders,
    rows: [new TableRow({
      children: [cell([
        p(t("Legal Opinion", { font: SERIF, size: 32, color: INK, bold: true }), { after: 160 }),
        layoutTable([new TableRow({
          children: [
            cell([label("Prepared for"), p(fill("[Client]"), { after: 0 })], { width: 3000 }),
            cell([label("Matter"), p(fill("[Matter reference]"), { after: 0 })], { width: 3000 }),
            cell([label("Date"), p(fill("[DD Month YYYY]"), { after: 0 })], { width: 2700 }),
          ],
        })], [3000, 3000, 2700]),
      ], { width: 9200, shading: { type: ShadingType.CLEAR, fill: PANEL, color: "auto" },
           margins: { top: 280, bottom: 280, left: 280, right: 280 } })],
    })],
  }),
  p(t(""), { after: 240 }),
  ...[
    ["1. Instructions", "[What you were asked to advise on, and by whom.]"],
    ["2. Documents considered", "[Numbered list of everything reviewed, with dates.]"],
    ["3. Factual background", "[The facts assumed to be correct, in date order. Flag any assumption.]"],
    ["4. Issues for determination", "[The questions this opinion answers, numbered.]"],
    ["5. Analysis", "[Law applied to facts, issue by issue, with authority.]"],
    ["6. Opinion", "[The conclusion on each issue, stated plainly and without hedging.]"],
    ["7. Recommended next steps", "[What the client should do, in order of priority.]"],
    ["8. Limitations", "[Scope, assumptions relied on, and that this opinion is for the addressee only.]"],
  ].flatMap(([h, b]) => [
    p(t(h, { font: SERIF, size: 22, color: INK, bold: true }), { heading: HeadingLevel.HEADING_2 }),
    p(fill(b)),
  ]),
  ...signOff(),
];

/* 5. Invoice */
const invoice = () => [
  layoutTable([new TableRow({
    children: [
      cell([
        label("Invoice to"),
        p(fill("[Client name]"), { after: 0 }), p(fill("[Company]"), { after: 0 }),
        p(fill("[Address]"), { after: 0 }), p(fill("VAT: [Client VAT no.]"), { after: 0 }),
      ], { width: 5000 }),
      cell([
        p(t("Invoice", { font: SERIF, size: 34, color: INK, bold: true }), { align: R, after: 160 }),
        ...[["Invoice no.", "[INV-0000]"], ["Date", "[DD/MM/YYYY]"],
            ["Due", "[DD/MM/YYYY]"], ["Matter", "[Matter ref]"]].map(([k, v]) =>
          p([t(`${k}   `, { size: 16, color: GREY }), fill(v, { size: 16 })], { align: R, after: 40 })),
      ], { width: 4200 }),
    ],
  })], [5000, 4200]),
  p(t(""), { after: 240 }),
  dataTable(
    [{ text: "Description" }, { text: "Date" }, { text: "Hours", align: R },
     { text: "Rate", align: R }, { text: "Amount (ZAR)", align: R }],
    [4200, 1200, 1100, 1300, 1400],
    Array.from({ length: 6 }, () => ([
      { text: "[Description of work]" }, { text: "[DD/MM]" },
      { text: "[0.0]", align: R }, { text: "[0.00]", align: R }, { text: "[0.00]", align: R },
    ])),
  ),
  p(t(""), { after: 160 }),
  new Table({
    columnWidths: [5400, 2400, 1400],
    width: { size: 9200, type: WidthType.DXA }, borders: noBorders,
    rows: [
      ...[["Subtotal", "[0.00]"], ["Disbursements", "[0.00]"], ["VAT @ 15%", "[0.00]"]].map(([k, v]) =>
        new TableRow({ children: [
          cell([p(t(""), { after: 0 })], { width: 5400 }),
          cell([p(t(k, { color: GREY }), { after: 0 })], { width: 2400, margins: { top: 60, bottom: 60 } }),
          cell([p(fill(v), { align: R, after: 0 })], { width: 1400, margins: { top: 60, bottom: 60 } }),
        ] })),
      new TableRow({ children: [
        cell([p(t(""), { after: 0 })], { width: 5400 }),
        cell([p(t("Total due", { bold: true, color: INK }), { after: 0 })],
          { width: 2400, margins: { top: 110, bottom: 110 },
            borders: { ...noBorders, top: { style: BorderStyle.SINGLE, size: 12, color: GOLD } } }),
        cell([p(fill("[0.00]", { bold: true }), { align: R, after: 0 })],
          { width: 1400, margins: { top: 110, bottom: 110 },
            borders: { ...noBorders, top: { style: BorderStyle.SINGLE, size: 12, color: GOLD } } }),
      ] }),
    ],
  }),
  p(t(""), { after: 300 }),
  new Table({
    columnWidths: [9200], width: { size: 9200, type: WidthType.DXA }, borders: noBorders,
    rows: [new TableRow({ children: [cell([
      label("Payment details"),
      /* A two-column table rather than padded text — space padding does not
         align in a proportional font. */
      layoutTable([["Bank", firm.banking.bank], ["Account name", firm.banking.accountName],
        ["Account number", firm.banking.accountNumber], ["Branch code", firm.banking.branchCode],
        ["Reference", "[Invoice number]"]].map(([k, v]) => new TableRow({
          children: [
            cell([p(t(k, { size: 16, color: GREY }), { after: 0 })], { width: 2400 }),
            cell([p(fill(v, { size: 16 }), { after: 0 })], { width: 6280 }),
          ],
        })), [2400, 6280]),
      p(t("Payment is due within 30 days of the invoice date unless otherwise agreed in writing.",
          { size: 15, color: GREY }), { before: 120, after: 0 }),
    ], { width: 9200, shading: { type: ShadingType.CLEAR, fill: PANEL, color: "auto" },
         margins: { top: 260, bottom: 260, left: 260, right: 260 } })] })],
  }),
];

/* 6. Proposal */
const proposal = () => [
  p(t("Proposal", { font: SERIF, size: 44, color: INK, bold: true }), { after: 60 }),
  p(fill("[Matter or engagement name]", { size: 22 }), { after: 240 }),
  layoutTable([new TableRow({
    children: [
      cell([label("Prepared for"), p(fill("[Client]"), { after: 0 })], { width: 3200 }),
      cell([label("Date"), p(fill("[DD Month YYYY]"), { after: 0 })], { width: 3000 }),
      cell([label("Valid until"), p(fill("[DD Month YYYY]"), { after: 0 })], { width: 3000 }),
    ],
  })], [3200, 3000, 3000]),
  p(t(""), { after: 200 }),
  ...[
    ["1. Your situation as we understand it", "[Restate the client's problem in their words. If this is wrong, nothing below holds.]"],
    ["2. What we propose to do", "[The work, broken into phases with what each delivers.]"],
    ["3. What is not included", "[Explicit exclusions — this is what prevents scope disputes later.]"],
  ].flatMap(([h, b]) => [
    p(t(h, { font: SERIF, size: 22, color: INK, bold: true }), { heading: HeadingLevel.HEADING_2 }),
    p(fill(b)),
  ]),
  p(t("4. Fees", { font: SERIF, size: 22, color: INK, bold: true }), { heading: HeadingLevel.HEADING_2 }),
  dataTable(
    [{ text: "Phase" }, { text: "Basis" }, { text: "Fee (ZAR, excl. VAT)", align: R }],
    [4600, 2600, 2000],
    Array.from({ length: 4 }, () => ([
      { text: "[Phase]" }, { text: "[Fixed / hourly / retainer]" }, { text: "[0.00]", align: R },
    ])),
  ),
  p(t(""), { after: 160 }),
  ...[
    ["5. Timing", "[Start date, key milestones, and what we need from the client to hold them.]"],
    ["6. Terms", "[Payment terms, disbursements, and how either side can end the engagement.]"],
  ].flatMap(([h, b]) => [
    p(t(h, { font: SERIF, size: 22, color: INK, bold: true }), { heading: HeadingLevel.HEADING_2 }),
    p(fill(b)),
  ]),
  hairline(),
  label("Accepted for and on behalf of the client"),
  p(t(""), { after: 400 }),
  layoutTable([
    new TableRow({ children: [
      cell([p(t(""), { after: 0 })], { width: 4200,
        borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: INK } } }),
      cell([p(t(""), { after: 0 })], { width: 800 }),
      cell([p(t(""), { after: 0 })], { width: 4200,
        borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: INK } } }),
    ] }),
    new TableRow({ children: [
      cell([p(t("Signature", { size: 14, color: GREY }), { after: 0 })], { width: 4200 }),
      cell([p(t(""), { after: 0 })], { width: 800 }),
      cell([p(t("Date", { size: 14, color: GREY }), { after: 0 })], { width: 4200 }),
    ] }),
  ], [4200, 800, 4200]),
];

/* --- write ------------------------------------------------------------------ */
const jobs = [
  ["06 - STATIONERY/Letterhead", "Mmako Inc - Letterhead.docx", letterhead(), { title: "Letterhead" }],
  ["06 - STATIONERY/Letterhead", "Mmako Inc - Document Template.docx", template(), { title: "Document template", pageNumbers: true }],
  ["07 - LEGAL DOCUMENTS/Legal Letter Template", "Mmako Inc - Legal Letter.docx", legalLetter(), { title: "Legal letter", pageNumbers: true }],
  ["07 - LEGAL DOCUMENTS/Legal Opinion Template", "Mmako Inc - Legal Opinion.docx", legalOpinion(), { title: "Legal opinion", pageNumbers: true }],
  ["07 - LEGAL DOCUMENTS/Invoice", "Mmako Inc - Invoice.docx", invoice(), { title: "Invoice" }],
  ["07 - LEGAL DOCUMENTS/Proposal - Quotation", "Mmako Inc - Proposal.docx", proposal(), { title: "Proposal", pageNumbers: true }],
];

console.log("Word templates");
for (const [dir, file, children, opts] of jobs) {
  const out = path.join("brand", dir);
  fs.mkdirSync(out, { recursive: true });
  const buf = await Packer.toBuffer(doc(children, opts));
  fs.writeFileSync(path.join(out, file), buf);
  console.log("  ", path.join(dir, file), `(${(buf.length / 1024).toFixed(0)} KB)`);
}
