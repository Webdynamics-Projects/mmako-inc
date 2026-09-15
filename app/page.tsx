import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section, SectionHeader } from "@/components/Section";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ServiceCard } from "@/components/ServiceCard";
import { Reveal } from "@/components/Reveal";
import { iconMap } from "@/components/Icons";
import {
  valueStrip,
  clientTypes,
  services,
  whyMmako,
  process,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Modern Legal Partner",
  description:
    "Mmako Inc. gives founders, growing companies and individuals legal support that's clear, fast, and focused on outcomes. Business law, commercial contracts and dispute resolution in South Africa.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Mmako Inc. — Modern Legal Partner",
    description:
      "Legal counsel built for how business actually moves. Clear, fast, outcome-focused legal support.",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Value strip ------------------------------------------------------ */}
      <Section tone="light" size="sm">
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {valueStrip.map((value, i) => {
            const Icon = iconMap[value.icon];
            return (
              <Reveal key={value.label} index={i} as="li" className="flex flex-col">
                  <Icon className="h-6 w-6 text-gold-dim" />
                  <h2 className="mt-4 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-ink">
                    {value.label}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-warm-grey">
                    {value.detail}
                  </p>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      {/* Who we work with ------------------------------------------------- */}
      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeader
              eyebrow="Who we work with"
              title="Counsel matched to where you are"
            />
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
            {clientTypes.map((client, i) => (
              <Reveal key={client.title} index={i} as="li" className="h-full">
                <Card className="h-full">
                  <h3 className="text-lg leading-snug text-ink">
                    {client.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-warm-grey">
                    {client.detail}
                  </p>
                  <span
                    aria-hidden="true"
                    className="mt-6 block h-px w-8 bg-gold/50 transition-all duration-300 group-hover:w-14"
                  />
                </Card>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* Services teaser --------------------------------------------------- */}
      <Section tone="light">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Services"
            title="Focused expertise, applied where it matters"
            subtitle="Targeted legal support to protect and grow your interests."
          />
          <Button href="/services" variant="ghost" className="shrink-0 self-start px-0 sm:self-auto">
            View All Services →
          </Button>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {services.map((service, i) => (
            <Reveal key={service.title} index={i} className="h-full">
              <ServiceCard
                number={service.number}
                title={service.title}
                description={service.description}
                items={service.items}
                maxItems={3}
                href="/services"
              />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Why Mmako Inc ----------------------------------------------------- */}
      <Section tone="dark" size="sm">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Why Mmako Inc."
              title="What working with us looks like"
              tone="dark"
            />
          </div>
          <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:col-span-7">
            {whyMmako.map((reason, i) => (
              <Reveal
                key={reason}
                index={i}
                as="li"
                className="flex items-start gap-3 border-b border-white/10 pb-5 text-bone-300/85"
              >
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-px w-4 shrink-0 bg-gold"
                  />
                  <span className="text-base">{reason}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* How we work ------------------------------------------------------- */}
      <Section tone="light">
        <SectionHeader
          eyebrow="How we work"
          title="A process built to remove guesswork"
        />

        <ol className="mt-14 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 md:grid-cols-3">
          {process.map((step, i) => (
            <li key={step.step} className="bg-bone p-7 sm:p-9">
              <Reveal index={i}>
                <span className="font-display text-3xl text-gold-dim">
                  {step.step}
                </span>
                <h3 className="mt-5 text-xl leading-snug text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-warm-grey">
                  {step.detail}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* Closing CTA ------------------------------------------------------- */}
      <Section tone="dark" size="md">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl leading-[1.15] text-bone sm:text-4xl">
              Let&apos;s talk about what you&apos;re dealing with
            </h2>
            <p className="mt-4 text-base leading-relaxed text-bone-300/70">
              Tell us the situation and we&apos;ll tell you, plainly, where you
              stand.
            </p>
          </div>
          <Button href="/contact" size="lg" className="shrink-0">
            Book a Consultation
          </Button>
        </div>
      </Section>
    </>
  );
}
