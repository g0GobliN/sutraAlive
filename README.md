# SUTRA — landing page

The public landing page for [SUTRA](https://github.com/g0GobliN/sutra), tool-output
middleware for AI agents that cuts tool output before the model reads it while keeping every
removed byte retrievable. SUTRA ships today as a Hermes Agent plugin; the page presents the
adapter as one integration, not the whole product.

This is a separate repository from the product source. Nothing here changes the plugin.

## Stack

| Technology | Role |
| --- | --- |
| React + TypeScript + Vite | Application and build |
| GSAP + ScrollTrigger | Scroll-driven engraving and proof-bar reveals |
| Motion | Button and component transitions |
| Three.js + React Three Fiber | The animated closing seal and layered artifact |
| Custom CSS | Stone palette, textures, responsive layout |
| SVG + Canvas | Engraved diagram, connector lines, and the signal field |
| Vercel | Deployment |

Both 3D scenes use a lazy-loaded Three.js chunk. The closing seal pauses when the section
leaves the viewport. The artifact is a schematic of the four real stages, not a simulation: it
mounts when the section approaches the viewport, renders on demand (`frameloop="demand"`), and
falls back to a static layer stack when WebGL is unavailable. Reduced motion leaves the
closing seal still and switches the artifact layers without tweens.

## Local development

Requires Node 20.19 or newer.

```bash
npm install
npm run dev
```

The dev server prints its local URL. To check the production build:

```bash
npm run build
npm run preview
```

`npm run build` runs `tsc --noEmit` first, then Vite.

## Deploy

Vercel detects the Vite project from `vercel.json` and the package manifest. The lockfile is
installed with `npm ci`, the build runs on Node 22 via `.nvmrc`, and the output is `dist/`.
Import this repository in Vercel, or run:

```bash
npx vercel --prod
```

No environment variables, server functions, or external services are needed. The output is
static: `dist/`.

## Content rules

The page is only allowed to state what the repository can prove.

- **54.3% fewer bytes** and **55.2% fewer o200k tokens** come from the eight fixtures in
  `bench/benchmark.py` and `bench/tokens.py` in the product repository.
- **8/8 planted clues** means the restore tool returned the clue in every fixture. It does not
  mean an agent asked for it.
- **0 diffs touched** is a deliberate contract: the patch fixture saves 0.0%.
- The token column is a `tiktoken o200k_base` count. It is not a provider bill, and the site
  does not claim live-model cost or task-success improvements.
- The 96.8% context observation is one seven-agent fleet over two days, reported in the
  product README. It is not presented as a universal benchmark.

If a number changes in the product, change it here and re-run the build.

## Assets

- `public/assets/sutra-mark.webp` and `.png` — the SUTRA arch mark, trimmed and resized for
  the header, hero plate, and footer. The PNG is the fallback; the page loads WebP first.
- `public/assets/og.png` — 1200 × 630 social preview.
- `public/assets/favicon.png` — 128 × 128 icon.

The original brand files remain in the product repository under `public/logo/`.

## Structure

```text
src/
  App.tsx              composition and GSAP choreography
  data.ts              verified copy, links, and proof data
  styles.css           theme and responsive rules
  components/
    Header.tsx         sticky header, scroll progress, mobile menu
    Hero.tsx           first screen, gate mark, marker panel
    MarkerDemo.tsx     recorded-run panel with byte-exact restore paging
    Artifact.tsx       interactive artifact section, labels, fallback
    ArtifactScene.tsx  isometric Three.js scene and layer choreography
    SignalField.tsx    canvas signal field
    GateDiagram.tsx    engraved SVG passage diagram
    ClosingSeal.tsx    deferred loader for the closing 3D gate
    ClosingSealScene.tsx  the animated stone gate and signal pulses
    Sections.tsx       problem, steps, features, proof, install, closing
    CopyButton.tsx     clipboard control with keyboard feedback
public/assets/         images referenced by the page
```

The site respects `prefers-reduced-motion`: GSAP choreography is skipped, the artifact switches
layer states without tweens, the closing seal holds still, the signal canvas renders a static
frame, and CSS transitions collapse.

## Licence

MIT. The SUTRA product is also MIT-licensed.
