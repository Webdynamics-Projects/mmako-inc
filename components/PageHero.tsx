/**
 * Compact dark hero used on interior pages, so every page opens with the same
 * black band as the nav before dropping into light content.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  body,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  body?: string;
}) {
  return (
    <section className="surface-dark relative overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mb-6 flex items-center gap-3">
          <span className="rule-gold" aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-gold">
            {eyebrow}
          </span>
        </div>

        <h1 className="max-w-3xl text-[2.25rem] leading-[1.12] text-bone sm:text-5xl lg:text-[3.5rem]">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-6 max-w-2xl text-lg text-gold/90">{subtitle}</p>
        )}

        {body && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-bone-300/70">
            {body}
          </p>
        )}
      </div>

      <div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-gold/70 via-gold/15 to-transparent"
      />
    </section>
  );
}
