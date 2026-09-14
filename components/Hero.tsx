import { Button } from "@/components/Button";
import { WhatsAppIcon } from "@/components/Icons";
import { whatsappHref } from "@/lib/site";

export function Hero() {
  return (
    <section className="surface-dark relative overflow-hidden">
      {/* Abstract gold-line accent — stands in for photography, which isn't
          available yet. TODO: replace with real photography or brand artwork. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 hidden h-[34rem] w-[34rem] -translate-y-1/2 opacity-[0.22] lg:block"
      >
        <svg viewBox="0 0 400 400" fill="none" className="h-full w-full">
          <circle cx="200" cy="200" r="150" stroke="#C9A227" strokeWidth="0.75" />
          <circle cx="200" cy="200" r="110" stroke="#C9A227" strokeWidth="0.75" />
          <circle cx="200" cy="200" r="70" stroke="#C9A227" strokeWidth="0.5" />
          <path d="M200 20v360" stroke="#C9A227" strokeWidth="0.5" />
          <path d="M20 200h360" stroke="#C9A227" strokeWidth="0.5" />
          <path
            d="M96 96l208 208M304 96L96 304"
            stroke="#C9A227"
            strokeWidth="0.5"
          />
          <rect
            x="128"
            y="128"
            width="144"
            height="144"
            stroke="#C9A227"
            strokeWidth="0.75"
            transform="rotate(45 200 200)"
          />
        </svg>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
        <div className="max-w-3xl">
          <div className="mb-7 flex items-center gap-3">
            <span className="rule-gold" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-gold">
              Modern Legal Partner
            </span>
          </div>

          <h1 className="text-[2.5rem] leading-[1.08] text-bone sm:text-6xl lg:text-[4.25rem]">
            Legal counsel built for{" "}
            <span className="italic text-gold">how business actually moves</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-bone-300/75 sm:text-lg">
            From first contract to first dispute, Mmako Inc. gives founders,
            growing companies, and individuals legal support that&apos;s clear,
            fast, and focused on outcomes.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button href="/contact" size="lg">
              Book a Consultation
            </Button>
            <Button href={whatsappHref} external variant="outline" size="lg">
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp Us
            </Button>
          </div>
        </div>
      </div>

      {/* Hairline that carries the gold accent into the section below. */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-gold/70 via-gold/15 to-transparent"
      />
    </section>
  );
}
