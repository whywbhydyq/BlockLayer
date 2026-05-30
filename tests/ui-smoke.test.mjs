import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

const homePage = read('src/app/page.tsx');
assert(homePage.includes('ToolShell'), 'Homepage should render the builder workspace');
assert(homePage.includes('Minecraft Circle Generator & Blueprint Builder'), 'Homepage should use the current task-fit title');
assert(homePage.includes('initialShape="circle"'), 'Homepage should default to the circle tool');
assert(!homePage.includes('Hello'), 'Homepage should not contain placeholder Hello content');

const layout = read('src/app/layout.tsx');
for (const needle of [
  '<Header />',
  'skip-link',
  'global-disclaimer',
  '<Footer />',
  'unofficial fan-made tool',
  'google-adsense-account',
  'adsense-auto-ads'
]) {
  assert(layout.includes(needle), `layout should include ${needle}`);
}


for (const page of ['src/app/about/page.tsx', 'src/app/privacy/page.tsx', 'src/app/terms/page.tsx', 'src/app/disclaimer/page.tsx', 'src/app/contact/page.tsx']) {
  assert(read(page).includes('id="main"'), `${page} should expose id="main" for skip-link accessibility`);
}

const pages = read('src/lib/seo/pages.ts');
const requiredRoutes = [
  '/',
  '/minecraft-circle-generator',
  '/minecraft-oval-generator',
  '/minecraft-sphere-generator',
  '/minecraft-dome-generator',
  '/minecraft-block-count-calculator',
  '/minecraft-pixel-circle',
  '/odd-even-minecraft-circle-centers',
  '/minecraft-layer-by-layer-sphere',
  '/minecraft-dome-blueprint'
];
for (const route of requiredRoutes) {
  assert(pages.includes(`'${route}'`), `pages.ts should include ${route}`);
  if (route !== '/') assert(existsSync(join(root, 'src/app', route.slice(1), 'page.tsx')), `route file should exist for ${route}`);
}
for (const matrix of ['circlePresets', 'ovalPresets', 'spherePresets', 'domePresets', 'presetPages', 'guidePages']) {
  assert(pages.includes(matrix), `SEO matrix should include ${matrix}`);
}



const toolContent = read('src/lib/content/toolContent.ts');
for (const needle of ['ToolContentPackage', 'getToolContentPackage', 'block-count', 'pixel-circle', 'center-guide', 'layered-sphere', 'dome-blueprint', 'Material count workflow']) {
  assert(toolContent.includes(needle), `tool content package should include ${needle}`);
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
  assert(read(pagePath).includes(`contentKey="${contentKey}"`), `${pagePath} should use contentKey ${contentKey}`);
}
assert(read('src/app/presets/[slug]/page.tsx').includes('contentKey="preset"'), 'preset page should use preset contentKey');

const nextConfig = read('next.config.mjs');
assert(!nextConfig.includes("source: '/presets/:path*'"), 'Preset pages must not be catch-all redirected');
assert(!nextConfig.includes("source: '/guides/:path*'"), 'Guide pages must not be catch-all redirected');
assert(!nextConfig.includes('ignoreDuringBuilds'), 'Next build should not ignore ESLint errors');
assert(!nextConfig.includes('ignoreBuildErrors'), 'Next build should not ignore TypeScript errors');

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
  assert(nextConfig.includes(`source: '${source}'`) && nextConfig.includes(`destination: '${destination}'`), `${source} should redirect to ${destination}`);
}
assert(!nextConfig.includes("destination: '/minecraft-circle-generator?d="), 'Circle size aliases should redirect to preset pages, not query-string tool URLs');

const header = read('src/components/layout/Header.tsx');
for (const needle of [
  'BlockLayer Minecraft Blueprint Builder',
  '/minecraft-sphere-generator',
  '/minecraft-dome-generator',
  '/presets',
  '/guides'
]) {
  assert(header.includes(needle), `Header should include ${needle}`);
}

const toolShell = read('src/components/tool/ToolShell.tsx');
for (const needle of [
  '<h1>{introTitle}</h1>',
  'getToolContentPackage',
  'generateBlueprint',
  'initialResult',
  'BlueprintWorkspace',
  'ToolContentSection'
]) {
  assert(toolShell.includes(needle), `ToolShell server wrapper should include ${needle}`);
}
assert(!toolShell.includes("'use client'"), 'ToolShell should stay a server wrapper');

