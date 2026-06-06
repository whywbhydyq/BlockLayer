import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const failures = [];
const mustExist = [
  'src/app/page.tsx',
  'src/app/minecraft-circle-generator/page.tsx',
  'src/app/minecraft-oval-generator/page.tsx',
  'src/app/minecraft-sphere-generator/page.tsx',
  'src/app/minecraft-dome-generator/page.tsx',
  'src/app/minecraft-block-count-calculator/page.tsx',
  'src/app/minecraft-pixel-circle/page.tsx',
  'src/app/odd-even-minecraft-circle-centers/page.tsx',
  'src/app/minecraft-layer-by-layer-sphere/page.tsx',
  'src/app/minecraft-dome-blueprint/page.tsx',
  'src/app/presets/[slug]/page.tsx',
  'src/app/presets/page.tsx',
  'src/app/guides/[slug]/page.tsx',
  'src/app/guides/page.tsx',
  'src/app/about/page.tsx',
  'src/app/privacy/page.tsx',
  'src/app/terms/page.tsx',
  'src/app/disclaimer/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/sitemap.ts',
  'src/app/robots.ts',
  'src/app/opengraph-image.tsx',
  'src/app/twitter-image.tsx',
  'src/components/tool/ToolShell.tsx',
  'src/components/tool/BlueprintWorkspace.tsx',
  'src/components/tool/useBlueprintResult.ts',
  'src/components/tool/ToolContentSection.tsx',
  'src/components/tool/BlueprintCanvas.tsx',
  'src/components/tool/WarningPanel.tsx',
  'src/lib/geometry/circle.ts',
  'src/lib/geometry/ellipse.ts',
  'src/lib/geometry/sphere.ts',
  'src/lib/geometry/dome.ts',
  'src/lib/geometry/generateBlueprint.ts',
  'src/workers/blueprintWorker.ts',
  'src/lib/export/exportText.ts',
  'src/lib/export/exportPng.ts',
  'src/lib/export/exportSvg.ts',
  'src/lib/export/exportCsv.ts',
  'src/lib/render/canvasRenderer.ts',
  'src/lib/seo/pages.ts',
  'src/lib/content/toolContent.ts',
  'src/lib/content/toolContentTypes.ts',
  'docs/SEO_GROWTH_PLAN.md',
  'public/ads.txt'
];
for (const file of mustExist) if (!existsSync(join(root, file))) failures.push(`Missing required file: ${file}`);

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

const homePage = read('src/app/page.tsx');
for (const needle of ['ToolShell', 'Minecraft Circle Generator & Blueprint Builder', 'initialShape="circle"']) {
  if (!homePage.includes(needle)) failures.push(`Homepage missing builder workspace: ${needle}`);
}
if (homePage.includes('Hello')) failures.push('Homepage still contains placeholder Hello content');

const layout = read('src/app/layout.tsx');
for (const needle of [
  '<Header />',
  'skip-link',
  'global-disclaimer',
  '<Footer />',
  'unofficial fan-made tool',
  'google-adsense-account',
  'AdSenseAutoAds'
]) {
  if (!layout.includes(needle)) failures.push(`Root layout missing shell/compliance item: ${needle}`);
}
if (layout.includes('pagead2.googlesyndication.com') || layout.includes('adsbygoogle.js')) {
  failures.push('Root layout must not globally load the AdSense script');
}
if (layout.includes('languages: { en:')) {
  failures.push('Single-language site must not emit an incomplete hreflang alternate pointing only at the homepage');
}
for (const needle of ["metadataBase: new URL(DEFAULT_SITE_URL)", "`${DEFAULT_SITE_URL}/opengraph-image`", "`${DEFAULT_SITE_URL}/twitter-image`"] ) {
  if (!layout.includes(needle)) failures.push(`Root metadata missing SEO image/canonical base item: ${needle}`);
}
const adsenseGate = read('src/components/ads/AdSenseAutoAds.tsx');
for (const needle of ['usePathname', 'adsense-auto-ads', 'pagead2.googlesyndication.com', 'adsbygoogle.js']) {
  if (!adsenseGate.includes(needle)) failures.push(`AdSense route gate missing: ${needle}`);
}
for (const deniedPath of ['/about', '/privacy', '/terms', '/disclaimer', '/contact', '/404', '/_not-found']) {
  if (!adsenseGate.includes(`'${deniedPath}'`)) failures.push(`AdSense route gate should deny ${deniedPath}`);
}

