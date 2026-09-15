"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import { navLinks } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  /* The mobile panel remembers which route it was opened on, so a route change
     closes it by derivation rather than by syncing state in an effect. */
  const [menu, setMenu] = useState({ open: false, path: pathname });
  const open = menu.open && menu.path === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile panel is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-ink transition-shadow duration-300",
        scrolled && "shadow-[0_1px_0_0_rgba(183,150,94,0.25)]",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8 sm:py-5"
      >
        <Logo height={38} priority />

        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative py-1 text-sm transition-colors duration-200",
                  isActive(link.href)
                    ? "text-gold"
                    : "text-bone-300/75 hover:text-bone",
                )}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300",
                    isActive(link.href) ? "w-full" : "w-0",
                  )}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="/contact" size="md">
            Book a Consultation
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMenu({ open: !open, path: pathname })}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="-mr-2 p-2 text-bone lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <path d="m6 6 12 12" />
                <path d="m18 6-12 12" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-white/10 bg-ink lg:hidden"
      >
        <ul className="mx-auto w-full max-w-6xl px-5 py-2 sm:px-8">
          {navLinks.map((link) => (
            <li key={link.href} className="border-b border-white/5 last:border-0">
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between py-4 text-base",
                  isActive(link.href) ? "text-gold" : "text-bone-300/80",
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="rule-gold" aria-hidden="true" />
                )}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mx-auto w-full max-w-6xl px-5 pb-6 pt-2 sm:px-8">
          <Button href="/contact" size="lg" className="w-full">
            Book a Consultation
          </Button>
        </div>
      </div>
    </header>
  );
}
