import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeader } from "@/components/Section";
import { CtaBand } from "@/components/CtaBand";
import { Reveal } from "@/components/Reveal";
import { philosophy, notTraditional } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Mmako Inc. was founded to give everyday businesses and individuals legal support that's clear, practical and genuinely useful — not buried in jargon or billed by the hour.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Mmako Inc.",
    description:
      "A modern approach to legal practice, built for the pace of modern business.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A modern approach to legal practice"
        subtitle="Built for the pace of modern business."
        body="Mmako Inc. was founded to give everyday businesses and individuals legal support that's clear, practical, and genuinely useful — not buried in jargon or billed by the hour."
      />

      {/* Philosophy -------------------------------------------------------- */}
      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Our philosophy"
              title="How we think about the work"
              subtitle="Guided by clarity and precision."
            />
          </div>

          <ul className="lg:col-span-7">
            {philosophy.map((item, i) => (
              <Reveal
                key={item.title}
                index={i}
                as="li"
                className="grid gap-2 border-t border-ink/10 py-7 first:border-t-0 first:pt-0 sm:grid-cols-12 sm:gap-8"
              >
                  <h3 className="text-lg leading-snug text-ink sm:col-span-5">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-warm-grey sm:col-span-7 sm:pt-1">
                    {item.detail}
                  </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* Not the traditional firm ------------------------------------------ */}
      <Section tone="muted">
        <SectionHeader
          eyebrow="The difference"
          title="Not the traditional firm"
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {notTraditional.map((item, i) => (
            <Reveal key={item.title} index={i} className="h-full">
              <div className="group flex h-full flex-col border border-ink/10 bg-white p-7 transition-colors duration-300 hover:border-gold/60 sm:p-8">
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-gold transition-all duration-300 group-hover:w-14"
                />
                <h3 className="mt-6 text-lg leading-snug text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-warm-grey">
                  {item.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Team placeholder ---------------------------------------------------
          TODO: replace with real photography and team bios once the client
          supplies them. Deliberately left out of the live page rather than
          filled with stock imagery or invented credentials. */}

      <CtaBand
        eyebrow="Next step"
        title="Ready to work with us?"
        body="Start with a conversation — no obligation, no jargon."
        ctaLabel="Book a Consultation"
      />
    </>
  );
}
