import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <section className="surface-dark">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start px-5 py-28 sm:px-8 sm:py-36">
        <span className="rule-gold" aria-hidden="true" />
        <p className="mt-6 text-xs uppercase tracking-[0.22em] text-gold">
          404
        </p>
        <h1 className="mt-4 max-w-xl text-[2.25rem] leading-[1.15] text-bone sm:text-5xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-bone-300/70">
          The link may be out of date, or the page may have moved. Head back to
          the homepage, or get in touch and we&apos;ll point you the right way.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="/" size="lg">
            Back to Home
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
