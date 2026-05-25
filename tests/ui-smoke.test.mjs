import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const root = process.cwd();

const homePage = readFileSync(join(root, 'src/app/page.tsx'), 'utf8');
assert(homePage.includes('ToolShell'), 'Homepage should render the builder workspace');
assert(homePage.includes('Minecraft Circle & Oval Blueprint Builder'), 'Homepage should use the blueprint builder title');
assert(!homePage.includes('Hello'), 'Homepage should not contain placeholder Hello content');
const layout = readFileSync(join(root, 'src/app/layout.tsx'), 'utf8');
for (const needle of ['<Header />', 'global-disclaimer', '<Footer />', 'unofficial fan-made tool']) {
  assert(layout.includes(needle), `layout should include ${needle}`);
}

const pages = readFileSync(join(root, 'src/lib/seo/pages.ts'), 'utf8');
const requiredRoutes = [
  '/minecraft-circle-generator',
  '/minecraft-oval-generator',
  '/minecraft-pixel-circle',
  '/odd-even-minecraft-circle-centers'
];
for (const route of requiredRoutes) {
  assert(pages.includes(route), `pages.ts should include ${route}`);
  assert(existsSync(join(root, 'src/app', route.slice(1), 'page.tsx')), `route file should exist for ${route}`);
}
for (const route of ['/minecraft-sphere-generator', '/minecraft-dome-generator', '/minecraft-layer-by-layer-sphere']) {
  assert(!pages.includes(route), `pages.ts should not expose old route ${route}`);
  assert(!existsSync(join(root, 'src/app', route.slice(1), 'page.tsx')), `old route file should be removed for ${route}`);
}

const toolShell = readFileSync(join(root, 'src/components/tool/ToolShell.tsx'), 'utf8');
for (const needle of [
  'Minecraft Circle & Oval Blueprint Builder',
  'Build settings',
  'Generate Blueprint',
  'Center type',
  'Row Segments',
  'Copy row list',
  'Download PNG',
  'Print blueprint',
  'Copy share link',
  'Manual copy needed',
  'Companion Mode',
  'Current row',
  'Previous row',
  'Mark done',
  'Next row',
  'Copy this row'
]) {
  assert(toolShell.includes(needle), `ToolShell should include ${needle}`);
}

const canvas = readFileSync(join(root, 'src/components/tool/BlueprintCanvas.tsx'), 'utf8');
for (const needle of [
  'onDoubleClick={fitToScreen}',
  'onTouchMove',
  'pinch zoom',
  'drawBlueprintGrid',
  'zoomIn',
  'zoomOut',
  'fullscreen',
  'exportFullBlueprint',
  "event.pointerType === 'touch'",
  'trackThrottled'
]) {
  assert(canvas.includes(needle), `BlueprintCanvas should include ${needle}`);
}

const renderer = readFileSync(join(root, 'src/lib/render/canvasRenderer.ts'), 'utf8');
for (const needle of ['showCenter', 'showAxis', 'showSegments', 'labelBackground', 'highlightedRowZ']) {
  assert(renderer.includes(needle), `canvas renderer should include ${needle}`);
}
const css = readFileSync(join(root, 'src/app/globals.css'), 'utf8');
for (const needle of ['companion-mode-card', 'companion-actions', 'build-progress', 'active-row', 'build-mode-card']) {
  assert(css.includes(needle), `CSS should include ${needle}`);
}

console.log('ui smoke tests passed');
