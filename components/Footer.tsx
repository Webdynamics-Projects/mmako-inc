import Link from "next/link";
import { Logo } from "@/components/Logo";
import { site, navLinks } from "@/lib/site";
import { services } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-dark border-t border-white/10 text-bone">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo variant="lockup" height={84} />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-bone-300/70">
              Legal counsel built for how the world actually moves — modern,
              practical, and grounded in sound legal principles.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-6 inline-flex items-center gap-2 text-sm text-gold transition-colors hover:text-gold-bright"
            >
              {site.email}
            </a>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <h2 className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-warm-grey-light">
              Navigate
            </h2>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-bone-300/75 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-warm-grey-light">
              Contact
            </h2>
            <address className="mt-5 space-y-4 text-sm not-italic leading-relaxed text-bone-300/75">
              <div>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-gold"
                >
                  {site.email}
                </a>
              </div>
              <div>
                {site.address.line1}
                <br />
                {site.address.line2}
                <br />
                {site.address.city}, {site.address.postalCode}
              </div>
            </address>

            <ul className="mt-6 space-y-2">
              {services.map((service) => (
                <li key={service.title}>
                  <Link
                    href="/services"
                    className="text-xs text-bone-300/65 transition-colors hover:text-gold"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-warm-grey-light sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p>{site.address.city}, {site.address.country}</p>
        </div>
      </div>
    </footer>
  );
}