for (const page of [
  'src/app/about/page.tsx',
  'src/app/privacy/page.tsx',
  'src/app/terms/page.tsx',
  'src/app/disclaimer/page.tsx',
  'src/app/contact/page.tsx'
]) {
  if (!read(page).includes('id="main"')) failures.push(`${page} should expose id="main" for skip-link accessibility`);
}

const aboutPage = read('src/app/about/page.tsx');
for (const needle of ['What BlockLayer is designed to do', 'How the calculators are maintained', 'Where to start']) {
  if (!aboutPage.includes(needle)) failures.push(`About page missing E-E-A-T support section: ${needle}`);
}
if ((aboutPage.match(/<p>/g) || []).length < 8) failures.push('About page should include enough visible explanatory paragraphs for an About-page quality gate');

const pages = read('src/lib/seo/pages.ts');
for (const path of [
  '/',
  '/minecraft-circle-generator',
  '/minecraft-oval-generator',
  '/minecraft-sphere-generator',
  '/minecraft-dome-generator',
  '/minecraft-block-count-calculator',
  '/minecraft-pixel-circle',
  '/odd-even-minecraft-circle-centers',
  '/minecraft-layer-by-layer-sphere',
  '/minecraft-dome-blueprint',
  '/presets',
  '/guides',
  '/about',
  '/privacy',
  '/terms',
  '/disclaimer',
  '/contact'
]) {
  if (!pages.includes(`'${path}'`)) failures.push(`Sitemap path missing: ${path}`);
}
for (const needle of ['circlePresets', 'ovalPresets', 'spherePresets', 'domePresets', 'guidePages', 'presetPages']) {
  if (!pages.includes(needle)) failures.push(`SEO matrix missing: ${needle}`);
}
if (!pages.includes('quickAnswer')) failures.push('Guide configuration should include independent quickAnswer text for non-template SERP/SXO answers');

const seoSchema = read('src/lib/seo/schema.ts');
for (const needle of ['WebApplication', 'Article', 'Organization', 'WebSite', 'ContactPage', 'WebPage', 'contactPoint', 'sameAs', 'mainEntityOfPage', "inLanguage: 'en'", 'socialImage()', 'image: socialImage()']) {
  if (!seoSchema.includes(needle)) failures.push(`SEO schema module missing active schema type: ${needle}`);
}
for (const forbidden of ['FAQPage', 'HowTo']) {
  if (seoSchema.includes(forbidden)) failures.push(`SEO schema module should not emit restricted/deprecated schema type: ${forbidden}`);
}
if (!existsSync(join(root, 'public/llms.txt'))) failures.push('GEO llms.txt file missing');
else {
  const llms = read('public/llms.txt');
  for (const needle of [
    'AI citation guidance',
    'How to Build an Oval in Minecraft',
    'How to Build a Dome in Minecraft',
    'Minecraft Block Counts, Stacks, and Shulkers',
    'Minecraft Blueprint Presets',
    'sitemap.xml',
    'Do not describe BlockLayer as an official Minecraft'
  ]) {
    if (!llms.includes(needle)) failures.push(`llms.txt missing GEO citation item: ${needle}`);
  }
}
const robotsSource = read('src/app/robots.ts');
for (const needle of ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'CCBot']) {
  if (!robotsSource.includes(needle)) failures.push(`Robots AI crawler policy missing: ${needle}`);
}
const nextConfigSource = read('next.config.mjs');
for (const needle of ['X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy', 'Strict-Transport-Security', 'X-Frame-Options', 'Content-Security-Policy-Report-Only', '/guides/print-minecraft-blueprints']) {
  if (!nextConfigSource.includes(needle)) failures.push(`Next SEO/security config missing: ${needle}`);
}

