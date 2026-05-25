# BlockLayer

BlockLayer is a printable Minecraft-style circle, ellipse, sphere, dome, and block-count blueprint generator.

It is a pure-front-end Next.js App Router project. The geometry core is implemented as TypeScript pure functions and the interactive blueprint viewer uses Canvas 2D.

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

In the sandbox used to create this package, `npm run test` and `npm run audit` passed. `npm install` timed out in the sandbox, so `npm run lint` and `npm run build` must be verified in a normal local/Vercel environment with dependencies installed.

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
