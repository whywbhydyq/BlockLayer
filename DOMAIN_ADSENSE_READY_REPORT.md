# BlockLayer domain and AdSense readiness patch report

Production domain: `https://blocklayer.ymirtool.com`

## Completed changes

- Added `public/ads.txt` with the configured AdSense publisher record:
  `google.com, pub-1653188471819736, DIRECT, f08c47fec0942fa0`
- Added AdSense account metadata in `src/app/layout.tsx`:
  `google-adsense-account = ca-pub-1653188471819736`
- Added the AdSense Auto Ads script exactly once in `RootLayout` with `id="adsense-auto-ads"`.
- Added `/contact` page with a lightweight support/contact explanation.
- Added `/contact` to `staticPages`, so it is included in `sitemap.xml`.
- Added Contact to the footer legal/navigation links.
- Replaced hardcoded print URL text in blueprint tables with `siteUrl()`.
- Added `.env.example` documenting `NEXT_PUBLIC_SITE_URL=https://blocklayer.ymirtool.com`.
- Updated `README.md` with production-domain and AdSense readiness checks.
- Extended `scripts/audit.mjs` to check ads.txt, AdSense meta/script, Contact, footer link, production domain, and `.env.example`.
- Removed generated `.audit-dist` from the final packaged project.

## Verified locally

Passed:

```bash
npm run test
npm run audit
```

Also passed a TS/TSX syntax transpile check for all source and test files.

## Not verified in this sandbox

The following commands still require a normal environment with dependencies installed:

```bash
npm install
npm run lint
npm run build
```

In this sandbox, `node_modules` is absent and `next` is not installed, so `npm run lint` and `npm run build` fail with `next: not found`. This is an environment/dependency limitation, not proof of source build failure.

## Live-domain checks required after Vercel deployment

After DNS and Vercel binding are complete, verify:

```bash
curl -I https://blocklayer.ymirtool.com
curl https://blocklayer.ymirtool.com/robots.txt
curl https://blocklayer.ymirtool.com/sitemap.xml
curl https://blocklayer.ymirtool.com/ads.txt
```

Manual browser checks still required:

- Homepage and core tool pages load on the production domain.
- Canonical URLs point to `https://blocklayer.ymirtool.com`.
- Sitemap URLs use `https://blocklayer.ymirtool.com`.
- Ads.txt is accessible at the root domain.
- AdSense script is present once, not duplicated.
- Canvas, slider, copy, download, print, fullscreen, and mobile layout work in the browser.
