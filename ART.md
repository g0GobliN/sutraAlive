# Brand art — production playbook

One engraving style, used everywhere: **carved artefacts on the navy field**. The mark, every page
plate, the closing footer plate and the social card come from this world.

This file is written so a new page artwork can be produced in one pass. Read §1, copy the prompt in
§3, run the command in §4, drop in the snippet in §5, check §7. Nothing else to decide.

---

## 1. The look

| | |
| --- | --- |
| Medium | copperplate / woodcut engraving — fine parallel hatching, stipple in the shadows |
| Subject | one artefact, centred: carved stone, cast iron, worn metal |
| Colour | white and pale silver line art on a black ground. The page field becomes its ground |
| Lighting | flat frontal; no cast shadow onto a floor, no rim light |
| Background | none. The object floats |
| Composition | single object, centred, generous margin, silhouette readable at 30px |
| Mood | ancient, utilitarian, quietly ceremonial — a tool that outlived its maker |

The mark (`the guard`, a stone head with metal wings) is the one face in the system. Everything else
is an object: never mascots, never people, never UI icons.

**Never:** photorealism, gradients, glow, 3D renders, chalk, pencil, watercolour, cartoon outline,
pixel art, emoji. **No text inside the artwork** — engraved lettering turns to gibberish at every size.

## 2. The four places art appears

| Where | What it is | Component |
| --- | --- | --- |
| Header / footer lockup | the guard, 30px / 34px / 28px | `src/components/Mark.tsx` |
| Page hero | the plate: art + mono caption | `src/components/ArtPlate.tsx` |
| Scrolling the page | the same art as a fixed wash behind content | `src/components/PageArt.tsx` |
| Footer bottom | the closing plate: wordmark set heavy, fading down | `src/components/SiteFooter.tsx` |

Rules that hold in all four: **no frame, no panel, no rounded rectangle, no drop shadow.** The art is
cropped by the layout, not contained by it. Engraving cannot be rebuilt from flat CSS shapes or
pixels — the three-tone cut in §4 is the only permitted variant.

## 3. The prompt

Copy verbatim, change only the subject:

> Engraved etching of **⟨subject⟩**, white and pale silver line art on a pure black background, high
> contrast, dense cross-hatching, carved stone lit from the front, centred in a square, strong
> silhouette that survives at small size, no text, no frame, no scenery, only white and grey line art
> on black.

Generate at 1024×1024, 1:1. Subjects already used, so new ones must not repeat:

| # | Page | Subject |
| --- | --- | --- |
| i | docs | open stone tablet with a stylus |
| ii | integrations | two clasp halves joining |
| iii | privacy | seal amulet with a keyhole |
| iv | terms | law tablet with a balance scale |
| v | contact | stone hand holding a sealed letter |
| vi | security | shield with a keyhole boss |
| vii | license | stamp press with a seal disc |
| viii | recovery | locked chest with a key |

Next plate takes **ix**. Pick an object the page's reader would recognise as belonging to it; if you
cannot name the object in two words, the metaphor is wrong.

## 4. One command

```bash
mkdir -p .tmp-art && curl -fsSL -o .tmp-art/new.jpg "<generated image url>"
node scripts/art.mjs .tmp-art/new.jpg key            # → public/assets/art/key.png (420px)
node scripts/art.mjs .tmp-art/new.jpg key --chrome   # → public/assets/key-sm.png (96px, emblem)
node scripts/art.mjs .tmp-art/new.jpg key --big      # → public/assets/key.png (512px, brand)
```

The script trims the black, uses luminance as alpha, paints `#f2f2f2`, cuts the three-tone ramp and
writes a palette PNG. It prints the file size and the two snippets to paste.

If it is ever run by hand, this is the whole pipeline:

```js
trim({ background: "#000000", threshold: 18 });          // kill the ground
const t = clamp((luma / 255 - 0.22) / 0.62);             // normalise the engraving
const v = Math.pow(t, 0.9);                              // small lift in the shadows
const a = v > 0.62 ? 1 : v > 0.32 ? 0.62 : 0;            // three tones: light, hatch, none
resize({ height: 420, kernel: "lanczos3" }).sharpen({ sigma: 0.5 });
png({ palette: true, colours: 32, compressionLevel: 9 });
```

The three-tone ramp is why the art survives at 30px: full engraving turns to grey noise below ~40px.
The same drawing re-inked is not a second logo.

## 5. Placing it

**Docs / integrations hero** — art in the right column, dropping through the bottom of the band:

```tsx
<ArtPlate className="docs-hero__art" src="/assets/art/key.png" caption="plate ix · the key" />
```

**Legal page** — two-column opening, art bleeding past the page edge. The page already renders it:

```tsx
// src/legal/LegalPage.tsx
const PLATES: Record<LegalKind, { src: string; caption: string }> = {
  privacy: { src: "/assets/art/seal.png", caption: "plate iii · the seal" },
  …
};
```

**The wash** — required on every page that shows a plate, same `src`:

```tsx
<PageArt src="/assets/art/key.png" />
```

Sizes and opacities are already in `src/design.css` (`352px` docs hero, `344px` legal, art wash at
`18%`, closing plate word in Inter Tight 700 with a periwinkle gradient). Do not invent new values;
adjust there if the composition demands it and record why in `DESIGN.md`.

Caption format is fixed: `plate <roman> · the <object>`, lowercase, mono, no full stop.

## 6. Motion

- **Plate → wash, scroll-linked.** At the top the plate is the art and the wash is invisible. One
  0–1 progress (starts 140px in, completes at 760px) drives both halves — never a threshold:
  - the **hero plate stays put.** It is the figure at the top of the page and it does not move,
    shrink, dissolve or cross into the copy — motion on the artwork itself read as a gimmick, and
    art that slides over the text stops being art. The band's edge simply crops it as you scroll
    past, the way every other element on the page scrolls.
  - the **wash rises behind the column**, from 0 to its `0.18` weight, descending 18vh and settling
    from 93% to 100% scale, so the same engraving arrives low in the page as the plate scrolls away.
    This is the whole transition: the art does not move, the page gains its ghost.
  The value is published once as `--art-p` on the root and eased inside one rAF loop, so it trails
  a flick of the wheel. Scrolling back up runs it in reverse. Below 820px the plate is hidden — the
  wash is the only art and it also starts invisible, arriving on scroll.
- **Closing plate: still.** The footer wordmark is set in Inter Tight 700 at closing scale — the one
  place on the site that leaves Oswald, because the display face is light and the word needs mass —
  under a hairline and filled with a periwinkle gradient that dissolves toward the floor, guard ghosted
  at 10% on the right (hidden below 820px). It sits on the same 1144px column as the rest of the page
  and is left-aligned like every heading, tracking `-0.03em` so the letters lock into one block. No
  reveal, no sweep, no rotation — the weight of the word is the statement, and a moving footer would
  compete with the art wash above it.
- Everything is off under `prefers-reduced-motion: reduce`. Nothing bounces, nothing spins — the
  emblem sits still because it is meant to be read.

## 7. Checklist before shipping a new artwork

1. The object is legible as a silhouette at 30px, and still has hatched detail at 420px.
2. One object, centred, no text, no frame, no scenery.
3. Transparent PNG, palette-encoded, under ~160KB.
4. Plate in the hero **and** `PageArt` with the same file.
5. Caption uses the next free numeral and two-word object name.
6. `npx tsc --noEmit` and `npx vite build` clean.
7. Looked at 1360 and 390: art crops at the band or page edge, never over text, never in a box.
