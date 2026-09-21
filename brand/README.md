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

Two things are unresolved. Each affects finished artwork.

> **Settled.** The firm supplied revised artwork whose wordmark reads **MMAKO INC.**, so the mark
> and the written name now agree — the naming question is closed, and "Mmako Law" is retired. The
> palette takes its gold from that artwork (`#BB9B66`), with Gold Deep (`#85693B`) and Gold Bright
> (`#D2BC96`) re-derived at the same hue. The type system is **Montserrat**, the geometric sans the
> logo's own wordmark is set in.

**1. Company details are placeholders.** Registration number, VAT number and banking details appear
as bracketed placeholders on the letterhead, invoice and legal templates. Supply them before
anything is printed or issued.

**2. The confidentiality notice needs sign-off.** The wording in the email signature is a reasonable
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

Two pairs are supplied, in `06 - STATIONERY/Email Signature/` — one for the director and one
for the `info@` support mailbox. Each pair has a full version for new mail and a short one for
replies, so a signature does not pile up down a long thread.

| File | When to use it |
| --- | --- |
| `signature-new-email.html` | **Dalen Mmako, primary** — new outgoing email. Full identity block. |
| `signature-reply.html` | **Dalen Mmako, secondary** — replies and forwards. One identity line, no logo. |
| `signature-support-new-email.html` | **Technical Support, primary** — new outgoing email from `info@`. |
| `signature-support-reply.html` | **Technical Support, secondary** — replies and forwards from `info@`. |

Plain-text versions (`.txt`) are included for anyone composing in plain text.

The support pair is for a role mailbox rather than a person, so it carries no job title —
"Technical Support" is the name, and the line beneath it is the firm. Its telephone number is the
director's, as instructed, which means support calls ring his mobile; if a separate support line is
added later, set it in `people.support` in `_source/lib/tokens.mjs` and rebuild.

**Before installing:** the signature loads its logo from `https://mmakoinc.com/logo-signature.png`.
That file ships with the website, so it works as soon as the site is live. If the site is not yet
deployed, the logo will not render for recipients.

**The method is the same everywhere:** open the `.html` file in Edge or Chrome, press
**Ctrl+A** then **Ctrl+C**, click into the mail client's signature box and press **Ctrl+V**.
You are copying the *rendered* signature, not the file's source — pasting HTML source produces a
page of code.

**Gmail** — Settings → See all settings → Signature.

**Apple Mail** — Settings → Signatures. Paste, then untick "Always match my default message font".

These are built for real mail clients: tables and inline styles only, web-safe fonts (Outlook
ignores webfonts), no background images, and a fixed 560px width.

---

## Outlook, step by step

### Before you start

