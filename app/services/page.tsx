import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/CtaBand";
import { Reveal } from "@/components/Reveal";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Business and corporate advisory, commercial contracts, dispute resolution and ongoing legal support — practical legal solutions delivered with clarity and commercial awareness.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services — Mmako Inc.",
    description:
      "Legal services designed for everyday needs: corporate advisory, commercial contracts, dispute resolution and ongoing support.",
    url: "/services",
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Legal services designed for everyday needs"
        subtitle="Practical legal solutions, delivered with clarity and commercial awareness."
      />

      <Section tone="light">
        <div className="space-y-px bg-ink/10">
          {services.map((service, i) => (
            <Reveal key={service.title} index={i}>
              <article className="group grid gap-8 bg-bone py-12 sm:py-14 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-5">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-2xl text-gold-dim">
                      {service.number}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-gold/30 transition-colors duration-300 group-hover:bg-gold/70"
                    />
                  </div>
                  <h2 className="mt-5 text-2xl leading-snug text-ink sm:text-[1.75rem]">
                    {service.title}
                  </h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-warm-grey">
                    {service.description}
                  </p>
                </div>

                <div className="lg:col-span-7">
                  <ul className="grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2">
                    {service.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 bg-white px-5 py-5 text-sm text-ink/80 transition-colors duration-300 hover:bg-bone-200"
                      >
                        <span
                          aria-hidden="true"
                          className="h-px w-3 shrink-0 bg-gold"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand
        eyebrow="Key Focus Areas"
        title="Discuss your legal needs"
        body="Tell us what you're working on and we'll point you to the right starting place."
        ctaLabel="Get in touch"
      />
    </>
  );
}
