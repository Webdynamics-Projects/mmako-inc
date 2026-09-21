import { Button } from "@/components/Button";

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
          <circle cx="200" cy="200" r="150" stroke="#BB9B66" strokeWidth="0.75" />
          <circle cx="200" cy="200" r="110" stroke="#BB9B66" strokeWidth="0.75" />
          <circle cx="200" cy="200" r="70" stroke="#BB9B66" strokeWidth="0.5" />
          <path d="M200 20v360" stroke="#BB9B66" strokeWidth="0.5" />
          <path d="M20 200h360" stroke="#BB9B66" strokeWidth="0.5" />
          <path
            d="M96 96l208 208M304 96L96 304"
            stroke="#BB9B66"
            strokeWidth="0.5"
          />
          <rect
            x="128"
            y="128"
            width="144"
            height="144"
            stroke="#BB9B66"
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

          <h1 className="text-[2.375rem] leading-[1.12] text-bone sm:text-[3.25rem] lg:text-[4rem]">
            Legal counsel built for{" "}
            <span className="italic text-gold">how the world actually moves</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-bone-300/75 sm:text-lg">
            Mmako Inc. offers modern, practical legal counsel grounded in sound
            legal principles and a clear understanding of our clients&rsquo;
            needs.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button href="/contact" size="lg">
              Book a Consultation
            </Button>
            <Button href="/services" variant="outline" size="lg">
              Explore Our Services
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
