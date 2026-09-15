# Mmako Inc.

Marketing website for Mmako Inc., a South African business law firm.

Built with Next.js (App Router), TypeScript and Tailwind CSS. The contact form
delivers real email through [Resend](https://resend.com).

---

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # http://localhost:3000
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run logo` | Regenerates the logo variants and favicons from `public/logo.png` |

---

## Environment variables

All of these are listed in `.env.example`. Set them in `.env.local` for local
development, and in **Vercel → Project → Settings → Environment Variables**
before deploying.

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | Sends contact-form email. Create one at [resend.com/api-keys](https://resend.com/api-keys). |
| `CONTACT_TO_EMAIL` | No | Inbox that receives enquiries. Defaults to `contact@mmakoinc.com`. |
| `CONTACT_FROM_EMAIL` | No | The address Resend sends *from*. Its domain must be verified in Resend. Defaults to `onboarding@resend.dev`, which works for testing only. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical origin, e.g. `https://mmakoinc.com`. Used for `sitemap.xml`, `robots.txt` and Open Graph tags. |

### Setting up Resend

1. Sign up at [resend.com](https://resend.com) and create an API key.
2. Add your sending domain under **Domains** and complete the DNS records it
   gives you. Until that's verified, leave `CONTACT_FROM_EMAIL` unset so the
   form falls back to Resend's test sender.
3. Put the key in `RESEND_API_KEY` locally and in Vercel.

Without `RESEND_API_KEY` set, the form returns a clear error telling the visitor
to email the firm directly — it never silently pretends to have sent something.

---

## Adding an article to Insights

Articles are MDX files in `content/insights/`. Drop in a new `.mdx` file and it
appears on `/insights` and gets its own page, its own metadata and a sitemap
entry automatically — no code changes needed.

```mdx
---
title: "Your article title"
category: "Commercial Contracts"
date: "2026-09-14"          # ISO date; controls ordering (newest first)
readTime: "5 min read"
excerpt: "One or two lines shown on the listing card and used as the page description."
draft: false                 # optional — set true to keep it off the live site
---

## A heading

Body copy in ordinary markdown.
```

The filename becomes the URL slug, so
`why-contracts-matter.mdx` → `/insights/why-contracts-matter`.

The three seeded articles are placeholders with real headings and structure —
replace their bodies with the firm's own writing.

---

## The logo

> **`public/logo.png` is currently a placeholder**, not the firm's real
> artwork. Replace it and run one command — see below.

The site renders four generated files, all derived from a single source:

| File | Where it's used |
| --- | --- |
| `public/logo.png` | **Source.** The logo as supplied. Never rendered directly. |
| `public/logo-dark.png` | Full lockup, original colours — for light surfaces |
| `public/logo-light.png` | Full lockup, reversed — footer |
| `public/logo-mark-dark.png` | Monogram only, original colours |
| `public/logo-mark-light.png` | Monogram only, reversed — header |
| `app/icon.png`, `public/favicon.ico` | Browser and home-screen icons |

### Replacing it

```bash
cp /path/to/your-logo.png public/logo.png
npm run logo
```

That's it. The script strips the background, trims the empty margin, produces a
reversed variant for the dark header and footer, splits the monogram off the
wordmark, and rebuilds the favicons. It prints the resulting aspect ratios — if
they differ from the `FULL` and `MARK` constants at the top of
`components/Logo.tsx`, update those two numbers to match.

Requirements for the source file: a PNG, 8-bit, not interlaced, dark artwork on
a white or transparent background. The script says so plainly if it gets
something it can't read.

### Why the header doesn't use the full lockup

The supplied logo is stacked — monogram above the wordmark. At the ~34px the
header allows, "MMAKO LAW" becomes unreadable. So the header pairs the monogram
with a typeset "Mmako Inc." wordmark, and the footer, which has vertical room,
shows the full lockup as designed. `components/Logo.tsx` takes a `variant` prop
(`"horizontal"` or `"lockup"`) to switch between them.

### How the recolouring works

The script classifies each pixel by hue and saturation: near-white low-saturation
pixels become transparent, gold pixels (hue 25–65°) are left exactly as
designed, and neutral dark pixels are recoloured to off-white using their own
darkness as the alpha — so anti-aliased edges stay smooth rather than turning
into a hard cutout. Those thresholds are named constants at the top of
`scripts/make-logo-variants.mjs` if a different logo ever needs them adjusted.

---

## Editing site content

| What | Where |
| --- | --- |
| Firm name, email, address, nav links | `lib/site.ts` |
| Logo | `public/logo.png`, then `npm run logo` |
| Home / About / Services copy | `lib/content.ts` |
| Per-page headings and metadata | the relevant `app/*/page.tsx` |
| Colours, fonts, spacing tokens | `app/globals.css` (`@theme` block) |

Marketing copy is kept in `lib/content.ts` rather than inline in components, so
wording can be revised without touching layout.

---

## Design notes

- **Palette.** Near-black `#0B0B0C`, off-white `#FAFAF8`, gold `#C9A227`. Gold
  is used sparingly — rules, underlines, icon accents and button fills. A
  darker `--color-gold-dim` (`#806517`) exists specifically for gold *text* on
  light backgrounds, where the brighter gold doesn't meet WCAG AA contrast.
- **Type.** Fraunces for headings, Inter for body, both via `next/font` so
  there's no render-blocking request and no layout shift.
- **Photography.** None yet. Dark sections use a textured gradient plus an
  abstract gold-line figure instead of stock imagery. Places where real
  photography should eventually go are marked with `TODO:` comments — see
  `components/Hero.tsx` and `app/about/page.tsx` (which has a deliberately empty
  slot for team photos and bios).
- **Motion.** One scroll reveal, in `components/Reveal.tsx`. It renders content
  *visible* in the server HTML and only hides it once JS has an
  `IntersectionObserver` ready, so nothing is invisible to crawlers or to users
  waiting on hydration. `prefers-reduced-motion` disables it.

## Accessibility

Audited with axe-core (WCAG 2.1 A + AA) across every page at desktop and mobile
widths — zero violations. Keyboard navigation, the skip link, form error
announcements and the mobile menu were verified in a real browser. If you change
colours, re-check contrast: the gold/black palette has little headroom.

---

## Deploying to Vercel

1. Import the repository into Vercel. The framework preset is detected
   automatically; no build settings need changing.
2. Add the environment variables from the table above.
3. Deploy.

`sitemap.xml` and `robots.txt` are generated at build time from
`NEXT_PUBLIC_SITE_URL`, so make sure that's set to the production domain.
