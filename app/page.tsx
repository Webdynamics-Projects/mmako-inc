import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Section, SectionHeader } from "@/components/Section";
import { Button } from "@/components/Button";
import { ServiceCard } from "@/components/ServiceCard";
import { Reveal } from "@/components/Reveal";
import { services, whyMmako } from "@/lib/content";

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

      {/* Why Mmako Inc -----------------------------------------------------
          Light-toned so the closing CTA below reads as a distinct band. With
          the sections either side of it removed, a dark treatment here ran
          into the CTA and the footer as one unbroken dark block. */}
      <Section tone="muted" size="sm">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Why Mmako Inc."
              title="What working with us looks like"
            />
          </div>
          <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:col-span-7">
            {whyMmako.map((reason, i) => (
              <Reveal
                key={reason}
                index={i}
                as="li"
                className="flex items-start gap-3 border-b border-ink/10 pb-5 text-warm-grey"
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