const presetPage = read('src/app/presets/[slug]/page.tsx');
for (const needle of ['Breadcrumbs', 'Preset details', 'Example output', 'How to use this preset', 'presetGuidance', 'Common mistakes', 'Related presets']) {
  if (!presetPage.includes(needle)) failures.push(`Preset page missing long-tail content section: ${needle}`);
}
const guidePage = read('src/app/guides/[slug]/page.tsx');
for (const needle of [
  'Breadcrumbs',
  'guideSchema',
  'Quick answer',
  'guide-section-links',
  'Recommended workflow',
  'When this guide is the right fit',
  'Build-session checks',
  'Export and verification advice',
  'Common mistakes to avoid',
  'Related blueprint guides',
  'guideSupportContent',
  'page.steps',
  'page.quickAnswer'
]) {
  if (!guidePage.includes(needle)) failures.push(`Guide page missing content section: ${needle}`);
}
if (guidePage.includes('{page.description} Start with the correct center')) failures.push('Guide quick answer should use an independent quickAnswer field, not description concatenation');
for (const guideSlug of [
  'how-to-build-a-circle-in-minecraft',
  'odd-even-minecraft-circle-centers',
  'how-to-build-an-oval-in-minecraft',
  'how-to-build-a-sphere-in-minecraft',
  'how-to-build-a-dome-in-minecraft',
  'minecraft-blueprint-csv-export',
  'minecraft-blueprint-printing',
  'minecraft-block-counts-stacks-shulkers'
]) {
  if (!guidePage.includes(`'${guideSlug}'`)) failures.push(`Guide support content missing slug: ${guideSlug}`);
}

const presetIndex = read('src/app/presets/page.tsx');
for (const needle of ['Minecraft Blueprint Presets', 'presetPages', 'Circle presets', 'Dome presets']) {
  if (!presetIndex.includes(needle)) failures.push(`Preset index missing content: ${needle}`);
}
if (!presetIndex.includes('itemListSchema')) failures.push('Preset index should render ItemList schema');
if (!presetIndex.includes('collectionPageSchema')) failures.push('Preset index should render CollectionPage schema');
if (presetIndex.includes('websiteSchema')) failures.push('Preset index must not duplicate root WebSite schema');
const guideIndex = read('src/app/guides/page.tsx');
for (const needle of ['Minecraft Blueprint Guides', 'guidePages', 'All guides']) {
  if (!guideIndex.includes(needle)) failures.push(`Guide index missing content: ${needle}`);
}
if (!guideIndex.includes('itemListSchema')) failures.push('Guide index should render ItemList schema');
if (!guideIndex.includes('collectionPageSchema')) failures.push('Guide index should render CollectionPage schema');
if (guideIndex.includes('websiteSchema')) failures.push('Guide index must not duplicate root WebSite schema');
const header = read('src/components/layout/Header.tsx');
for (const needle of ['href="/presets"', 'href="/guides"']) {
  if (!header.includes(needle)) failures.push(`Header should link to index route: ${needle}`);
}
const footer = read('src/components/layout/Footer.tsx');
for (const needle of [
  'footerGroups',
  'Blueprint tools',
  'Planning resources',
  'Site information',
  '/minecraft-sphere-generator',
  '/guides/minecraft-blueprint-printing',
  '/guides/minecraft-blueprint-csv-export'
]) {
  if (!footer.includes(needle)) failures.push(`Footer should expose crawl path group: ${needle}`);
}
const footerCss = read('src/app/globals.css');
for (const needle of ['footer-link-groups', 'footer-summary']) {
  if (!footerCss.includes(needle)) failures.push(`Footer crawl groups missing CSS selector: ${needle}`);
}

const toolShell = read('src/components/tool/ToolShell.tsx');
for (const needle of [
  'Minecraft Circle Generator & Blueprint Builder',
  'getToolContentPackage',
  'generateBlueprint',
  'initialResult',
  'BlueprintWorkspace',
  'ToolContentSection',
  'contentPackage.intro'
]) {
  if (!toolShell.includes(needle)) failures.push(`ToolShell server wrapper missing feature: ${needle}`);
}
if (toolShell.includes("'use client'")) failures.push('ToolShell should be a server wrapper, not the client workspace');
if (!toolShell.includes('IntroHeading') || !toolShell.includes('introHeadingLevel')) failures.push('ToolShell should support h2 intro headings when embedded below an existing page h1');

