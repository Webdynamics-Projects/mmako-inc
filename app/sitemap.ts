import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getAllInsights } from "@/lib/insights";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${siteUrl}/services`, lastModified: now, changeFrequency: "yearly", priority: 0.9 },
    { url: `${siteUrl}/insights`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
  ];

  const articles: MetadataRoute.Sitemap = getAllInsights().map((post) => ({
    url: `${siteUrl}/insights/${post.slug}`,
    lastModified: new Date(`${post.date}T00:00:00Z`),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...pages, ...articles];
}
