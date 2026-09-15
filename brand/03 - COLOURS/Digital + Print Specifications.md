# Digital + Print Specifications

## Full specification

| Colour | HEX | RGB | CMYK | Use |
| --- | --- | --- | --- | --- |
| **Mmako Ink** | `#0B0B0C` | 11, 11, 12 | 8 / 8 / 0 / 95 | Primary dark. Headers, footers, body text on light grounds, and the base for all dark surfaces. |
| **Mmako Gold** | `#C9A227` | 201, 162, 39 | 0 / 19 / 81 / 21 | Brand accent. Rules, underlines, icon accents, button fills, the logo's diagonal. Never a large background fill. |
| **Bone** | `#FAFAF8` | 250, 250, 248 | 0 / 0 / 1 / 2 | Primary light ground. Page and section backgrounds. |
| **Gold Deep** | `#806517` | 128, 101, 23 | 0 / 21 / 82 / 50 | Gold text on light grounds. The brand gold fails WCAG AA contrast as small text — this is its accessible substitute. |
| **Gold Bright** | `#E0BC45` | 224, 188, 69 | 0 / 16 / 69 / 12 | Hover and active states on dark grounds only. |
| **Warm Grey** | `#6B6A66` | 107, 106, 102 | 0 / 1 / 5 / 58 | Secondary body text, captions, labels on light grounds. |
| **Bone 200** | `#F1F0EB` | 241, 240, 235 | 0 / 0 / 2 / 5 | Alternating section grounds, table zebra striping, muted panels. |
| **Bone 300** | `#E3E1D9` | 227, 225, 217 | 0 / 1 / 4 / 11 | Hairlines and dividers on light grounds. |
| **Ink 800** | `#17171A` | 23, 23, 26 | 12 / 12 / 0 / 90 | Raised panels on dark grounds. |

## Print notes

**Mmako Ink** — For solid areas use a rich black build — C60 M50 Y40 K100. For text under 18pt use K100 only, to avoid registration fringing.

**Mmako Gold** — Confirm against a printed draw-down — metallic-looking golds shift on uncoated stock.

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
| Mmako Gold | 2.31:1 ❌ | 8.13:1 ✅ |
| Bone | 1.00:1 ❌ | 18.83:1 ✅ |
| Gold Deep | 5.30:1 ✅ | 3.55:1 ⚠️ large text only |
| Gold Bright | 1.76:1 ❌ | 10.73:1 ✅ |
| Warm Grey | 5.18:1 ✅ | 3.63:1 ⚠️ large text only |
| Bone 200 | 1.09:1 ❌ | 17.24:1 ✅ |
| Bone 300 | 1.25:1 ❌ | 15.03:1 ✅ |
| Ink 800 | 17.12:1 ✅ | 1.10:1 ❌ |
