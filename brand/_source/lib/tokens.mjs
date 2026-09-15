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
      hex: "#C9A227",
      role: "Brand accent. Rules, underlines, icon accents, button fills, the logo's diagonal. Never a large background fill.",
      print: "Confirm against a printed draw-down — metallic-looking golds shift on uncoated stock.",
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
      hex: "#806517",
      role: "Gold text on light grounds. The brand gold fails WCAG AA contrast as small text — this is its accessible substitute.",
    },
    {
      name: "Gold Bright",
      hex: "#E0BC45",
      role: "Hover and active states on dark grounds only.",
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
    name: "Fraunces",
    classification: "High-contrast display serif, variable",
    licence: "SIL Open Font License 1.1 — free for commercial use, embeddable",
    source: "https://fonts.google.com/specimen/Fraunces",
    use: "Headlines, page titles, pull quotes, the typeset wordmark. Weight 500 by default.",
    fallback: "Georgia, 'Times New Roman', serif",
  },
  secondary: {
    name: "Inter",
    classification: "Neo-grotesque sans, variable",
    licence: "SIL Open Font License 1.1 — free for commercial use, embeddable",
    source: "https://fonts.google.com/specimen/Inter",
    use: "Body copy, UI, labels, tables, all long-form reading.",
    fallback: "Arial, Helvetica, sans-serif",
  },
  /* Office and email cannot rely on webfonts — Outlook in particular ignores
     them — so these substitutes are mandatory in those contexts. */
  office: {
    display: "Georgia",
    body: "Arial",
  },
  scale: [
    { level: "Display", font: "Fraunces", web: "68px / 1.08", print: "34pt / 36pt", tracking: "-0.02em", use: "Homepage hero only" },
    { level: "H1", font: "Fraunces", web: "44px / 1.15", print: "24pt / 28pt", tracking: "-0.02em", use: "Page titles" },
    { level: "H2", font: "Fraunces", web: "32px / 1.2", print: "18pt / 22pt", tracking: "-0.02em", use: "Section headings" },
    { level: "H3", font: "Fraunces", web: "22px / 1.3", print: "14pt / 18pt", tracking: "-0.01em", use: "Sub-headings, card titles" },
    { level: "Body Large", font: "Inter", web: "18px / 1.7", print: "11pt / 16pt", tracking: "0", use: "Intros, standfirsts" },
    { level: "Body", font: "Inter", web: "16px / 1.7", print: "10pt / 15pt", tracking: "0", use: "Default reading size" },
    { level: "Small", font: "Inter", web: "14px / 1.6", print: "9pt / 13pt", tracking: "0", use: "Captions, table cells, footnotes" },
    { level: "Eyebrow", font: "Inter", web: "12px / 1.4", print: "7.5pt / 11pt", tracking: "0.2em", use: "Uppercase section labels above headings" },
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
