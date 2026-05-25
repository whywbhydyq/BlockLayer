import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const failures = [];
const mustExist = [
  'src/app/page.tsx',
  'src/app/minecraft-circle-generator/page.tsx',
  'src/app/minecraft-oval-generator/page.tsx',
  'src/app/minecraft-pixel-circle/page.tsx',
  'src/app/odd-even-minecraft-circle-centers/page.tsx',
  'src/app/about/page.tsx',
  'src/app/privacy/page.tsx',
  'src/app/terms/page.tsx',
  'src/app/disclaimer/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/sitemap.ts',
  'src/app/robots.ts',
  'src/components/tool/ToolShell.tsx',
  'src/components/tool/BlueprintCanvas.tsx',
  'src/lib/geometry/circle.ts',
  'src/lib/geometry/ellipse.ts',
  'src/lib/export/exportPng.ts',
  'src/lib/render/canvasRenderer.ts',
  'src/lib/seo/pages.ts',
  'public/ads.txt'
];
const mustNotExist = [
  'src/app/tools/minecraft-sphere-generator/page.tsx',
  'src/app/tools/minecraft-dome-generator/page.tsx',
  'src/app/minecraft-sphere-generator/page.tsx',
  'src/app/minecraft-dome-generator/page.tsx',
  'src/app/minecraft-layer-by-layer-sphere/page.tsx',
  'src/app/minecraft-dome-blueprint/page.tsx',
  'src/app/sphere-generator/page.tsx',
  'src/app/dome-generator/page.tsx',
  'src/app/presets/[slug]/page.tsx',
  'src/app/guides/[slug]/page.tsx'
];
for (const file of mustExist) if (!existsSync(join(root, file))) failures.push(`Missing P0 file: ${file}`);
for (const file of mustNotExist) if (existsSync(join(root, file))) failures.push(`Old overpromising route still exists: ${file}`);

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

const homePage = read('src/app/page.tsx');
for (const needle of ['ToolShell', 'Minecraft Circle & Oval Blueprint Builder', 'initialShape="circle"']) {
  if (!homePage.includes(needle)) failures.push(`Homepage missing builder workspace: ${needle}`);
}
if (homePage.includes('Hello')) failures.push('Homepage still contains placeholder Hello content');
const layout = read('src/app/layout.tsx');
for (const needle of ['<Header />', 'global-disclaimer', '<Footer />', 'unofficial fan-made tool']) {
  if (!layout.includes(needle)) failures.push(`Root layout missing effect-image shell: ${needle}`);
}

const pages = read('src/lib/seo/pages.ts');
for (const path of [
  '/',
  '/minecraft-circle-generator',
  '/minecraft-oval-generator',
  '/minecraft-pixel-circle',
  '/odd-even-minecraft-circle-centers',
  '/about',
  '/privacy',
  '/terms',
  '/disclaimer',
  '/contact'
]) {
  if (!pages.includes(`'${path}'`)) failures.push(`P0 sitemap path missing: ${path}`);
}
for (const forbidden of ['/minecraft-sphere-generator', '/minecraft-dome-generator', '/minecraft-layer-by-layer-sphere', '/presets/']) {
  if (pages.includes(forbidden)) failures.push(`Forbidden old SEO path remains in pages.ts: ${forbidden}`);
}

const toolShell = read('src/components/tool/ToolShell.tsx');
for (const needle of [
  'Minecraft Circle & Oval Blueprint Builder',
  'Build settings',
  'Center type',
  'Blocks if filled',
  'Download PNG',
  'Manual copy needed',
  'manualCopy',
  'onZoomChange',
  'Companion Mode',
  'Current row',
  'Mark done',
  'Copy this row',
  'Open Companion Mode'
]) {
  if (!toolShell.includes(needle)) failures.push(`ToolShell missing interaction fix: ${needle}`);
}
const canvas = read('src/components/tool/BlueprintCanvas.tsx');
for (const needle of [
  'exportFullBlueprint',
  "event.pointerType === 'touch'",
  'trackThrottled',
  'onPointerCancel',
  'onZoomChange',
  'downloadCanvasPng(canvas, filename)'
]) {
  if (!canvas.includes(needle)) failures.push(`BlueprintCanvas missing interaction fix: ${needle}`);
}
const renderer = read('src/lib/render/canvasRenderer.ts');
for (const needle of ['showCenter', 'showAxis', 'showSegments', 'labelBackground', 'highlightedRowZ']) {
  if (!renderer.includes(needle)) failures.push(`canvas renderer should include ${needle}`);
}
const css = read('src/app/globals.css');
for (const needle of ['companion-mode-card', 'companion-actions', 'build-progress', 'active-row', 'build-mode-card']) {
  if (!css.includes(needle)) failures.push(`CSS missing companion mode selector: ${needle}`);
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

const nextConfig = read('next.config.mjs');
for (const route of ['/minecraft-sphere-generator', '/minecraft-dome-generator', '/minecraft-layer-by-layer-sphere', '/presets/:path*']) {
  if (!nextConfig.includes(route)) failures.push(`Missing legacy redirect: ${route}`);
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
console.log('P0 blueprint builder audit passed');