const blueprintWorkspace = read('src/components/tool/BlueprintWorkspace.tsx');
for (const needle of [
  'Build settings',
  'Center type',
  'Blocks if filled',
  'WarningPanel',
  'Download PNG',
  'Download SVG',
  'Download CSV',
  'Manual copy needed',
  'manualCopy',
  'onZoomChange',
  'Companion Mode',
  'Current row',
  'Mark done',
  'Copy this row',
  'Open Companion Mode',
  'Layer summary',
  'Ghost layer',
  'High contrast',
  'Layer print range',
  'Selected range',
  'printJobRange &&',
  'print-sheet',
  'workspace-grid',
  'commonOvalSizes',
  "exportCsv('range')",
  'useBlueprintResult',
  "import('@/lib/export/exportCsv')",
  "import('@/lib/export/exportSvg')",
  "import('@/lib/export/exportPrint')",
  'preventNumberWheelChange',
  'urlUpdateTimeout',
  'window.clearTimeout(urlUpdateTimeout.current)',
  'aria-modal="true"'
]) {
  if (!blueprintWorkspace.includes(needle)) failures.push(`BlueprintWorkspace missing feature: ${needle}`);
}
if (blueprintWorkspace.includes('@/lib/content/toolContent'))
  failures.push('BlueprintWorkspace must not import toolContent into the client graph');
for (const forbidden of [
  'generateSphere',
  'generateDome',
  "from '@/lib/export/exportCsv'",
  "from '@/lib/export/exportSvg'",
  "from '@/lib/export/exportPrint'"
]) {
  if (blueprintWorkspace.includes(forbidden)) failures.push(`BlueprintWorkspace should not statically include ${forbidden}`);
}

const blueprintWorker = read('src/workers/blueprintWorker.ts');
for (const needle of ['generateBlueprint', 'BlueprintWorkerRequest', 'BlueprintWorkerResponse', 'self.onmessage']) {
  if (!blueprintWorker.includes(needle)) failures.push(`Blueprint worker missing: ${needle}`);
}
const blueprintHook = read('src/components/tool/useBlueprintResult.ts');
for (const needle of [
  'new Worker',
  'blueprintWorker.ts',
  'generateCircle',
  'generateEllipse',
  'worker.postMessage',
  'workerRef.current?.terminate'
]) {
  if (!blueprintHook.includes(needle)) failures.push(`useBlueprintResult missing worker boundary: ${needle}`);
}
if (blueprintHook.includes('generateSphere') || blueprintHook.includes('generateDome'))
  failures.push('useBlueprintResult must keep Sphere/Dome generation inside the worker');

const toolContent = read('src/lib/content/toolContent.ts');
for (const needle of [
  'ToolContentPackage',
  'getToolContentPackage',
  'contentKeyForShape',
  'block-count',
  'pixel-circle',
  'center-guide',
  'layered-sphere',
  'dome-blueprint',
  'Outputs you can use immediately',
  'Material count workflow',
  'Selected range',
  'intentLinks',
  'citationSummary',
  'row-by-row Minecraft circle',
  'Layer-by-layer sphere blueprint',
  'Minecraft dome blueprint generator'
]) {
  if (!toolContent.includes(needle)) failures.push(`Task-focused content package missing: ${needle}`);
}
for (const [pagePath, contentKey] of [
  ['src/app/page.tsx', 'home'],
  ['src/app/minecraft-circle-generator/page.tsx', 'circle'],
  ['src/app/minecraft-oval-generator/page.tsx', 'oval'],
  ['src/app/minecraft-sphere-generator/page.tsx', 'sphere'],
  ['src/app/minecraft-dome-generator/page.tsx', 'dome'],
  ['src/app/minecraft-block-count-calculator/page.tsx', 'block-count'],
  ['src/app/minecraft-pixel-circle/page.tsx', 'pixel-circle'],
  ['src/app/odd-even-minecraft-circle-centers/page.tsx', 'center-guide'],
  ['src/app/minecraft-layer-by-layer-sphere/page.tsx', 'layered-sphere'],
  ['src/app/minecraft-dome-blueprint/page.tsx', 'dome-blueprint']
]) {
  if (!read(pagePath).includes(`contentKey="${contentKey}"`)) failures.push(`${pagePath} should use task-focused contentKey ${contentKey}`);
}
if (!read('src/app/presets/[slug]/page.tsx').includes('contentKey="preset"'))
  failures.push('Preset tool workspace should use preset contentKey');
