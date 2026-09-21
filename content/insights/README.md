# Insights

Most articles are written in the editor at `/keystatic`, which saves them here
as ordinary files. What follows describes that format, for anyone editing one
directly rather than through the editor — the two are interchangeable.

One `.mdx` file per article. The filename becomes the URL, so
`why-contracts-matter.mdx` is published at `/insights/why-contracts-matter`.
Use lowercase words separated by hyphens, and do not rename a file once it is
live — the old link will break.

Each file starts with a frontmatter block between `---` lines. Every field
below is required except `draft`:

```mdx
---
title: "Why Contracts Matter More Than You Think"
category: "Commercial Contracts"
date: "2026-07-29"
readTime: "4 min read"
excerpt: "One or two sentences. Shown on the listing page, and used as the description in search results and link previews."
readTime: "4 min read"   # optional — calculated from the article when omitted
---

The article itself goes here, in Markdown. A blank line separates paragraphs.

## A subheading

**Bold**, *italic* and [links](https://example.com) all work. So do lists:

- first point
- second point

> An indented quote, for emphasis.
```

`date` must be `YYYY-MM-DD` — articles are listed newest first, by this field.
`category` is the small gold label on the listing card; reuse existing wording
rather than inventing a new one each time, so the labels stay a short set.

`readTime` may be left out entirely, in which case it is worked out from the
length of the article at 200 words a minute. Set it only to override that.

Add `draft: true` to the frontmatter to keep a file out of the site while it is
being written. It stays in the repository but is not published, does not appear
in the listing, and is left out of the sitemap.

Publishing is a deploy: adding a file to this folder on the `main` branch puts
the article live within a minute or two. Nothing else needs changing — the
listing page, the article page, the sitemap and the metadata all read from what
is here.

With no articles present, `/insights` shows a short holding message rather than
an empty list.