**Install Montserrat on every machine**, or the signature composes in Century Gothic or Arial. It
is free from [Google Fonts](https://fonts.google.com/specimen/Montserrat), and it is the same font
the Word templates need, so this is one job for both.

The download contains two variable fonts at the top level and a **`static`** folder. **Install the
ones in `static`.** Office handles variable fonts poorly, and installing only those is why
Montserrat sometimes appears in the font menu but will not apply.

*On a Mac:* quit Outlook and Word first (**Cmd+Q**, not just closing the window — Office reads the
font list at launch). Open the unzipped folder, go into `static`, select every `.ttf` with
**Cmd+A**, then double-click. Font Book opens with them listed — click **Install**. If it warns
about duplicates, resolve them automatically. Reopen Outlook.

*On Windows:* select the `.ttf` files in `static`, right-click → **Install for all users**.

**Work out which Outlook is in front of you**, because the menus differ:

| | Where signatures live |
| --- | --- |
| **Outlook for Mac** | **Outlook → Settings** (Cmd+,) → **Signatures**. Older builds: Outlook → Preferences → Signatures. |
| **New Outlook for Windows** (a *New Outlook* toggle, top right) | gear → Accounts → Signatures |
| **Classic Outlook for Windows** (a *File* menu, top left) | File → Options → Mail → Signatures |

### Outlook for Mac

1. **Outlook → Settings** (**Cmd+,**) → **Signatures**.
2. Click **+**. Name it `Mmako — new mail`.
3. Open `signature-new-email.html` in Chrome or Safari, **Cmd+A**, **Cmd+C**, click into the
   signature editing area and **Cmd+V**. Close the editing window — it saves on close.
4. Repeat with **+** for `Mmako — reply`, pasting `signature-reply.html`.
5. Back on the Signatures screen, under **Choose default signature**, pick the **account** first,
   then set **New messages** to the first and **Replies/forwards** to the second.
6. Open a new message to check. Signatures do not appear in windows that were already open.

> **If the paste arrives as plain text or loses the gold rule**, the wrong paste command was used.
> **Cmd+V** keeps the formatting; **Cmd+Shift+V** strips it, which is the opposite of what is
> wanted here.

> **There is no file-copy shortcut on a Mac.** Outlook for Mac keeps signatures inside its profile
> database rather than as loose files, so the Windows trick below does not apply — repeat the paste
> on each laptop. It takes about two minutes each. Where the mailboxes are Microsoft 365 accounts,
> signatures set in the newest Outlook for Mac may sync by themselves; check the second laptop
> before assuming it for the rest.

### New Outlook for Windows

1. **Settings** (the gear, top right) → **Accounts** → **Signatures**.
2. **New signature**, name it `Mmako — new mail`, paste, **Save**.
3. **New signature** again, name it `Mmako — reply`, paste the reply version, **Save**.
4. Under **Default signatures**, pick the account, then set **For new messages** to the first and
   **For replies/forwards** to the second.

### Classic Outlook for Windows

1. **File → Options → Mail → Signatures…**
2. **New**, name it `Mmako — new mail`, paste into the *Edit signature* box.
3. **New** again for `Mmako — reply`, paste the reply version.
4. On the right, under **Choose default signature**: set **E-mail account** to the right account
   first — this is per-account, and setting it against the wrong one is the usual mistake — then
   **New messages** to the first and **Replies/forwards** to the second.
5. **OK**. Signatures do not appear in already-open compose windows; open a fresh one to check.

### Outlook on the web

**Settings → Mail → Compose and reply.** Same two signatures, same two dropdowns.

### The director and `info@` on one machine

Outlook chooses a signature by **account**, not by the address in the From line. That has a
practical consequence when one person handles both mailboxes:

- If `info@` is added as **its own account** (File → Add Account, with its own password), each
  account gets its own default signature and the right one appears automatically.
- If `info@` is a **shared mailbox** opened alongside the main account, Outlook will not switch
  signatures when the From address changes. The support signature has to be inserted by hand:
  **Message → Signature → Mmako — support**. Install it under whichever account is used to send,
  and expect to pick it each time.

Adding `info@` as a separate account is the tidier arrangement wherever the mailbox has its own
credentials.

### Rolling it out to several Windows PCs

Set one machine up, check it, then copy rather than repeating the paste on each. This applies to
classic Outlook on Windows only — see above for Macs.

Classic Outlook keeps signatures as files. Paste this into File Explorer's address bar:

```
%APPDATA%\Microsoft\Signatures
```

Each signature is three files — `.htm`, `.rtf`, `.txt` — plus a folder of the same name holding its
assets. Copy all of them to the same location on each PC with Outlook **closed**, reopen, and set
the defaults per step 4 above. The defaults are per-profile and do not copy across.

New Outlook and Outlook on the web store signatures against the mailbox rather than the PC, so a
signature set up once generally appears on that account's other machines by itself. Confirm it on
the second machine before assuming it for the rest.

### What to expect once it is in

**The logo may not appear immediately for recipients.** It is loaded from
`https://mmakoinc.com/logo-signature.png` rather than attached, and Outlook blocks remote images
until the reader clicks *Download pictures*. This is the deliberate trade: attaching it instead
would make every message carry an attachment and show a paperclip in the recipient's inbox, which
looks like a document has been sent. Contact details are live text, so nothing important is lost
while images are blocked.

**Check it before signing off.** Send one test to Gmail, one to an Outlook.com address, and read
both on a phone. Confirm the gold rule down the left survives, the logo is sharp rather than
stretched, and the phone number and email are clickable.

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
