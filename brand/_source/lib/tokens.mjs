/**
 * Single source of truth for the Mmako Inc. brand kit.
 *
 * Every template, spec sheet and generated asset reads from here, so a colour
 * or detail is changed in one place and the whole kit stays consistent.
 */

export const firm = {
  /* The logo artwork reads "MMAKO LAW" — that is the brand mark. "Mmako Inc."
     is the legal entity and the name used in all written copy. See the naming
     rule in the brand guidelines. */
  markName: "MMAKO LAW",
  name: "Mmako Inc.",
  legalName: "Mmako Incorporated",
  tagline: "Modern Legal Partner",
  domain: "mmakoinc.com",
  url: "https://mmakoinc.com",
  email: "contact@mmakoinc.com",
  address: {
    line1: "4A Pioneer Road",
    line2: "Irene Security Estate",
    city: "Centurion",
    postalCode: "0157",
    country: "South Africa",
  },
  /* TODO: supply before the stationery and invoice templates go to print. */
  registrationNumber: "[COMPANY REGISTRATION NO.]",
  vatNumber: "[VAT NO.]",
  banking: {
    bank: "[BANK]",
    accountName: "[ACCOUNT NAME]",
    accountNumber: "[ACCOUNT NUMBER]",
    branchCode: "[BRANCH CODE]",
  },
};

export const people = {
  director: {
    name: "Dalen Mmako",
    title: "Director",
    phone: "082 564 3345",
    phoneE164: "+27825643345",
    email: "dalen@mmakoinc.com",
  },
};

/**
 * The artwork's own colours, read straight out of the supplied logo file.
 *
 * These are facts about the logo, not choices. They differ from the brand
 * palette below, which is an open item — see the guidelines' last page.
 */
export const artwork = {
  ink: "#272725",
  gold: "#B7965E",
};

/**
 * Colours. `role` drives the spec sheets; `print` notes override the naive
 * CMYK conversion where a straight conversion would be wrong on press.
 */
export const colours = {
  primary: [
    {
      name: "Mmako Ink",
      hex: "#0B0B0C",
      role: "Primary dark. Headers, footers, body text on light grounds, and the base for all dark surfaces.",
      print:
        "For solid areas use a rich black build — C60 M50 Y40 K100. For text under 18pt use K100 only, to avoid registration fringing.",
    },
    {
      name: "Mmako Gold",
      hex: "#B7965E",
      role: "Brand accent, taken from the logo artwork itself. Rules, underlines, icon accents, button fills, the logo's diagonal. Never a large background fill.",
      print: "Read directly out of the supplied logo file, so it is the identity's true gold. Confirm against a printed draw-down — muted golds shift noticeably on uncoated stock.",
    },
    {
      name: "Bone",
      hex: "#FAFAF8",
      role: "Primary light ground. Page and section backgrounds.",
      print: "Do not print. Use the unprinted stock, or match to a warm white paper.",
    },
  ],
  secondary: [
    {
      name: "Gold Deep",
      hex: "#85693B",
      role: "Gold text on light grounds. Derived from Mmako Gold by darkening at a fixed hue until it clears 4.5:1 on Bone 200 — the brand gold itself reaches only 2.4:1 there, so it must never be used for text on a light surface.",
    },
    {
      name: "Gold Bright",
      hex: "#CFB78E",
      role: "Hover and active states on dark grounds only. A lift of Mmako Gold at the same hue.",
    },
    {
      name: "Warm Grey",
      hex: "#6B6A66",
      role: "Secondary body text, captions, labels on light grounds.",
    },
    {
      name: "Bone 200",
      hex: "#F1F0EB",
      role: "Alternating section grounds, table zebra striping, muted panels.",
    },
    {
      name: "Bone 300",
      hex: "#E3E1D9",
      role: "Hairlines and dividers on light grounds.",
    },
    {
      name: "Ink 800",
      hex: "#17171A",
      role: "Raised panels on dark grounds.",
    },
  ],
};

export const typography = {
  primary: {
    name: "Montserrat",
    classification: "Geometric sans, variable, with italics",
    licence: "SIL Open Font License 1.1 — free for commercial use, embeddable",
    source: "https://fonts.google.com/specimen/Montserrat",
    use: "Headlines, page titles, pull quotes. Weight 600, tracking tightened.",
    fallback: "'Segoe UI', system-ui, Arial, sans-serif",
  },
  secondary: {
    name: "Montserrat",
    classification: "The same family at body weights",
    licence: "SIL Open Font License 1.1 — free for commercial use, embeddable",
    source: "https://fonts.google.com/specimen/Montserrat",
    use: "Body copy, UI, labels, tables. Weight 400, generous leading.",
    fallback: "'Segoe UI', system-ui, Arial, sans-serif",
  },
  /* Word and Outlook cannot load webfonts. Montserrat is free, so the firm
     should install it locally — then documents match the brand exactly. The
     stack degrades to Century Gothic (a geometric face bundled with Office)
     and finally Arial. */
  office: {
    display: "Montserrat",
    body: "Montserrat",
    stack: "Montserrat, 'Century Gothic', Arial, sans-serif",
  },
  /*
   * Retuned for Montserrat. It is wider and has a smaller x-height relative to
   * its cap height than a neo-grotesque, so headings sit at 600 with tighter
   * tracking, and body copy takes more leading to keep the measure readable.
   */
  scale: [
    { level: "Display", weight: 600, web: "64px / 1.12", print: "32pt / 36pt", tracking: "-0.025em", use: "Homepage hero only" },
    { level: "H1", weight: 600, web: "52px / 1.18", print: "26pt / 31pt", tracking: "-0.025em", use: "Page titles" },
    { level: "H2", weight: 600, web: "44px / 1.15", print: "22pt / 26pt", tracking: "-0.02em", use: "Section headings" },
    { level: "H3", weight: 600, web: "28px / 1.3", print: "14pt / 18pt", tracking: "-0.02em", use: "Service and article titles" },
    { level: "H4", weight: 600, web: "18px / 1.45", print: "11pt / 16pt", tracking: "-0.01em", use: "Card titles" },
    { level: "Body Large", weight: 400, web: "18px / 1.75", print: "11pt / 17pt", tracking: "0", use: "Intros, standfirsts" },
    { level: "Body", weight: 400, web: "16px / 1.75", print: "10pt / 16pt", tracking: "0", use: "Default reading size" },
    { level: "Small", weight: 400, web: "14px / 1.65", print: "9pt / 14pt", tracking: "0", use: "Captions, table cells, footnotes" },
    { level: "Eyebrow", weight: 500, web: "12px / 1.4", print: "7.5pt / 11pt", tracking: "0.2em", use: "Uppercase section labels above headings" },
  ],
};

/** Naive RGB→CMYK. Correct for flat brand colours; not a colour-managed conversion. */
export function hexToCmyk(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return [0, 0, 0, 100];
  return [
    Math.round(((1 - r - k) / (1 - k)) * 100),
    Math.round(((1 - g - k) / (1 - k)) * 100),
    Math.round(((1 - b - k) / (1 - k)) * 100),
    Math.round(k * 100),
  ];
}

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** Relative luminance, for the contrast table in the colour spec. */
export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