const toolContentSection = read('src/components/tool/ToolContentSection.tsx');
for (const needle of [
  'contentPackage.howToSteps',
  'contentPackage.outputs',
  'contentPackage.tips',
  'contentPackage.faq',
  'contentPackage.links',
  'contentPackage.intentLinks',
  'contentPackage.citationSummary',
  'What this tool does',
  'Popular blueprint tasks this page handles',
  'Task-focused help and related links'
]) {
  if (!toolContentSection.includes(needle)) failures.push(`ToolContentSection should render task-focused content package: ${needle}`);
}

const canvas = read('src/components/tool/BlueprintCanvas.tsx');
for (const needle of [
  'exportFullBlueprint',
  "event.pointerType === 'touch'",
  'pinchActive',
  'horizontal one-finger drags',
  'trackThrottled',
  'onPointerCancel',
  'onPointerMove',
  'pan_used',
  'onZoomChange',
  'event.ctrlKey || event.metaKey',
  'modified-wheel',
  'Ctrl or Command plus mouse wheel',
  'vertical swipes scroll the page',
  'touchPanLock',
  'ArrowUp',
  'onKeyDown={onCanvasKeyDown}',
  "import('@/lib/export/exportPng')"
]) {
  if (!canvas.includes(needle)) failures.push(`BlueprintCanvas missing interaction fix: ${needle}`);
}
if (canvas.includes('onDoubleClick={fitToScreen}'))
  failures.push('Canvas must not recenter unexpectedly on double click; use the Fit button or keyboard shortcut');

const renderer = read('src/lib/render/canvasRenderer.ts');
for (const needle of ['showCenter', 'showAxis', 'showSegments', 'labelBackground', 'highlightedRowZ', 'axisPixel', 'isCentralColumn']) {
  if (!renderer.includes(needle)) failures.push(`Canvas renderer should include ${needle}`);
}

const css = read('src/app/globals.css');
for (const needle of [
  'builder-intro',
  'result-strip',
  'advanced-settings',
  'companion-mode-card',
  'companion-actions',
  'build-progress',
  'active-row',
  'build-mode-card',
  'layer-control-card',
  'warning-panel',
  'print-range-card',
  'print-sheet',
  'workspace-grid',
  'preset-index-list',
  'guide-index-list',
  'output-card',
  'related-link-list',
  'intent-links-card',
  'intent-link-list',
  'guide-section-links',
  'preset-guidance'
]) {
  if (!css.includes(needle)) failures.push(`CSS missing selector: ${needle}`);
}
if (css.includes('.content-card,.ad-slot,.hero,.disclosure-box,.breadcrumbs{display:none}'))
  failures.push('Content pages must not be globally hidden by builder CSS');
if (css.includes('@media print{.builder-intro,.result-strip,.content-card,.guide-card,.preset-detail-card{display:none!important}}'))
  failures.push('Remove unscoped print override for builder/content visibility');
if (!css.includes('touch-action: pan-y')) failures.push('Canvas wrapper should allow vertical page scrolling on touch devices');
if (css.includes('touch-action: none')) failures.push('Canvas wrapper must not globally block touch scrolling');

for (const legacyControl of ['CircleControls.tsx', 'EllipseControls.tsx', 'SphereControls.tsx', 'DomeControls.tsx', 'PrintPanel.tsx']) {
  const legacySource = read(`src/components/tool/${legacyControl}`);
  if (legacySource.includes('type="number"') && !legacySource.includes('onWheel={(event) => event.currentTarget.blur()}')) {
    failures.push(`${legacyControl} should guard number inputs against wheel changes before migration`);
  }
}

const exportPng = read('src/lib/export/exportPng.ts');
for (const needle of ['document.body.appendChild(anchor)', 'window.setTimeout(() => URL.revokeObjectURL(url), 1000)']) {
  if (!exportPng.includes(needle)) failures.push(`PNG export fallback missing: ${needle}`);
}

const circle = read('src/lib/geometry/circle.ts');
if (!circle.includes('if (inside) filledBlocks += 1;') || !circle.includes('filledBlocks\n  };'))
  failures.push('Circle filled-block count must be independent from current outline/filled mode');
const ellipse = read('src/lib/geometry/ellipse.ts');
if (!ellipse.includes('if (inside) filledBlocks += 1;') || !ellipse.includes('filledBlocks\n  };'))
  failures.push('Ellipse filled-block count must be independent from current outline/filled mode');
