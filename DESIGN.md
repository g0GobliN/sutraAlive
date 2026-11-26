# SUTRA — site design system

This file is the contract for this website's look. **Read it before changing any view, and
update it in the same change that alters a token, a type size, a component or a motion rule.**

The site is not "a dark theme with blue accents" to be re-invented: it is a specific system
measured from a reference layout (Nous Research's Hermes page) and then given SUTRA's own
content, mark, glyphs and motion. If you are asked for a small change, make a small change —
do not restyle what is not in scope.

---

## 1. Brand

- Name: **SUTRA** — always uppercase in display copy.
- Tagline: **Less output. More signal.**
- Supporting line: *Deterministic · Local · Recoverable.*
- Voice: engineering-document calm. Short declaratives, no marketing superlatives, no emoji,
  numbers over adjectives. Dashes are em dashes (—) with spaces.
- App icon / favicon: the guard — the engraved stone guardian head with metal wings, white on the
  `--page` field, centred with a 16% margin. Source of truth is `public/assets/mark.png` (512px,
  transparent); `public/assets/favicon.png` is that art composited on the field at 512×512, and
  `public/assets/mark-sm.png` is the 96px-tall raster the header and footer load. It is the only
  raster in the brand system, because engraving cannot be rebuilt from flat CSS shapes. The icon
  itself uses the three-tone cut — a 16px slot cannot hold the cross-hatching. Never put the guard
  on a light chip or a coloured tile — it is white-on-navy only, with no frame, except the hairline
  crest frame used on large surfaces (OG card, docs cover).

---

## 2. Colour

Every colour comes from these tokens in `src/design.css`. Do not hardcode a new hex in a
component; add a token instead.

| Token | Value | Use |
| --- | --- | --- |
| `--page` | `#19192f` | page field |
| `--band` | `#0d0d24` | hero band, header, footer, docs hero |
| `--panel` | `#14142e` | raised panels, table headers |
| `--ink` | `#f2f2f2` | primary text, white buttons |
| `--ink-2` | `#d5d5e4` | body text |
| `--muted` | `#9b9bb6` | labels, meta, captions |
| `--line` | `rgba(242,242,242,.16)` | 1px borders |
| `--line-soft` | `rgba(242,242,242,.08)` | hairline dividers inside blocks |
| `--blue` | `#0000f2` | electric blue: primary button text, chip fills, accent fields |
| `--peri` | `#8585f9` | periwinkle: active nav, links, kickers, markers, focus |
| `--radius` | `3px` | every control, card and panel |

Rules:

- Blue is a **field** (fills, tints at 10–20% alpha) or **text on white**. Never blue body copy.
- Blue chips/tints use `rgba(0,0,242,.14–.18)`; periwinkle tints use `rgba(133,133,249,.07–.1)`.
- Borders are always 1px and never brighter than `--line`.
- No gradients except the retro panel stage (see §7) and the footer wordmark fade.

---

## 3. Typography

Loaded in `index.html`: **Oswald** 200–500, **Barlow Semi Condensed** 400–600, **JetBrains Mono** 400–500, **Inter Tight** 600/700 (closing word only).

| Role | Family | Size | Weight | Notes |
| --- | --- | --- | --- | --- |
| Hero h1 | Oswald | `clamp(44px, 7vw, 82px)` | 300 | line-height .95, tracking -.02em |
| Section h2 | Oswald | ~80px desktop, `clamp(30px,3.4vw,42px)` in docs | 300 | |
| Sub h3 | Oswald | 19–22px | 400 | |
| Body | Barlow Semi Condensed | 15–17px | 400 | line-height 1.5–1.7 |
| Label / kicker / nav | Barlow or Mono | 9.5–13px | 500 | uppercase, tracking .12–.2em |
| Code | JetBrains Mono | 12.5–13px | 400 | inline code is 0.84em of body |

- Display headings are **light (300)**. Never bold a heading to add emphasis; use size or colour.
- Labels are **uppercase + letterspaced**. Sentences are not.
- The wordmark uses Oswald 300 uppercase with tracking `0.18em`.
- The closing footer word is the one exception to the display face: Inter Tight 700, tight tracking.
  It never appears in headings, labels, buttons or body copy — the engraved plates need Oswald above
  it, and the wordmark needs mass to carry the page out.

---

## 4. Layout

- Content column: `.shell` max 1144px, side padding 32px. Docs/legal: `.wrap` max 1144px, 32px.
- Section rhythm: `padding-block: 80px` on `.sec`, separated by `--line-soft` rules, not cards.
- Bands (hero, portal CTA, footer, docs hero) use `--band` and break the column edge to edge.
- Grids: features 2 columns, surfaces 3, plans `200px repeat(4, 1fr)`, docs `208px 1fr` with 68px gap.
- Breakpoints: 1100px (features → 1 col), 820px (docs rail → single column), 900px (modes table scrolls), 760px (general mobile).
- The Modes comparison table never collapses into stacked cells — below 900px it keeps its five columns
  inside `.plans-wrap` (horizontal scroll, sticky `.plans__cell--label` column, "swipe to compare" hint).
  A one-word-per-line table is the failure mode this replaced.
- Controls: 3px radius, 7–9px vertical / 12–15px horizontal padding, 12px uppercase label.

---

## 5. Components

| Component | File | Class root |
| --- | --- | --- |
| Header (split nav + centred wordmark + install CTA) | `src/components/SiteHeader.tsx` | `.hdr` |
| Nav mega menus (desktop hover/click, blue panel) | `src/components/SiteHeader.tsx` | `.mega` |
| Mobile takeover menu (full-screen blue, oversized group titles) | `src/components/SiteHeader.tsx` | `.menu` |
| Hero + install terminal with tabs | `src/landing/Hero.tsx` | `.hero`, `.term` |
| Install surfaces (3 cards) | `src/landing/Surfaces.tsx` | `.surf` |
| Feature rows (6, numbered, art on the right) | `src/landing/Features.tsx` | `.feat` |
| FAQ accordion | `src/landing/Faq.tsx` | `.faq` |
| Modes comparison table | `src/landing/Plans.tsx` | `.plans` |
| Portal CTA band | `src/landing/Portal.tsx` | `.portal` |
| Footer (3 link columns + oversized wordmark) | `src/components/SiteFooter.tsx` | `.foot` |
| Retro sprite panel | `src/components/Retro.tsx` | `.retro` |
| Section glyph | each landing view (duplicated `Glyph()`) | `.sec__glyph` |
| Button | `.btn` (+ `.btn--fill`) | |

Buttons: primary = white fill, `--blue` label; secondary = transparent, 1px `--line`, `--ink`
label; hover moves the border/label to `--peri` (primary inverts to blue label on pure white).

Section headings pair an `h2` with the glyph: `<div class="sec__title"><h2>…</h2><Glyph /></div>`.
The glyph is three ascending pixel bars with a slice detached above the tallest
(`M2 14h4v8H2zM9 9h4v13H9zM16 8h4v14h-4zM16 2h4v3h-4z`, 26px, `--peri`). It replaced an
eye-shaped mark; do not reintroduce anything that reads as an eye or a borrowed logo.

The brand mark is the guard (`src/components/Mark.tsx`): an engraved stone guardian head with
metal wings, white, at 30px in the header, 34px in the footer and 28px on mobile. It is raster
art, not a glyph: `mark.png` is the 512px engraving for large surfaces, and `mark-sm.png` is the
same drawing re-inked to three tones for the chrome, where the cross-hatching would otherwise
read as grey noise. Never redraw it as CSS shapes or as pixels, never invent a second emblem, and
never put it on a tile. Nothing else in the chrome is illustrated; the guard is the only image.

Everything else that is illustrated is a **plate**: one engraved artefact and a mono caption
(`plate iii · the seal`), one per page, in `src/components/ArtPlate.tsx`. A plate is never boxed —
no frame, panel or rounded rectangle. The engraving hangs in the layout and is cropped by it: in the
docs hero it drops through the bottom of the band, on legal pages it bleeds past the right edge of
the page. The plates, their subjects, the generation settings and the cut-out pipeline are specified
in `ART.md` — read it before producing any new artwork.

---

## 6. Motion

All motion lives at the end of `src/design.css` and is disabled under
`prefers-reduced-motion: reduce`. Keep animations subtle and slow; nothing bounces.

The guard does not move. An emblem that spins cannot be read, and the engraved artwork is the one
thing in the chrome meant to be looked at.

| Animation | Timing | What moves |
| --- | --- | --- |
| `retro-noise-flicker` | 2.6s steps(2) | opacity of the character field |
| `retro-noise-drift` | 3.4s steps(3) | 1–3px translate of the same field |
| `retro-scan` | 0.9s linear | 4px scanline pattern |
| `retro-sweep` | 7s cubic-bezier(.4,0,.2,1) | light band crossing the stage |
| `retro-hum` | 5.5s ease-in-out | sprite opacity 1 → .9 |

Feature panels stagger with `-3.2s` / `-1.7s` delays. Interactive transitions are 0.15–0.2s.

---

## 7. Retro sprite panels

`<Retro sprite={SPRITE_X} title="…" meta="…" note="…" seed="x" variant="hero" />`

- The stage is a saturated blue radial field (`#3232d8 → #1e1ebd → #111173`) covered by a
  deterministic character field (`NOISE_CHARS`, 160×40, seeded LCG, 20% alpha) — generated
  in `Retro.tsx`, not stored.
- Sprites are **1-bit**: `█` and spaces only. Shade glyphs (`░▒▓`) turn into moiré stripes at
  small sizes — do not use them.
- Sprite font stack must stay a system mono (`Cascadia Mono`, `Consolas`, `Menlo`, …); Google's
  JetBrains Mono has no box-drawing/block glyphs and breaks alignment.
- Sizes: `.retro__sprite` `clamp(9px, 1.35vw, 13.5px)`, hero `clamp(9px, 1.65vw, 17px)`,
  mobile 8.5px, `line-height: .94`.
- Sprite source is `src/sprites.ts`; it was generated by a one-off script (deleted). If you add
  one, keep the same 48×18 block grammar and regenerate the whole file.

---

## 8. Docs and legal pages

- Both use `SiteHeader` + `SiteFooter`, so they inherit the shell. **Every route ends with the same
  `SiteFooter`** (landing footer: brand lockup + three link columns + version strip + oversized
  wordmark). Pass `root` on sub-pages so hash links become `/#install`; never build a page-specific
  slim footer.
- Docs: banded hero (Oswald, mono meta chips, white + outline buttons) → sticky 208px rail with
  grouped nav (active = white text, 2px periwinkle left rule) → 748px article column. Sections
  are separated by a hairline above each `h2`, `scroll-margin-top: 110px` for anchor jumps.
- Legal: the copy runs the **full 1016px measure** — no 58–66ch caps inside `.legal__body`, so
  paragraphs, lists, tables and the MIT text reach the column edge. The head is one row: title
  left, the page's own plate right at 320px, level with the title and bleeding 44px off the outer
  edge; only the page's own artefact is ever used, never a neighbouring page's. Mono "last
  updated" line under the h1, each `h2` opens with a hairline, periwinkle link underlines,
  contact channels as three bordered cards.
- Doc components: `.doc-facts` (4-up hairline grid), `.doc-note` (+`--warn`), `.table-wrap`,
  `.codeblock`, `.doc-links` (chip row), `.doc-steps`, `.doc-trouble`.
- Code chips: `rgba(0,0,242,.16)` fill, 1px `rgba(133,133,249,.26)` border, `#dcdcff` text.
- Never change copy or route logic while restyling these pages.

---

## 9. Do / Don't

**Do**

- Reuse existing tokens, classes and spacings; add a new rule only when a component truly needs one.
- Keep display type light and let hierarchy come from size, colour and hairlines.
- Keep the page field navy; bands are darker, never lighter than `--page`.
- Check the result at 1440px and at ≤820px before finishing.

**Don't**

- Don't introduce new colours, gradients, shadows, glow, rounded >4px corners or drop shadows.
- Don't switch to a heavy display weight, a serif, or a second sans beyond the three loaded fonts.
- Don't add icons from an icon set; the site uses two marks only (brand mark, section glyph).
- Don't animate layout properties or add scroll-jacking; motion is ambient only.
- Don't restyle the docs/legal prose with card-on-card nesting; they are typographic pages.

---

## 10. File map

```
index.html            fonts, theme-color, meta, noscript
src/main.tsx          imports iso.css → styles.css → design.css (order matters)
src/design.css        THE design system: tokens, header, hero, sections, retro, docs, legal, motion
src/styles.css        legacy base still used by docs/legal primitives; do not extend it
src/data.ts           nav links, modes, clients, metrics, config rows
src/sprites.ts        generated 1-bit sprites
src/components/       SiteHeader, SiteFooter, Retro, CodeBlock, CopyButton, Version
src/landing/          Landing + Hero, Surfaces, Features, Faq, Plans, Portal
src/docs/Docs.tsx     documentation page (/docs)
src/integrations/Integrations.tsx  the full integration matrix (/integrations)
src/legal/LegalPage.tsx  privacy, terms, contact
```

Routes: `/` landing, `/docs` documentation, `/integrations` matrix, `/privacy`, `/terms`,
`/contact`. `DOCS_LINKS.integrations` must stay `/integrations` — the matrix lives on this site,
not in the GitHub repository.

```
```

Build checks: `npx tsc --noEmit` and `npx vite build`. Do **not** run `npm run build` for a
visual check — its `prebuild` step rewrites `version.json`.

---

## 11. Known traps (already hit once)

1. **An unterminated CSS comment silently kills everything below it.** `/* faq` with no `*/`
   wiped the FAQ, plans, portal and footer styles. After editing `design.css`, confirm the
   build output CSS size still grows and the sections still look styled.
2. **`.legal-page .wrap` beats `.legal__inner`.** `wrap` sets `max-width: 1144px` on the same
   element, so centring a legal column needs `.legal-page .wrap.legal__inner`.
3. **Native `<details>` never sets an `is-open` class.** Style open state with `[open]`.
4. **Google-served JetBrains Mono has no box glyphs.** Use the system mono stack for sprites.
5. **`register_preview` may reject the dev server**; drive the page with the browser tools instead.

---

## 12. Pre-flight checklist

- [ ] Tokens only — no new hex values in components.
- [ ] Headings Oswald 300/400, labels uppercase mono/sans, body Barlow.
- [ ] Every new block sits on the 1144px shell and the 80px section rhythm.
- [ ] Motion is ambient, ≤1 concept per surface, disabled under reduced motion.
- [ ] Docs/legal keep their copy, routes and anchors untouched.
- [ ] `npx tsc --noEmit` and `npx vite build` pass; page checked visually at desktop and mobile.
- [ ] This file updated if any of the above changed.
