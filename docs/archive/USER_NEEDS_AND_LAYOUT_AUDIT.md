# User Needs and Layout Audit

Date: 2026-05-25

## Result

P0 user-facing requirements are implemented for the Circle/Oval Blueprint Builder workspace:

- Circle and Oval/Ellipse input modes.
- Diameter/radius and width/height sizing.
- Outline/filled mode and thickness.
- Center, axis, coordinates, and row label toggles.
- Canvas zoom out, zoom in, fit, fullscreen, wheel zoom, pointer pan, and touch pinch zoom.
- Center type, bounds, block count, and stacks output.
- Row segment table and copy all rows.
- PNG export renders the full blueprint, not the current pan/zoom viewport.
- Browser print.
- Share link copy with manual-copy fallback.
- Root `/` now renders the builder workspace instead of placeholder content.
- Header, unofficial disclaimer bar, and footer are rendered by the root layout.
- Old Sphere/Dome overpromising URLs redirect to `/` and are removed from sitemap.

## Verification commands

Passed:

```bash
npm run audit
npm test
npx tsc --noEmit
npm run lint
NEXT_TELEMETRY_DISABLED=1 npm run build
```

Production smoke check on port 3100 confirmed:

- `/` returns the builder page.
- Header, disclaimer bar, footer, Build settings, Center type, and Download PNG text appear in rendered HTML.
- `/minecraft-sphere-generator` returns a 307 redirect to `/`.

## Remaining caveat

`npm audit --omit=dev` still reports Next/PostCSS advisories in the dependency chain. This is a dependency upgrade task, not a UI interaction blocker. Do not run `npm audit fix --force` without a separate Next.js upgrade pass.
