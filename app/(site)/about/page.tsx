import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeader } from "@/components/Section";
import { CtaBand } from "@/components/CtaBand";
import { Reveal } from "@/components/Reveal";
import { notTraditional, team } from "@/lib/content";

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
        body="Mmako Inc. is a modern law firm with a straightforward approach to the law. We believe in clear advice, thoughtful legal thinking and practical solutions, delivered with the care and professionalism that every matter deserves."
      />

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

      {/* Meet our team ---------------------------------------------------- */}
      <Section>
        <SectionHeader eyebrow="Our people" title="Meet our team" />

        {team.map((member) => (
          <article
            key={member.name}
            className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-16"
          >
            <Reveal className="lg:col-span-5">
              <div className="relative max-w-md">
                <span
                  aria-hidden="true"
                  className="absolute -bottom-3 -right-3 hidden h-full w-full border border-gold/60 sm:block"
                />
                <Image
                  src={member.photo.src}
                  width={member.photo.width}
                  height={member.photo.height}
                  alt={`Portrait of ${member.name}`}
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 70vw, 100vw"
                  className="relative h-auto w-full"
                />
              </div>
            </Reveal>

            <div className="lg:col-span-7">
              <h3 className="text-2xl text-ink sm:text-3xl">{member.name}</h3>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-gold-dim">
                {member.role}
              </p>
              <span aria-hidden="true" className="mt-6 block h-px w-8 bg-gold" />
              <div className="mt-6 space-y-5 text-base leading-relaxed text-warm-grey">
                {member.bio.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>
        ))}
      </Section>

      <CtaBand
        eyebrow="Next step"
        title="Ready to work with us?"
        body="Start with a conversation — no obligation, no jargon."
        ctaLabel="Book a Consultation"
      />
    </>
  );
}
