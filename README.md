# BlockLayer

BlockLayer is a printable Minecraft-style circle, ellipse, sphere, dome, and block-count blueprint generator.

It is a pure-front-end Next.js App Router project. The geometry core is implemented as TypeScript pure functions and the interactive blueprint viewer uses Canvas 2D.


## Source of truth and archived reports

The active implementation contract is the current source code plus `scripts/audit.mjs`. Historical repair reports have been moved to `docs/archive/` and should be treated as superseded context, not as current acceptance criteria.

`src/components/tool/ToolShell.tsx` is the server wrapper and `src/components/tool/BlueprintWorkspace.tsx` is the primary interactive homepage/tool-page workspace. Older modular tool components remain in `src/components/tool/` for migration/reference only; see `src/components/tool/LEGACY_COMPONENTS.md` before reconnecting them.

## MVP features

- Circle generator with diameter/radius input, outline/filled mode, outline thickness, row segments, block counts, stacks, shulker estimate, PNG/SVG/CSV/print/copy/share link.
- Ellipse / oval generator with width/height input, outline/filled mode, row segments, block counts, exports, and print view.
- Sphere generator using true 3D voxel inclusion, hollow/solid mode, shell thickness, layer slider, previous-layer ghost, layer counts, total counts, and exports.
- Dome generator with independent dome mode, cap height, top/bottom half, hollow/solid mode, layer slider, layer table, and print selected range.
- Canvas pan, zoom, fit-to-screen, fullscreen, high-DPI rendering, coordinates, high contrast mode, and mobile-responsive layout.
- SEO page matrix: home, five core tool pages, twenty preset pages, eight guide pages, alias routes, sitemap, robots, canonical metadata, JSON-LD, breadcrumbs.
- Compliance pages: About, Privacy, Terms, Disclaimer.

## Compliance statement

NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.

BlockLayer does not use official Minecraft logos, official textures, official screenshots, official fonts, account integration, uploads, or game-file downloads.

## Commands

```bash
npm install
npm run test
npm run audit
npm run lint
npm run build
```

Current local verification for this package: `npx tsc --noEmit --pretty false --incremental false`, `npm run audit`, `npm run lint`, and `node --check scripts/*.mjs` passed. `npm run build` and all test commands were intentionally not executed in this repair pass.

## Deployment

The project is designed for Vercel. `vercel.json` includes an `ignoreCommand` script to avoid wasting builds on stale commits.

## Domain and AdSense readiness

Production domain: `https://blocklayer.ymirtool.com`

Required environment variable for production and preview consistency:

```bash
NEXT_PUBLIC_SITE_URL=https://blocklayer.ymirtool.com
```

AdSense readiness items included in this package:

- `public/ads.txt` contains the configured publisher record.
- Root layout includes the Google AdSense account meta tag.
- Root layout inserts the Auto Ads script once with `id="adsense-auto-ads"`.
- About, Privacy, Terms, Disclaimer, and Contact pages are linked from the footer.
- Sitemap and robots use the canonical production domain through `siteUrl()`.

Before submission, verify the live domain after Vercel deployment:

```bash
curl -I https://blocklayer.ymirtool.com
curl https://blocklayer.ymirtool.com/robots.txt
curl https://blocklayer.ymirtool.com/sitemap.xml
curl https://blocklayer.ymirtool.com/ads.txt
```

Do not submit `.audit-dist`, `.next`, `node_modules`, or other generated build artifacts to the repository.

## Latest homepage task-fit repair

- Homepage and tool pages now render a real H1 inside the active tool workspace.
- Header exposes Circle, Oval, Sphere, Dome, Block count, Presets, and Guides without removing any existing tool mode.
- `/presets/[slug]` and `/guides/[slug]` remain real pages and are no longer catch-all redirected away.
- Preset pages include preset inputs, example output, common mistakes, and related preset/tool links.
- Guide pages include workflow steps, common mistakes, related guides, and JSON-LD HowTo schema.
- Advanced thickness, shell, and dome options are folded into an advanced section so the first screen remains task-first.

