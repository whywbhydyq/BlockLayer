# BlockLayer Unfinished Plan Execution Report

Date: 2026-05-24

This package continues from the audited BlockLayer MVP and executes the unfinished items identified in the development-plan comparison.

## Completed in this pass

### Engineering hygiene

- Added `.prettierrc.json`.
- Added `format` and `format:check` package scripts.
- Added `prettier` to devDependencies.
- Added `tsconfig.test.json` for local geometry/export validation without requiring Next.js runtime.
- Fixed invalid JSX attributes such as `initialDiameter=undefined` in tool pages.

### SEO / content architecture

- Added `src/lib/seo/schema.ts`.
- Added JSON-LD output for WebSite, SoftwareApplication, BreadcrumbList, FAQPage, HowTo, and Disclaimer schemas.
- Added `JsonLd` component.
- Added `Breadcrumbs` component and wired it into tool, preset, guide, and alias pages.
- Added `RelatedTools` and `RelatedGuides` components.
- Added `DisclosureBox` component.

### Analytics completion

Implemented the development-plan analytics event names:

- `tool_view`
- `shape_changed`
- `params_changed`
- `generate_success`
- `large_blueprint_warning`
- `layer_changed`
- `zoom_used`
- `pan_used`
- `fit_to_screen_clicked`
- `download_png_clicked`
- `download_svg_clicked`
- `download_csv_clicked`
- `print_clicked`
- `copy_summary_clicked`
- `copy_row_list_clicked`
- `copy_layer_summary_clicked`
- `copy_share_url_clicked`
- `faq_opened`
- `related_tool_clicked`
- `related_guide_clicked`
- `affiliate_clicked`
- `ad_slot_viewed`

Legacy event names are normalized in `src/lib/analytics/events.ts`.

### Tests and audits

- Added `tests/export.test.ts`.
- Expanded `npm run test` to compile and run geometry + export tests.
- Strengthened `scripts/audit.mjs` to check:
  - JSON-LD/schema support.
  - Breadcrumbs.
  - Related links.
  - Disclosure component.
  - Prettier configuration.
  - Export tests.
  - Exact analytics event names.
  - No invalid JSX `=undefined` assignment.
  - Required UI/export/compliance strings.
  - Preset/guide/alias route counts.

## Verified locally

The following commands passed:

```bash
npm run test
npm run audit
```

## Still not verified in this sandbox

The following commands could not be completed because dependency installation timed out and `node_modules` is not present:

```bash
npm install --ignore-scripts --no-audit --no-fund
npm run lint
npm run build
```

Observed local output after install timeout:

```text
next: not found
```

This is an environment/dependency-availability issue, not a confirmed source-code build failure. Run the commands after installing dependencies locally or in Vercel.

## Remaining non-blocking structural gap

The project still keeps several tool controls inside `ToolShell.tsx` instead of fully splitting every planned component file (`CircleControls`, `EllipseControls`, `SphereControls`, `DomeControls`, `PrintPanel`, etc.). Functionally, those controls are implemented. A strict component-file refactor can still be done after a successful Next.js build baseline, because refactoring now without installed React/Next dependencies would increase unverified risk.
