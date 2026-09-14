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
  email: "contact@mmakoinc.co.za",
  address: {
    line1: "4A Pioneer Road",
    line2: "Irene Security Estate",
    city: "Centurion",
    postalCode: "0157",
    country: "South Africa",
  },
} as const;

/** Canonical origin, used for metadata, sitemap and robots. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mmakoinc.co.za"
).replace(/\/$/, "");

/**
 * WhatsApp number in international format, digits only. Configured via
 * NEXT_PUBLIC_WHATSAPP_NUMBER; the placeholder keeps the UI intact in dev.
 */
export const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "27000000000";

export const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Hello Mmako Inc., I'd like to discuss a legal matter.",
)}`;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
] as const;