## Latest code audit repair

- Layered CSV export now supports a selected layer range, matching the selected-range print workflow for sphere and dome builds.
- Browser print output now hides the interactive workspace and prints only the generated print sheet, so selected layer ranges do not also print the live canvas view.
- Presets and Guides index pages now emit ItemList JSON-LD in addition to their visible cards and breadcrumbs.
- Legacy content components no longer link to the old `/tools/minecraft-circle-generator` URL.
- Audit and smoke source checks were extended for selected-range CSV, print-sheet-only output, ItemList schema, and stale `/tools` links.

## Latest routing and accessibility repair

- Legacy size URLs such as `/minecraft-31-circle` now redirect to the restored preset pages instead of query-string tool URLs.
- Legacy guide URLs such as `/how-to-build-a-circle-in-minecraft` now redirect to `/guides/...` pages instead of skipping the guide asset.
- Legacy oval, sphere, dome, CSV, print, and block-count guide aliases now point at their matching restored preset or guide pages.
- Root layout now includes a skip link to `#main`, and legal/support pages expose `id="main"` for keyboard users.
- The CSV guide copy now describes all-layer, current-layer, and selected-range CSV workflows for layered blueprints.


## Latest performance boundary repair

- `ToolShell.tsx` is now a server wrapper that renders the H1, task intro, initial server-generated blueprint, and server-side content package.
- `src/components/tool/BlueprintWorkspace.tsx` contains the interactive client workspace; `toolContent.ts` no longer enters that client graph.
- Sphere and dome generation for client-side edits runs through `src/workers/blueprintWorker.ts`; the synchronous geometry functions are retained inside `src/lib/geometry/generateBlueprint.ts` for server/worker use.
- PNG, SVG, CSV, and print helpers are imported on demand from click handlers instead of being static client imports.
- The printable sheet is mounted only for a print job, then cleared after browser print, so large hidden layer tables do not stay in the normal DOM.


## Latest interaction safety repair

- The blueprint canvas no longer recenters on double-click and ordinary page scrolling remains available over the canvas area.
- Mouse-wheel zoom is intentionally gated behind Ctrl/Cmd + wheel; toolbar buttons, keyboard shortcuts, and pinch zoom remain available.
- Touch screens allow vertical page swipes over the canvas while horizontal one-finger drags can pan the blueprint, reducing accidental canvas movement during page scroll.
- Number inputs in the active workspace and retained legacy controls blur on wheel so scrolling the page cannot silently change dimensions, thickness, cap height, or print ranges.
- Share/manual-copy fallback dialogs now expose modal semantics and close with Escape.
- URL query updates are debounced to avoid excessive history replacement while editing values.

## Latest CSS and legacy cleanup repair

- `globals.css` now has explicit sections for foundation/site chrome, legacy component compatibility, the current task-first workspace, content assets, and print policy.
- Builder-only print hiding is scoped to `.builder-page` so guide/index/legal content pages are not accidentally hidden by current workspace print rules.
- Legacy modular tool components now carry file-level migration notes and are documented in `src/components/tool/LEGACY_COMPONENTS.md`.
- Historical repair/audit Markdown reports are archived under `docs/archive/`; the current source plus `scripts/audit.mjs` is the source of truth.

## Latest task-focused content package repair

- `src/lib/content/toolContent.ts` centralizes page-specific content packages for home, circle, oval, sphere, dome, block count, pixel circle, center guide, alias landings, and preset pages.
- `ToolContentSection.tsx` now renders below-workspace how-to steps, output explanations, tips, FAQ, and internal links from the active page task instead of one generic content block while `BlueprintWorkspace.tsx` stays focused on interaction.
- Core tool pages pass explicit `contentKey` values so content remains aligned with the page query and tool capability while staying below the interactive workspace.
- The first screen remains tool-first; additional content modules are placed after the workspace and do not block inputs, preview, exports, or Companion Mode.
