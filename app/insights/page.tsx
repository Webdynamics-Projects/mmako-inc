import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { CtaBand } from "@/components/CtaBand";
import { Reveal } from "@/components/Reveal";
import { ArrowIcon } from "@/components/Icons";
import { getAllInsights, formatDate } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Notes on modern law, business growth, and navigating the legal landscape — practical perspectives from Mmako Inc.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "Insights & Perspectives — Mmako Inc.",
    description:
      "Notes on modern law, business growth, and navigating the legal landscape.",
    url: "/insights",
  },
};

export default function InsightsPage() {
  const posts = getAllInsights();

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Insights & Perspectives"
        subtitle="Notes on modern law, business growth, and navigating the legal landscape."
      />

      <Section tone="light">
        {posts.length === 0 ? (
          <p className="text-warm-grey">
            New articles are on the way — check back soon.
          </p>
        ) : (
          <ul className="grid gap-px border border-ink/10 bg-ink/10">
            {posts.map((post, i) => (
              <Reveal key={post.slug} index={i} as="li" className="bg-bone">
                  <Link
                    href={`/insights/${post.slug}`}
                    className="group grid gap-5 p-7 transition-colors duration-300 hover:bg-white sm:p-9 lg:grid-cols-12 lg:gap-10"
                  >
                    <div className="lg:col-span-3">
                      <span className="inline-block border border-gold/40 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-gold-dim">
                        {post.category}
                      </span>
                      <p className="mt-4 text-xs text-warm-grey">
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                        <span aria-hidden="true"> · </span>
                        {post.readTime}
                      </p>
                    </div>

                    <div className="lg:col-span-9">
                      <h2 className="text-xl leading-snug text-ink transition-colors duration-300 group-hover:text-gold-dim sm:text-2xl">
                        {post.title}
                      </h2>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-warm-grey">
                        {post.excerpt}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink">
                        Read Article
                        <ArrowIcon className="h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
              </Reveal>
            ))}
          </ul>
        )}

      </Section>

      <CtaBand
        eyebrow="Questions?"
        title="Need advice on something specific?"
        body="General guidance only goes so far. Tell us about your situation."
        ctaLabel="Book a Consultation"
      />
    </>
  );
}
