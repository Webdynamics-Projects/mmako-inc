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

Five things are unresolved. Each affects finished artwork.

**1. The logo files are a reconstruction.** Every asset here derives from a redrawn stand-in, not
the designer's original artwork. See "Replacing the logo" below — one file and one command
regenerates the entire kit.

**2. The gold does not match.** The supplied logo renders a softer, lighter gold than the brand's
`#C9A227`. Either re-export the logo in the brand gold, or adopt the softer gold across the website
and this kit. Both cannot stand.

**3. "Mmako Law" or "Mmako Inc."** The kit assumes the logo artwork is the brand mark and
*Mmako Inc.* is the written name used in all copy. Confirm this.

**4. Company details are placeholders.** Registration number, VAT number and banking details appear
as bracketed placeholders on the letterhead, invoice and legal templates. Supply them before
anything is printed or issued.

**5. The confidentiality notice needs sign-off.** The wording in the email signature is a reasonable
general form. It has not been reviewed against the firm's professional-indemnity or Legal Practice
Council obligations.

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

Everything reads from `brand/_source/lib/tokens.mjs`. Change a colour, an address or a phone number
there and it propagates through the whole kit on the next build — there is no second place to update.

Brand strategy copy lives in `brand/_source/lib/strategy.mjs`.

---

## A note on the written content

The brand strategy in section 01 is **synthesised from the firm's own approved website copy** — the
four value propositions, the philosophy section and the "not the traditional firm" section. It
introduces no claim, credential or capability the firm has not already published about itself.

It still needs the client's sign-off before it becomes the governing brand document.