const blueprintWorkspace = read('src/components/tool/BlueprintWorkspace.tsx');
for (const needle of [
  'WarningPanel',
  'result-strip',
  'Download PNG',
  'Download SVG',
  'Download CSV',
  'Layer print range',
  'Selected range',
  'printJobRange &&',
  'print-sheet',
  'workspace-grid',
  'commonOvalSizes',
  'CSV selected range',
  "exportCsv('range')",
  'Manual copy needed',
  'Companion Mode',
  'Layer summary',
  'Ghost layer',
  'High contrast',
  'useBlueprintResult',
  "import('@/lib/export/exportCsv')",
  "import('@/lib/export/exportSvg')",
  "import('@/lib/export/exportPrint')",
  'preventNumberWheelChange',
  'urlUpdateTimeout',
  'aria-modal="true"'
]) {
  assert(blueprintWorkspace.includes(needle), `BlueprintWorkspace should include ${needle}`);
}
assert(!blueprintWorkspace.includes('@/lib/content/toolContent'), 'BlueprintWorkspace should not import toolContent');
assert(!blueprintWorkspace.includes('generateSphere'), 'Sphere generation should stay in the worker');
assert(!blueprintWorkspace.includes('generateDome'), 'Dome generation should stay in the worker');

const blueprintWorker = read('src/workers/blueprintWorker.ts');
for (const needle of ['generateBlueprint', 'BlueprintWorkerRequest', 'BlueprintWorkerResponse', 'self.onmessage']) {
  assert(blueprintWorker.includes(needle), `blueprint worker should include ${needle}`);
}
const blueprintHook = read('src/components/tool/useBlueprintResult.ts');
for (const needle of ['new Worker', 'blueprintWorker.ts', 'generateCircle', 'generateEllipse', 'worker.postMessage']) {
  assert(blueprintHook.includes(needle), `blueprint result hook should include ${needle}`);
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
  'event.ctrlKey || event.metaKey',
  'modified-wheel',
  'Ctrl or Command plus mouse wheel',
  'vertical swipes scroll the page',
  'touchPanLock',
  'ArrowUp',
  'onKeyDown={onCanvasKeyDown}',
  "import('@/lib/export/exportPng')"
]) {
  assert(canvas.includes(needle), `BlueprintCanvas should include ${needle}`);
}
assert(!canvas.includes('onDoubleClick={fitToScreen}'), 'canvas should not recenter unexpectedly on double click');

const renderer = read('src/lib/render/canvasRenderer.ts');
for (const needle of ['showCenter', 'showAxis', 'showSegments', 'labelBackground', 'highlightedRowZ', 'axisPixel', 'isCentralColumn']) {
  assert(renderer.includes(needle), `canvas renderer should include ${needle}`);
}

const presetPage = read('src/app/presets/[slug]/page.tsx');
for (const needle of ['Breadcrumbs', 'Preset details', 'Example output', 'Common mistakes', 'Related presets']) {
  assert(presetPage.includes(needle), `Preset page should include ${needle}`);
}
const guidePage = read('src/app/guides/[slug]/page.tsx');
for (const needle of ['Breadcrumbs', 'guideSchema', 'Recommended workflow', 'Common mistakes to avoid', 'Related blueprint guides', 'page.steps']) {
  assert(guidePage.includes(needle), `Guide page should include ${needle}`);
}

const presetIndex = read('src/app/presets/page.tsx');
for (const needle of ['Minecraft Blueprint Presets', 'presetPages', 'Circle presets', 'Dome presets', 'itemListSchema']) {
  assert(presetIndex.includes(needle), `Preset index should include ${needle}`);
}
const guideIndex = read('src/app/guides/page.tsx');
for (const needle of ['Minecraft Blueprint Guides', 'guidePages', 'All guides', 'itemListSchema']) {
  assert(guideIndex.includes(needle), `Guide index should include ${needle}`);
}
for (const needle of ['href="/presets"', 'href="/guides"']) {
  assert(header.includes(needle), `Header should link to index route ${needle}`);
}
const legacyToolPage = read('src/components/content/ToolPage.tsx');
assert(!legacyToolPage.includes('/tools/minecraft-circle-generator'), 'ToolPage should not link to old /tools URL');

