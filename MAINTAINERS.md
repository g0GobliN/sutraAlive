# Maintainers — the website

The site is a Vite + React single-page app deployed to Vercel. There is one
landing page and one documentation page; `vercel.json` rewrites `/docs` to
`index.html`.

```
npm install
npm run dev        # syncs the version, then starts Vite
npm run build      # syncs the version, typechecks, builds to dist/
npm run preview    # serve the production build
```

## The version is never hand-written

One source of truth: **GitHub Releases on `g0GobliN/sutra`**.

- `scripts/sync-version.mjs` reads `/releases/latest` (falling back to `/tags`)
  and writes the same payload to `version.json` and `public/version.json`.
- `public/version.json` is served at `/version.json`; the app fetches it with
  `cache: no-store` in `src/lib/release.ts`. If it cannot be read, the version
  badge simply does not render — it never shows a stale, hand-typed tag.
- `prebuild` runs the sync, so every deploy refreshes the snapshot even when
  the tag moved outside the scheduled workflow.

The version appears in two places only: the install block (`PyPI sutra-agent
v…`) and the footer. The header, the left rail and the docs hero stay clean.

### When a new tag is cut (no site edit)

`.github/workflows/version-sync.yml` runs hourly, on demand, and on a
`repository_dispatch` of type `sutra-release`. It syncs the snapshot and pushes
the commit, which triggers the Vercel deploy.

For an immediate update on tag push, add this step to the **`sutra` repository's**
release workflow (this repository cannot see the package repository's tags):

```yaml
- name: Tell the site a release exists
  run: |
    curl -fsS -X POST \
      -H "Accept: application/vnd.github+json" \
      -H "Authorization: Bearer ${{ secrets.SITE_DISPATCH_TOKEN }}" \
      https://api.github.com/repos/g0GobliN/sutraAlive/dispatches \
      -d '{"event_type":"sutra-release"}'
```

Store a token with **Contents: read and write** on `g0GobliN/sutraAlive` as
`SITE_DISPATCH_TOKEN` in the `sutra` repository. The hourly schedule covers a
missed dispatch.

To point the sync at another repository, set `SUTRA_REPO=owner/name`.

## Content

- `src/data.ts` — measured fixtures, modes, clients, config rows, quickstart
  commands, external links.
- `src/landing/*` — one file per home section.
- `src/docs/Docs.tsx` — the documentation page and its anchor navigation.
- `src/figures/trimmer/*` — the interactive isometric trimmer in the shared-core card.
- `src/iso/*` — the Anatomy drawing kit used by the figure.

Install commands and config paths here must match what the package actually
ships. Do not add a host the package does not support.

## Design

`src/styles.css` — `--paper #050505`, `--paper-2 #0C0C0C`, `--plate #F5F5F5`,
`--ink #F5F5F5`, `--muted #8B8B8B`, `--signal #F5F5F5` (white is the only
accent; there is no hue anywhere). Bricolage Grotesque for display, Instrument
Sans for text, JetBrains Mono for commands, paths and the version. The square mark is `/assets/sutra-mark.png`,
always shown on an off-white tile in the header and footer and never recoloured.
