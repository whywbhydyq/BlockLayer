import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const root = process.cwd();
const pages = readFileSync(join(root, 'src/lib/seo/pages.ts'), 'utf8');
const requiredRoutes = [
  '/minecraft-7-circle',
  '/minecraft-11-circle',
  '/minecraft-15-circle',
  '/minecraft-21-circle',
  '/minecraft-31-circle',
  '/minecraft-41-circle',
  '/minecraft-65-circle',
  '/minecraft-129-circle',
  '/how-to-build-a-circle-in-minecraft',
  '/how-to-build-a-sphere-in-minecraft',
  '/how-to-build-a-dome-in-minecraft',
  '/odd-even-minecraft-circle-centers'
];
for (const route of requiredRoutes) {
  assert(pages.includes(route), `pages.ts should include ${route}`);
  assert(existsSync(join(root, 'src/app', route.slice(1), 'page.tsx')), `route file should exist for ${route}`);
}
const presetCount = (pages.split('export const presetPages')[1]?.split('export const guidePages')[0]?.match(/slug: '/g) || []).length;
const guideCount = (pages.split('export const guidePages')[1]?.split('export const staticPages')[0]?.match(/slug: '/g) || []).length;
assert(presetCount >= 20, 'preset matrix should include at least 20 pages');
assert(guideCount >= 8, 'guide matrix should include at least 8 pages');

const toolShell = readFileSync(join(root, 'src/components/tool/ToolShell.tsx'), 'utf8');
for (const needle of ['ShapeTabs', 'InputPanel', 'ResultsPanel', 'copyCurrentRow', 'highlightedRowZ']) {
  assert(toolShell.includes(needle), `ToolShell should include ${needle}`);
}

const canvas = readFileSync(join(root, 'src/components/tool/BlueprintCanvas.tsx'), 'utf8');
for (const needle of ['onDoubleClick={fitToScreen}', 'onTouchMove', 'pinch zoom', 'drawBlueprintGrid']) {
  assert(canvas.includes(needle), `BlueprintCanvas should include ${needle}`);
}

console.log('ui smoke tests passed');
