# Mmako Inc. — Branding Kit

Everything in the numbered folders is a **finished file**. Nothing needs to be built or installed to
use the kit — open a folder and take what you need.

```
01 - BRAND STRATEGY     Overview, personality, values, positioning, tone of voice
02 - LOGO               Primary, secondary, monogram, black, white, colour, favicon
03 - COLOURS            Primary and secondary palettes, digital + print specs
04 - TYPOGRAPHY         Primary and secondary fonts, hierarchy
05 - VISUAL SYSTEM      Graphic elements, iconography, photography, layout
06 - STATIONERY         Letterhead, business card, envelope, comp slip, email signatures
07 - LEGAL DOCUMENTS    Legal letter, legal opinion, invoice, proposal
08 - DIGITAL            Website assets, LinkedIn, social templates, email assets
09 - OFFICE             Office signage, door signs, presentation folder
10 - BRAND GUIDELINES   Mmako Inc. Brand Guidelines.pdf — the governing document
_source                 Templates and generators. Only needed to rebuild the kit.
```

Start with **10 - BRAND GUIDELINES**. It is the single document to hand anyone — a printer, a
designer, a new hire — and it ends with the open items listed below.

---

## ⚠️ Read this before anything goes to print

Three things are unresolved. Each affects finished artwork.

> **Settled.** The palette now takes its gold from the logo artwork — `#B7965E` — so the mark and
> everything around it agree. Gold Deep (`#85693B`) and Gold Bright (`#CFB78E`) were re-derived from
> it at the same hue. The type system moved to **Montserrat**, the geometric sans the logo's own
> wordmark is set in.

**1. "Mmako Law" or "Mmako Inc."** The kit assumes the logo artwork is the brand mark and
*Mmako Inc.* is the written name used in all copy. Confirm this.

**2. Company details are placeholders.** Registration number, VAT number and banking details appear
as bracketed placeholders on the letterhead, invoice and legal templates. Supply them before
anything is printed or issued.

**3. The confidentiality notice needs sign-off.** The wording in the email signature is a reasonable
general form. It has not been reviewed against the firm's professional-indemnity or Legal Practice
Council obligations.

---

## The Word templates

Anything the firm **types into** is supplied as an editable `.docx`. Anything a **printer**
produces is supplied as a print-ready PDF. Several items exist in both forms.

| File | Where | What it is |
| --- | --- | --- |
| `Mmako Inc - Letterhead.docx` | 06 - STATIONERY/Letterhead | Branded header and footer, empty body. Start typing. |
| `Mmako Inc - Document Template.docx` | 06 - STATIONERY/Letterhead | The same chrome plus page numbers, a title block and Heading 1–3 styles. Use this for anything running to more than one page. |
| `Mmako Inc - Legal Letter.docx` | 07 - LEGAL DOCUMENTS | Addressee and date block, RE line, structured body, sign-off. |
| `Mmako Inc - Legal Opinion.docx` | 07 - LEGAL DOCUMENTS | Eight-section opinion structure, from instructions through to limitations. |
| `Mmako Inc - Invoice.docx` | 07 - LEGAL DOCUMENTS | Line-item table, totals with VAT, banking panel. |
| `Mmako Inc - Proposal.docx` | 07 - LEGAL DOCUMENTS | Scope, exclusions, fee table, terms, signature block. |

**How they are built.** Headers and footers are set in the Word header/footer layer, so they repeat
on every page and cannot be edited by accident while typing. Grey bracketed text — `[like this]` —
is a placeholder to type over. The heading styles appear in Word's Styles gallery, so the navigation
pane and an inserted table of contents both work.

**Fonts.** These are set in **Montserrat**, the brand family. Word cannot load webfonts, so
**install Montserrat on every machine in the firm** — it is free, from
[Google Fonts](https://fonts.google.com/specimen/Montserrat): download, unzip, select the .ttf
files, right-click → Install. Documents then match the brand exactly. Without it they fall back
through `Montserrat, 'Century Gothic', Arial, sans-serif` — Century Gothic ships with Office on
Windows and Mac. See `04 - TYPOGRAPHY/Secondary Font.md`.

**To turn one into a reusable Word template:** open it, then *Save As* → *Word Template (.dotx)*.
Word will then open a fresh copy each time instead of the original.

---

## Installing the email signatures

Two signatures are supplied, in `06 - STATIONERY/Email Signature/`.

| File | When to use it |
| --- | --- |
| `signature-new-email.html` | **Primary** — new outgoing email. Full identity block. |
| `signature-reply.html` | **Secondary** — replies and forwards. One identity line, no logo. |

Plain-text versions (`.txt`) are included for anyone composing in plain text.

**Before installing:** the signature loads its logo from `https://mmakoinc.com/logo-signature.png`.
That file ships with the website, so it works as soon as the site is live. If the site is not yet
deployed, the logo will not render for recipients.

**Gmail** — Settings → See all settings → Signature. Open the `.html` file in a browser, select all,
copy, and paste into the signature box. Pasting the raw HTML source will not work.

**Outlook (desktop)** — File → Options → Mail → Signatures. Create two signatures, set the new-email
one as the default for new messages and the reply one as the default for replies/forwards. Paste the
rendered signature, not the source.

**Apple Mail** — Settings → Signatures. Paste the rendered signature, then untick
"Always match my default message font".

These are built for real mail clients: tables and inline styles only, web-safe fonts (Outlook
ignores webfonts), no background images, and a fixed 560px width.

---

## Replacing the logo

When the designer's original artwork arrives:

```bash
cp /path/to/real-logo.png public/logo.png
npm run logo                          # regenerates the website's logo assets
node brand/_source/build-all.mjs      # regenerates the entire branding kit
```

The kit generators need one tool the website does not:

```bash
npm install --no-save playwright
```

It is used only to render PDFs and PNGs. Nobody using the kit needs it.

After rebuilding, check the aspect ratios the logo script prints against the constants at the top of
`components/Logo.tsx`, and update them if they changed.

---

## Rebuilding one section

| Command | Rebuilds |
| --- | --- |
| `node brand/_source/build-logo.mjs` | 02 - LOGO |
| `node brand/_source/build-signatures.mjs` | Email signatures |
| `node brand/_source/build-stationery.mjs` | Letterhead, card, envelope, comp slip |
| `node brand/_source/build-documents.mjs` | 07 - LEGAL DOCUMENTS |
| `node brand/_source/build-digital-office.mjs` | 08 - DIGITAL and 09 - OFFICE |
| `node brand/_source/build-guidelines.mjs` | 01, 03, 04, 05 and the guidelines PDF |
| `node brand/_source/build-word.mjs` | The six Word templates |

The generators need two tools the website does not — install them together, since npm prunes
`--no-save` packages that are not named in the same command:

```bash
npm install --no-save playwright docx
```

Playwright renders the PDFs and PNGs; `docx` writes the Word templates. Nobody *using* the kit
needs either installed.

Everything reads from `brand/_source/lib/tokens.mjs`. Change a colour, an address or a phone number
there and it propagates through the whole kit on the next build — there is no second place to update.

Brand strategy copy lives in `brand/_source/lib/strategy.mjs`.

---

## A note on the written content

The brand strategy in section 01 is **synthesised from the firm's own approved website copy** — the
four value propositions, the philosophy section and the "not the traditional firm" section. It
introduces no claim, credential or capability the firm has not already published about itself.

It still needs the client's sign-off before it becomes the governing brand document.
