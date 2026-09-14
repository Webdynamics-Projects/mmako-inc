import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "insights");

export type InsightFrontmatter = {
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  /** Optional — omit to keep a draft out of the published list. */
  draft?: boolean;
};

export type Insight = InsightFrontmatter & {
  slug: string;
  content: string;
};

function readAll(): Insight[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const { data, content } = matter(raw);
      return {
        ...(data as InsightFrontmatter),
        slug: file.replace(/\.mdx$/, ""),
        content,
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