const schema = read('src/lib/seo/schema.ts');
if (!schema.includes('guide.steps?.length'))
  failures.push('Article guide schema should include explicit guide steps in the workflow ItemList when available');
if (!schema.includes('itemListSchema')) failures.push('Index pages should have ItemList schema support');
if (!schema.includes('collectionPageSchema')) failures.push('Index pages should expose CollectionPage schema for hub/page-set clarity');
if (!schema.includes('featureList')) failures.push('SoftwareApplication schema should expose current export/build features');
const utils = read('src/lib/geometry/utils.ts');
if (!utils.includes('footprintCenterWarnings')) failures.push('Center warnings must distinguish mixed odd/even footprints');

const nextConfig = read('next.config.mjs');
for (const route of [
  '/sphere-generator',
  '/dome-generator',
  '/tools/minecraft-sphere-generator',
  '/tools/minecraft-dome-generator',
  '/tools/minecraft-block-count-calculator'
]) {
  if (!nextConfig.includes(route)) failures.push(`Missing legacy redirect: ${route}`);
}
if (nextConfig.includes("destination: '/'")) failures.push('Legacy sphere/dome routes must not redirect to homepage');
if (nextConfig.includes("source: '/presets/:path*'"))
  failures.push('Preset pages must not be catch-all redirected away from /presets/[slug]');
if (nextConfig.includes("source: '/guides/:path*'")) failures.push('Guide pages must not be catch-all redirected away from /guides/[slug]');
if (nextConfig.includes('ignoreDuringBuilds')) failures.push('Next config must not ignore ESLint errors during builds');
if (nextConfig.includes('ignoreBuildErrors')) failures.push('Next config must not ignore TypeScript build errors');

for (const [source, destination] of [
  ['/minecraft-31-circle', '/presets/minecraft-31-circle'],
  ['/minecraft-31x21-oval', '/presets/minecraft-31x21-oval'],
  ['/minecraft-31-sphere', '/presets/minecraft-31-sphere'],
  ['/minecraft-31-dome', '/presets/minecraft-31-dome'],
  ['/minecraft-circle-sizes', '/presets'],
  ['/how-to-build-a-circle-in-minecraft', '/guides/how-to-build-a-circle-in-minecraft'],
  ['/how-to-build-a-sphere-in-minecraft', '/guides/how-to-build-a-sphere-in-minecraft'],
  ['/how-to-build-a-dome-in-minecraft', '/guides/how-to-build-a-dome-in-minecraft'],
  ['/minecraft-blueprint-csv-export', '/guides/minecraft-blueprint-csv-export']
]) {
  if (!nextConfig.includes(`source: '${source}'`) || !nextConfig.includes(`destination: '${destination}'`)) {
    failures.push(`Legacy route ${source} should redirect to restored asset ${destination}`);
  }
}
if (nextConfig.includes("destination: '/minecraft-circle-generator?d="))
  failures.push('Circle size aliases should redirect to preset pages, not query-string tool URLs');

const sphereAlias = read('src/app/minecraft-layer-by-layer-sphere/page.tsx');
if (sphereAlias.includes('export { metadata, default }'))
  failures.push('Layer-by-layer sphere alias must be a real landing page, not a metadata re-export');
if (!sphereAlias.includes("canonical: '/minecraft-layer-by-layer-sphere'"))
  failures.push('Layer-by-layer sphere alias must self-canonicalize');
const domeAlias = read('src/app/minecraft-dome-blueprint/page.tsx');
if (domeAlias.includes('export { metadata, default }'))
  failures.push('Dome blueprint alias must be a real landing page, not a metadata re-export');
if (!domeAlias.includes("canonical: '/minecraft-dome-blueprint'")) failures.push('Dome blueprint alias must self-canonicalize');

const legacyToolPage = read('src/components/content/ToolPage.tsx');
if (legacyToolPage.includes('/tools/minecraft-circle-generator')) failures.push('ToolPage should not link to old /tools URL');
if (!legacyToolPage.includes('introHeadingLevel={2}')) failures.push('ToolPage should pass h2 intro heading to avoid duplicate h1s');
const aliasToolPage = read('src/components/content/AliasToolPage.tsx');
if (!aliasToolPage.includes('introHeadingLevel={2}')) failures.push('AliasToolPage should pass h2 intro heading to avoid duplicate h1s');
const relatedGuidesSource = read('src/components/content/RelatedGuides.tsx');
if (!relatedGuidesSource.includes('.slice(0, 4)')) failures.push('Related guides should stay capped at four links on tool pages');

