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
  address: {
    line1: "Regus Waterfall City, Maxwell Office Park",
    line2: "Ground Floor, Mac Mac Building",
    line3: "Magwa Cres, Waterfall City",
    city: "Midrand",
    postalCode: "2090",
    country: "South Africa",
  },
} as const;

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
