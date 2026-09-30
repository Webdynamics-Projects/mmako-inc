/**
 * Single source of truth for site-wide details. Update here rather than
 * hunting through components.
 */

export const site = {
  name: "Mmako Inc.",
  legalName: "Mmako Incorporated",
  tagline: "Modern Legal Partner",
  description:
    "Mmako Inc. is a South African business law firm giving founders, growing companies and individuals legal support that is clear, fast and focused on outcomes.",
  email: "info@mmakoinc.com",
  /* Display form, and the E.164 form for `tel:` links. */
  phone: "+27 10 013 3400",
  phoneE164: "+27100133400",
  /* Listed in display order. `line3` is optional: the Pretoria address fits
     in two lines. */
  offices: [
    {
      name: "Midrand",
      address: {
        line1: "Regus Waterfall City, Maxwell Office Park",
        line2: "Ground Floor, Mac Mac Building",
        line3: "Magwa Cres, Waterfall City",
        city: "Midrand",
        postalCode: "2090",
        country: "South Africa",
      },
    },
    {
      name: "Pretoria",
      address: {
        line1: "4A Pioneer Road",
        line2: "Irene Security Estate",
        city: "Centurion",
        postalCode: "0157",
        country: "South Africa",
      },
    },
  ],
} as const;

export type Office = (typeof site.offices)[number];

/** An office's street lines, without the city and postal code. */
export function streetLines(office: Office): string[] {
  const a: { line1: string; line2: string; line3?: string } = office.address;
  return [a.line1, a.line2, a.line3].filter((l): l is string => Boolean(l));
}

/** Canonical origin, used for metadata, sitemap and robots. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mmakoinc.com"
).replace(/\/$/, "");

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
] as const;
