import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CtaBand } from "@/components/CtaBand";
import { ArrowIcon } from "@/components/Icons";
import { getInsight, getInsightSlugs, formatDate } from "@/lib/insights";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getInsightSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getInsight(slug);

  if (!post) return { title: "Article not found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/insights/${slug}`,
      publishedTime: post.date,
    },
  };
}

/* Typographic styles for MDX output — kept here so article bodies stay plain
   markdown with no per-post class juggling. */
const mdxComponents = {
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="mt-12 text-2xl leading-snug text-ink" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mt-9 text-xl leading-snug text-ink" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mt-5 text-base leading-[1.75] text-ink/80" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mt-5 space-y-2.5 text-base leading-[1.75] text-ink/80" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="mt-5 list-decimal space-y-2.5 pl-5 text-base leading-[1.75] text-ink/80" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => <li {...props} />,
  a: (props: React.ComponentProps<"a">) => (
    <a className="text-gold-dim underline underline-offset-4 hover:text-gold" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="mt-8 border-l-2 border-gold bg-bone-200 px-6 py-4 text-sm italic text-warm-grey"
      {...props}
    />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-semibold text-ink" {...props} />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code className="bg-bone-200 px-1.5 py-0.5 text-[0.9em]" {...props} />
  ),
};

export default async function InsightPage({ params }: Params) {
  const { slug } = await params;
  const post = getInsight(slug);

  if (!post) notFound();

  return (
    <>
      <section className="surface-dark">
        <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 sm:py-24">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold transition-colors hover:text-gold-bright"
          >
            <ArrowIcon className="h-4 w-4 rotate-180" />
            All Insights
          </Link>

          <span className="mt-8 inline-block border border-gold/40 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-gold">
            {post.category}
          </span>

          <h1 className="mt-5 text-[2rem] leading-[1.15] text-bone sm:text-[2.75rem]">
            {post.title}
          </h1>

          <p className="mt-6 text-sm text-warm-grey-light">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true"> · </span>
            {post.readTime}
          </p>
        </div>
        <div
          aria-hidden="true"
          className="h-px w-full bg-gradient-to-r from-gold/70 via-gold/15 to-transparent"
        />
      </section>

      <article className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <p className="border-l-2 border-gold pl-5 text-lg leading-relaxed text-warm-grey">
          {post.excerpt}
        </p>
        <div className="mt-10">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
      </article>

      <CtaBand
        title="Dealing with something like this?"
        body="We'll give you a straight read on where you stand."
        ctaLabel="Book a Consultation"
      />
    </>
  );
}
