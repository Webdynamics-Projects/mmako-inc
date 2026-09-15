# Digital + Print Specifications

## Full specification

| Colour | HEX | RGB | CMYK | Use |
| --- | --- | --- | --- | --- |
| **Mmako Ink** | `#0B0B0C` | 11, 11, 12 | 8 / 8 / 0 / 95 | Primary dark. Headers, footers, body text on light grounds, and the base for all dark surfaces. |
| **Mmako Gold** | `#B7965E` | 183, 150, 94 | 0 / 18 / 49 / 28 | Brand accent, taken from the logo artwork itself. Rules, underlines, icon accents, button fills, the logo's diagonal. Never a large background fill. |
| **Bone** | `#FAFAF8` | 250, 250, 248 | 0 / 0 / 1 / 2 | Primary light ground. Page and section backgrounds. |
| **Gold Deep** | `#85693B` | 133, 105, 59 | 0 / 21 / 56 / 48 | Gold text on light grounds. Derived from Mmako Gold by darkening at a fixed hue until it clears 4.5:1 on Bone 200 — the brand gold itself reaches only 2.4:1 there, so it must never be used for text on a light surface. |
| **Gold Bright** | `#CFB78E` | 207, 183, 142 | 0 / 12 / 31 / 19 | Hover and active states on dark grounds only. A lift of Mmako Gold at the same hue. |
| **Warm Grey** | `#6B6A66` | 107, 106, 102 | 0 / 1 / 5 / 58 | Secondary body text, captions, labels on light grounds. |
| **Bone 200** | `#F1F0EB` | 241, 240, 235 | 0 / 0 / 2 / 5 | Alternating section grounds, table zebra striping, muted panels. |
| **Bone 300** | `#E3E1D9` | 227, 225, 217 | 0 / 1 / 4 / 11 | Hairlines and dividers on light grounds. |
| **Ink 800** | `#17171A` | 23, 23, 26 | 12 / 12 / 0 / 90 | Raised panels on dark grounds. |

## Print notes

**Mmako Ink** — For solid areas use a rich black build — C60 M50 Y40 K100. For text under 18pt use K100 only, to avoid registration fringing.

**Mmako Gold** — Read directly out of the supplied logo file, so it is the identity's true gold. Confirm against a printed draw-down — muted golds shift noticeably on uncoated stock.

**Bone** — Do not print. Use the unprinted stock, or match to a warm white paper.

## On CMYK values

The CMYK figures above are a direct arithmetic conversion from RGB. They are a correct starting
point for flat brand colours, but they are **not a colour-managed conversion** and will shift
between coated and uncoated stock.

Before any print run, ask the printer for a draw-down or wet proof of Mmako Gold on the actual
stock, and approve against that rather than against a screen.

## On Pantone

No Pantone references are specified here. Pantone matching requires a licensed colour library and a
physical guide under controlled lighting — supplying a guessed PMS number would be worse than
supplying none. Give your printer the HEX and CMYK values above and ask them to recommend the
closest Pantone for any spot-colour work.

## Accessibility reference

Contrast ratios against the two ground colours. Values of 4.5 or above pass WCAG AA for body text;
3.0 or above passes for large text (24px / 18pt and up).

| Colour | on Bone `#FAFAF8` | on Ink `#0B0B0C` |
| --- | --- | --- |
| Mmako Ink | 18.83:1 ✅ | 1.00:1 ❌ |
| Mmako Gold | 2.67:1 ❌ | 7.06:1 ✅ |
| Bone | 1.00:1 ❌ | 18.83:1 ✅ |
| Gold Deep | 4.92:1 ✅ | 3.82:1 ⚠️ large text only |
| Gold Bright | 1.86:1 ❌ | 10.13:1 ✅ |
| Warm Grey | 5.18:1 ✅ | 3.63:1 ⚠️ large text only |
| Bone 200 | 1.09:1 ❌ | 17.24:1 ✅ |
| Bone 300 | 1.25:1 ❌ | 15.03:1 ✅ |
| Ink 800 | 17.12:1 ✅ | 1.10:1 ❌ |