const uiSmoke = read('tests/ui-smoke.test.mjs');
for (const oldNeedle of ['should not expose old route', 'Homepage should use the blueprint builder title']) {
  if (uiSmoke.includes(oldNeedle)) failures.push(`UI smoke test still contains obsolete assertion: ${oldNeedle}`);
}
for (const newNeedle of [
  'Layer print range',
  'commonOvalSizes',
  'CSV selected range',
  'ignoreBuildErrors',
  "canonical: '/minecraft-dome-blueprint'",
  '/presets/minecraft-31-circle',
  '/guides/how-to-build-a-circle-in-minecraft',
  'skip-link'
]) {
  if (!uiSmoke.includes(newNeedle)) failures.push(`UI smoke test missing current target: ${newNeedle}`);
}

const globalsCss = read('src/app/globals.css');
for (const needle of [
  'CSS SECTION MAP',
  '01 foundation',
  '02 legacy component compatibility',
  '03 current workspace',
  '04 content assets',
  '05 print policy',
  'Legacy modular builder panels kept for migration/reference',
  'Final current-builder print visibility'
]) {
  if (!globalsCss.includes(needle)) failures.push(`globals.css missing section marker: ${needle}`);
}
if (!globalsCss.includes('.builder-page .content-card'))
  failures.push('Builder-only print/content hiding should be scoped to .builder-page');

const legacyDocPath = 'src/components/tool/LEGACY_COMPONENTS.md';
if (!existsSync(join(root, legacyDocPath))) failures.push('Missing legacy component migration document');
else {
  const legacyDoc = read(legacyDocPath);
  for (const needle of [
    '`BlueprintWorkspace.tsx` is the active interactive client workspace',
    'retained as migration/reference',
    'Do not create a second parallel builder path'
  ]) {
    if (!legacyDoc.includes(needle)) failures.push(`Legacy component document missing: ${needle}`);
  }
}
for (const legacyComponent of [
  'BlueprintTables.tsx',
  'CircleControls.tsx',
  'EllipseControls.tsx',
  'SphereControls.tsx',
  'DomeControls.tsx',
  'ExportPanel.tsx',
  'InputPanel.tsx',
  'LayerSlider.tsx',
  'PresetSelector.tsx',
  'PrintPanel.tsx',
  'ResultsPanel.tsx',
  'ResultsSummary.tsx',
  'RowSegmentTable.tsx',
  'ShapeControls.tsx',
  'ShapeTabs.tsx',
  'DisplayOptions.tsx',
  'CoordinateReadout.tsx'
]) {
  const componentText = read(`src/components/tool/${legacyComponent}`);
  if (!componentText.includes('Legacy modular component retained for migration/reference')) {
    failures.push(`${legacyComponent} missing legacy migration notice`);
  }
}

const readme = read('README.md');
for (const needle of [
  'Source of truth and archived reports',
  'docs/archive/',
  'LEGACY_COMPONENTS.md',
  'Latest performance boundary repair',
  'Latest CSS and legacy cleanup repair',
  'Latest task-focused content package repair',
  'Latest interaction safety repair',
  'Latest SEO growth optimization',
  'docs/SEO_GROWTH_PLAN.md',
  'src/lib/content/toolContent.ts',
  'BlueprintWorkspace.tsx',
  'ToolContentSection.tsx'
]) {
  if (!readme.includes(needle)) failures.push(`README missing current source-of-truth note: ${needle}`);
}
for (const archivedReport of [
  'docs/archive/IMPLEMENTATION_AUDIT.md',
  'docs/archive/FINAL_PLAN_COMPLETION_REPORT.md',
  'docs/archive/USER_NEEDS_AND_LAYOUT_AUDIT.md',
  'docs/archive/README.md'
]) {
  if (!existsSync(join(root, archivedReport))) failures.push(`Missing archived report: ${archivedReport}`);
}
for (const rootReport of ['IMPLEMENTATION_AUDIT.md', 'FINAL_PLAN_COMPLETION_REPORT.md', 'USER_NEEDS_AND_LAYOUT_AUDIT.md']) {
  if (existsSync(join(root, rootReport))) failures.push(`Historical report should be archived, not in repository root: ${rootReport}`);
}

