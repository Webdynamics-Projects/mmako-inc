import { Button } from "@/components/Button";
import { Section } from "@/components/Section";

export function CtaBand({
  eyebrow,
  title,
  body,
  ctaLabel = "Get in touch",
  ctaHref = "/contact",
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <Section tone="dark" size="md">
      <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          {eyebrow && (
            <div className="mb-5 flex items-center gap-3">
              <span className="rule-gold" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                {eyebrow}
              </span>
            </div>
          )}
          <h2 className="text-3xl leading-[1.15] text-bone sm:text-4xl">
            {title}
          </h2>
          {body && (
            <p className="mt-4 text-base leading-relaxed text-bone-300/70">
              {body}
            </p>
          )}
        </div>
        <Button href={ctaHref} size="lg" className="shrink-0">
          {ctaLabel}
        </Button>
      </div>
    </Section>
  );
}
