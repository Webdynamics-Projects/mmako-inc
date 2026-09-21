import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "insights");

export type InsightFrontmatter = {
  title: string;
  category: string;
  date: string;
  excerpt: string;
  /** Optional — worked out from the article's length when left empty. */
  readTime?: string;
  /** Optional — omit to keep a draft out of the published list. */
  draft?: boolean;
};

export type Insight = Omit<InsightFrontmatter, "readTime"> & {
  slug: string;
  content: string;
  readTime: string;
};

/**
 * Estimates reading time at 200 words a minute, the usual figure for prose,
 * rounded up so nothing reads as "0 min". Authors can still set `readTime`
 * by hand; this is what fills the gap when they do not, which keeps one more
 * decision off the person writing the article.
 */
function estimateReadTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function readAll(): Insight[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const frontmatter = data as InsightFrontmatter;
      return {
        ...frontmatter,
        slug: file.replace(/\.mdx$/, ""),
        content,
        readTime: frontmatter.readTime?.trim() || estimateReadTime(content),
      };
    })
    .filter((post) => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllInsights(): Insight[] {
  return readAll();
}

export function getInsight(slug: string): Insight | undefined {
  return readAll().find((post) => post.slug === slug);
}

export function getInsightSlugs(): string[] {
  return readAll().map((post) => post.slug);
}

/** Renders an ISO date as, e.g., "14 September 2026". */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