const seoGrowthPlan = read('docs/SEO_GROWTH_PLAN.md');
for (const needle of [
  'Priority query clusters',
  '4/8/12 week review loop',
  'Do not create a new long-tail URL without at least C-level evidence'
]) {
  if (!seoGrowthPlan.includes(needle)) failures.push(`SEO growth plan missing: ${needle}`);
}


const metadataFiles = [
  'src/app/page.tsx',
  'src/app/about/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/disclaimer/page.tsx',
  'src/app/guides/page.tsx',
  'src/app/minecraft-block-count-calculator/page.tsx',
  'src/app/minecraft-circle-generator/page.tsx',
  'src/app/minecraft-dome-blueprint/page.tsx',
  'src/app/minecraft-dome-generator/page.tsx',
  'src/app/minecraft-layer-by-layer-sphere/page.tsx',
  'src/app/minecraft-oval-generator/page.tsx',
  'src/app/minecraft-pixel-circle/page.tsx',
  'src/app/minecraft-sphere-generator/page.tsx',
  'src/app/odd-even-minecraft-circle-centers/page.tsx',
  'src/app/presets/page.tsx',
  'src/app/privacy/page.tsx',
  'src/app/terms/page.tsx'
];
for (const file of metadataFiles) {
  const source = read(file);
  const titleMatch = source.match(/title:\s*'([^']+)'/);
  if (titleMatch && (titleMatch[1].length < 30 || titleMatch[1].length > 60)) {
    failures.push(`${file} title should stay within 30-60 characters: ${titleMatch[1].length}`);
  }
  const descriptionMatch =
    source.match(/description:\s*(?:\n\s*)?'([^']+)'/) || source.match(/const description =\s*(?:\n\s*)?'([^']+)'/);
  if (!descriptionMatch) {
    failures.push(`${file} should expose a static SEO description`);
  } else if (descriptionMatch[1].length < 120 || descriptionMatch[1].length > 160) {
    failures.push(`${file} meta description should stay within 120-160 characters: ${descriptionMatch[1].length}`);
  }
}


const metadataModule = read('src/lib/seo/metadata.ts');
for (const needle of ['pageMetadata', 'summary_large_image', '/opengraph-image', '/twitter-image', 'siteName: SITE_NAME', 'socialImageUrl', 'twitterImageUrl', "openGraphType: 'website' | 'article'"]) {
  if (!metadataModule.includes(needle)) failures.push(`Shared pageMetadata helper missing social metadata support: ${needle}`);
}
if (!read('src/app/guides/[slug]/page.tsx').includes('pageMetadata(page.title, page.description, page.path')) {
  failures.push('Guide dynamic metadata should use shared pageMetadata helper for canonical, OG, and Twitter tags');
}
if (!read('src/app/presets/[slug]/page.tsx').includes('pageMetadata(page.title, page.description, page.path')) {
  failures.push('Preset dynamic metadata should use shared pageMetadata helper for canonical, OG, and Twitter tags');
}

for (const [kind, min, max] of [
  ['title', 30, 60],
  ['description', 120, 160]
]) {
  const dynamicMatches = [...pages.matchAll(new RegExp(kind + ":\\s*(?:`([^`]+)`|\'([^\']+)\')", 'g'))];
  for (const match of dynamicMatches) {
    const value = match[1] || match[2];
    if (value.length < min || value.length > max) {
      failures.push(`Dynamic ${kind} in src/lib/seo/pages.ts should stay within ${min}-${max} characters: ${value.length} (${value})`);
    }
  }
}

const packageJson = JSON.parse(read('package.json'));
for (const script of ['test', 'audit', 'lint', 'build', 'format', 'format:check'])
  if (!packageJson.scripts?.[script]) failures.push(`Missing package script: ${script}`);

const adsTxt = read('public/ads.txt').trim();
if (adsTxt !== 'google.com, pub-1653188471819736, DIRECT, f08c47fec0942fa0') failures.push('public/ads.txt has wrong publisher record');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('BlockLayer feature audit passed');