const schema = read('src/lib/seo/schema.ts');
assert(schema.includes('guide.steps?.length'), 'HowTo schema should use explicit guide steps when available');
assert(schema.includes('itemListSchema'), 'Index pages should have ItemList schema support');

const layerAlias = read('src/app/minecraft-layer-by-layer-sphere/page.tsx');
const domeAlias = read('src/app/minecraft-dome-blueprint/page.tsx');
assert(!layerAlias.includes('export { metadata, default }'), 'Layer-by-layer sphere alias should be a real landing page');
assert(layerAlias.includes("canonical: '/minecraft-layer-by-layer-sphere'"), 'Layer-by-layer sphere alias should self-canonicalize');
assert(!domeAlias.includes('export { metadata, default }'), 'Dome blueprint alias should be a real landing page');
assert(domeAlias.includes("canonical: '/minecraft-dome-blueprint'"), 'Dome blueprint alias should self-canonicalize');

const css = read('src/app/globals.css');
for (const needle of [
  'builder-intro',
  'result-strip',
  'advanced-settings',
  'print-range-card',
  'print-sheet',
  'workspace-grid',
  'companion-mode-card',
  'warning-panel',
  'preset-index-list',
  'guide-index-list',
  'CSS SECTION MAP',
  '02 legacy component compatibility',
  '03 current workspace',
  '05 print policy',
  'Final current-builder print visibility',
  'output-card',
  'related-link-list'
]) {
  assert(css.includes(needle), `CSS should include ${needle}`);
}
assert(
  !css.includes('.content-card,.ad-slot,.hero,.disclosure-box,.breadcrumbs{display:none}'),
  'Content pages must not be globally hidden'
);
assert(css.includes('.builder-page .content-card'), 'Builder-only print/content hiding should be scoped to .builder-page');
assert(css.includes('touch-action: pan-y'), 'Canvas should allow vertical page scrolling on touch devices');
assert(!css.includes('touch-action: none'), 'Canvas should not globally block touch scrolling');

const legacyDoc = read('src/components/tool/LEGACY_COMPONENTS.md');
for (const needle of ['`BlueprintWorkspace.tsx` is the active interactive client workspace', 'retained as migration/reference', 'Do not create a second parallel builder path']) {
  assert(legacyDoc.includes(needle), `Legacy component migration document should include ${needle}`);
}
for (const legacyComponent of ['CircleControls.tsx', 'EllipseControls.tsx', 'SphereControls.tsx', 'DomeControls.tsx', 'ExportPanel.tsx', 'PrintPanel.tsx', 'ResultsPanel.tsx', 'ShapeTabs.tsx']) {
  assert(read(`src/components/tool/${legacyComponent}`).includes('Legacy modular component retained for migration/reference'), `${legacyComponent} should include a legacy migration notice`);
}

const readme = read('README.md');
for (const needle of ['Source of truth and archived reports', 'docs/archive/', 'LEGACY_COMPONENTS.md', 'Latest CSS and legacy cleanup repair', 'Latest task-focused content package repair', 'Latest interaction safety repair', 'src/lib/content/toolContent.ts']) {
  assert(readme.includes(needle), `README should include ${needle}`);
}
for (const archivedReport of ['docs/archive/IMPLEMENTATION_AUDIT.md', 'docs/archive/FINAL_PLAN_COMPLETION_REPORT.md', 'docs/archive/USER_NEEDS_AND_LAYOUT_AUDIT.md', 'docs/archive/README.md']) {
  assert(existsSync(join(root, archivedReport)), `${archivedReport} should exist`);
}
for (const rootReport of ['IMPLEMENTATION_AUDIT.md', 'FINAL_PLAN_COMPLETION_REPORT.md', 'USER_NEEDS_AND_LAYOUT_AUDIT.md']) {
  assert(!existsSync(join(root, rootReport)), `${rootReport} should be archived, not in the repository root`);
}


console.log('ui smoke tests passed');
