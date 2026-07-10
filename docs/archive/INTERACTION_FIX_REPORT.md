# Interaction Fix Report

This package is the P0-only Circle/Oval Blueprint Builder repair pass.

## Completed

- Removed overpromising Sphere, Dome, layer, guide, and preset route files from the app directory.
- Restricted sitemap content to P0 routes only.
- Added legacy redirects for old Circle/Oval aliases and temporary redirects for Sphere/Dome promises.
- Fixed outline-mode `filledBlocks` so "Blocks if filled" is calculated from the full filled geometry, not the outline result.
- Changed PNG export to render a full blueprint canvas independent of the user's current pan/zoom viewport.
- Delayed object URL cleanup after PNG download to avoid revoking the download URL too early.
- Added clipboard fallback UI when `navigator.clipboard.writeText` is unavailable or blocked.
- Isolated touch pinch-zoom from pointer pan to reduce mobile jump/drift.
- Added pointer cancel cleanup.
- Added throttling for pan/zoom analytics events.
- Made the toolbar zoom display dynamic instead of hard-coded at 100%.
- Rewrote audit and smoke tests around the P0 scope.

## Verified locally

- `npm test` passed.
- `npm run audit` passed.
- `npx tsc --noEmit` passed.
- `npm run lint` passed.

## Build status

`next build` compiles successfully, but this container repeatedly times out during Next.js page-data/static-generation work on Node 22. The package keeps type checking and linting as separate required checks. Run final production build on your normal Node/Vercel environment.

## Remaining external note

`npm audit --omit=dev` still flags the current Next.js dependency chain. A forced Next major upgrade was not applied in this repair pass because it changes the React/ESLint peer dependency stack and should be handled as a separate framework upgrade.
