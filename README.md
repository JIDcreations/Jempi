# Jempi Static Site

Open `index.html` to view the site. The site is plain HTML, CSS and JavaScript.

## Structure

- `index.html` is the homepage.
- `*.html` files in the root are live site pages.
- `theme/` contains all live styling.
- `theme/brand.css` contains the brand-sheet tokens and is the only place where brand color values should be defined.
- `scripts/` contains live JavaScript.
- `assets/` contains live images and logos used by the site.
- `brand/` contains the source brand sheet.
- `archive/` contains the original Claude/design handoff files and is not part of the live site.
- `uploads/` contains unused source media and logo exports.

## Brand Rules

Use only the brand-sheet colors:

- Donkere chocolade: `#3a1211`
- Zacht blauw: `#90a4d2`
- Koffie verkeerd: `#eedbc2`
- Gebroken wit: `#fffaf3`

Use the CSS variables from `theme/brand.css` instead of adding new hex, RGB or RGBA colors elsewhere.

## Accessibility — B1: blue on light backgrounds

**Issue.** The brand blue (`#90a4d2`, "Zacht blauw") is used as small text on light
backgrounds (eyebrows, kickers, day numbers, filter labels, date stamps, the
"beste reistijd" highlight, the "inbegrepen" check marks, footer-style heads, …).
Blue-on-cream measures **2.4:1**, below the WCAG AA minimum (4.5:1 for normal text,
3:1 for large text). The same blue on the **dark** chocolate sections passes (≈6.6:1)
and is fine. This is the only systemic accessibility blocker found in the audit
(2026-06-13). For a Belgian commercial site the European Accessibility Act makes AA
a real consideration, so this is worth a conscious decision rather than an oversight.

**Constraint.** The four brand colors are fixed by the brand designer and client and
may not change. Contrast is a property of the text+background *pair*, so blue text on
cream cannot reach AA without either recoloring the text or changing the background —
no CSS trick changes a fixed pair's ratio.

**Chosen approach (in-palette, no color values changed).** On *light* sections only:
- label/number **text becomes chocolate** (`--choc`, ≈15.9:1, fully readable);
- the **brand blue stays as a decorative accent** — a short blue dash before overlines,
  a blue underline on the "beste reistijd" highlight, and blue circular nodes on a thin
  blue route-line (timeline) for the "Dag per dag" numbers;
- blue on the **dark** sections is left untouched.

Because the blue accents are decorative (not text), they carry no contrast requirement,
so all actual text reaches AA while the blue still reads as a consistent accent.

**Status.** Demonstrated on a single page — `voorbeeldreis-culinaire-cycladen.html`
(see the commented `B1-FIX` block in that page's inline `<style>`) — pending team/client
sign-off. Not yet rolled out site-wide. When approved, lift the CSS into
`theme/styles.css` and apply it to every blue-on-light label across the site.
If the decision is instead to keep the approved look as-is, record B1 here as an
accepted, brand-driven exception.

# Jempi
