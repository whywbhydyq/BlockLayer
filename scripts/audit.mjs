import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const required = [
  'src/app/page.tsx',
  'src/app/tools/minecraft-circle-generator/page.tsx',
  'src/app/tools/minecraft-ellipse-generator/page.tsx',
  'src/app/tools/minecraft-sphere-generator/page.tsx',
  'src/app/tools/minecraft-dome-generator/page.tsx',
  'src/app/tools/minecraft-block-count-calculator/page.tsx',
  'src/app/presets/[slug]/page.tsx',
  'src/app/guides/[slug]/page.tsx',
  'src/components/content/AliasToolPage.tsx',
  'src/components/content/ToolPage.tsx',
  'src/components/content/FAQ.tsx',
  'src/components/content/JsonLd.tsx',
  'src/components/content/RelatedTools.tsx',
  'src/components/content/RelatedGuides.tsx',
  'src/components/content/DisclosureBox.tsx',
  'src/components/content/TrackedLink.tsx',
  'src/components/layout/Breadcrumbs.tsx',
  'src/app/circle-generator/page.tsx',
  'src/app/sphere-generator/page.tsx',
  'src/app/minecraft-circle-generator/page.tsx',
  'src/app/minecraft-sphere-generator/page.tsx',
  'src/app/about/page.tsx',
  'src/app/privacy/page.tsx',
  'src/app/terms/page.tsx',
  'src/app/disclaimer/page.tsx',
  'src/app/contact/page.tsx',
  'public/ads.txt',
  '.env.example',
  'src/app/sitemap.ts',
  'src/app/robots.ts',
  'src/components/tool/ToolShell.tsx',
  'src/components/tool/BlueprintCanvas.tsx',
  'src/components/tool/ShapeControls.tsx',
  'src/components/tool/DisplayOptions.tsx',
  'src/components/tool/CircleControls.tsx',
  'src/components/tool/EllipseControls.tsx',
  'src/components/tool/SphereControls.tsx',
  'src/components/tool/DomeControls.tsx',
  'src/components/tool/LayerSlider.tsx',
  'src/components/tool/ResultsSummary.tsx',
  'src/components/tool/ExportPanel.tsx',
  'src/components/tool/PrintPanel.tsx',
  'src/components/tool/WarningPanel.tsx',
  'src/components/tool/CoordinateReadout.tsx',
  'src/components/tool/PresetSelector.tsx',
  'src/components/tool/BlueprintTables.tsx',
  'src/lib/geometry/circle.ts',
  'src/lib/geometry/ellipse.ts',
  'src/lib/geometry/sphere.ts',
  'src/lib/geometry/dome.ts',
  'src/lib/export/exportCsv.ts',
  'src/lib/export/exportSvg.ts',
  'src/lib/analytics/events.ts',
  'src/lib/seo/schema.ts',
  '.prettierrc.json',
  'tsconfig.test.json',
  'src/components/tool/ShapeTabs.tsx',
  'src/components/tool/InputPanel.tsx',
  'src/components/tool/ResultsPanel.tsx',
  'src/components/tool/RowSegmentTable.tsx',
  'src/components/tool/LayerSummaryTable.tsx',
  'src/components/content/PresetCards.tsx',
  'src/components/content/ExplanationBlock.tsx',
  'src/lib/geometry/bounds.ts',
  'src/lib/geometry/inclusion.ts',
  'src/lib/geometry/tests-fixtures.ts',
  'src/lib/render/canvasRenderer.ts',
  'src/lib/render/viewport.ts',
  'src/lib/render/colors.ts',
  'src/lib/export/exportPng.ts',
  'src/lib/export/exportPrint.ts',
  'src/lib/export/filenames.ts',
  'src/lib/seo/metadata.ts',
  'tests/export.test.ts',
  'tests/ui-smoke.test.mjs'
];

const failures = [];
for (const file of required) if (!existsSync(join(root, file))) failures.push(`Missing required file: ${file}`);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (name === 'node_modules' || name === '.next' || name === '.audit-dist') continue;
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

const projectFiles = walk(root).filter((file) => /\.(ts|tsx|css|json|md|mjs)$/.test(file));
const srcFiles = walk(join(root, 'src')).filter((file) => /\.(ts|tsx|css)$/.test(file));
const runtimeDomainFiles = projectFiles.filter((file) => {
  const rel = relative(root, file).replaceAll('\\', '/');
  if (rel.startsWith('src/') || rel.startsWith('public/')) return true;
  return ['next.config.mjs', 'vercel.json', '.env.example', 'package.json'].includes(rel);
});
const corpus = srcFiles.map((file) => readFileSync(file, 'utf8')).join('\n');
const projectCorpus = projectFiles.map((file) => readFileSync(file, 'utf8')).join('\n');

const requiredStrings = [
  'Download PNG',
  'Download SVG',
  'Download CSV',
  'Copy row list',
  'Copy layer summary',
  'Copy share link',
  'Print all layers',
  'Print selected range',
  'Row-by-row table',
  'Layer table',
  'Fit to screen',
  'Fullscreen',
  'Layer slider',
  'BreadcrumbList',
  'FAQPage',
  'SoftwareApplication',
  'NOT AN OFFICIAL MINECRAFT PRODUCT',
  'Local presets',
  'Coordinate readout',
  'JavaScript is required',
  'Page URL:',
  'Advertisement in FAQ area',
  'affiliate disclosure',
  'google-adsense-account',
  'adsense-auto-ads',
  'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1653188471819736',
  'Advertisement in desktop sidebar',
  'pinch zoom',
  'double-tap Fit to screen',
  'Builder mode',
  'Input panel',
  'Highlight row',
  'Next row',
  'Previous row',
  'Copy current row'
];
for (const text of requiredStrings) if (!corpus.includes(text)) failures.push(`Missing required UI/compliance/SEO string: ${text}`);

const analyticsEvents = [
  'tool_view',
  'shape_changed',
  'params_changed',
  'generate_success',
  'large_blueprint_warning',
  'layer_changed',
  'zoom_used',
  'pan_used',
  'fit_to_screen_clicked',
  'download_png_clicked',
  'download_csv_clicked',
  'print_clicked',
  'copy_summary_clicked',
  'faq_opened',
  'related_tool_clicked',
  'download_svg_clicked',
  'copy_row_list_clicked',
  'copy_layer_summary_clicked',
  'copy_share_url_clicked',
  'affiliate_clicked',
  'related_guide_clicked',
  'ad_slot_viewed'
];
for (const eventName of analyticsEvents) if (!corpus.includes(eventName)) failures.push(`Missing required analytics event: ${eventName}`);

if (corpus.includes('var(--border)') || corpus.includes('var(--card)')) failures.push('Found undefined CSS variables from old component styles');
if (!projectCorpus.includes('noscript')) failures.push('Missing no-JS fallback');
if (!projectCorpus.includes('id="main"')) failures.push('Missing skip-link main target');

if (/meta\s+name=["']keywords/i.test(corpus)) failures.push('Found forbidden meta keywords');
if (/initialDiameter=undefined|=undefined\s/.test(corpus)) failures.push('Found invalid JSX undefined assignment');
if (!readFileSync(join(root, 'src/components/content/AliasToolPage.tsx'), 'utf8').includes('initialDiameter?: number')) failures.push('AliasToolPage props must support initialDiameter used by alias routes');
if (/official\s+Minecraft\s+logo|official\s+textures|official\s+screenshots/i.test(corpus.replace(/does not use official game logos, official textures, official fonts, or official screenshots/g, ''))) failures.push('Possible official asset wording outside disclaimer context');
if (/Litematica export|NBT export|Create blueprint export|command generator/i.test(corpus.replace(/No\. MVP exports PNG, SVG, CSV, print output, row lists, layer summaries, and share links only\./g, ''))) failures.push('Possible forbidden P2 feature wording in implementation');

const pages = readFileSync(join(root, 'src/lib/seo/pages.ts'), 'utf8');
const presetBlock = pages.split('export const presetPages')[1]?.split('export const guidePages')[0] || '';
const guideBlock = pages.split('export const guidePages')[1]?.split('export const staticPages')[0] || '';
const aliasBlock = pages.split('export const aliasPages')[1]?.split('export const allContentPaths')[0] || '';
const presetCount = (presetBlock.match(/slug: '/g) || []).length;
const guideCount = (guideBlock.match(/slug: '/g) || []).length;
const aliasCount = (aliasBlock.match(/'/g) || []).length / 2;
if (presetCount < 20) failures.push(`Expected at least 20 preset pages, got ${presetCount}`);
if (guideCount < 8) failures.push(`Expected at least 8 guide pages, got ${guideCount}`);
if (aliasCount < 26) failures.push(`Expected at least 26 alias/legacy SEO routes, got ${aliasCount}`);
for (const route of ['/minecraft-7-circle','/minecraft-11-circle','/minecraft-15-circle','/minecraft-21-circle','/minecraft-31-circle','/minecraft-41-circle','/minecraft-65-circle','/minecraft-129-circle','/how-to-build-a-circle-in-minecraft','/how-to-build-a-sphere-in-minecraft','/how-to-build-a-dome-in-minecraft','/odd-even-minecraft-circle-centers']) {
  if (!pages.includes(route)) failures.push(`Missing documented SEO route: ${route}`);
  const routeFile = join(root, 'src/app', route.slice(1), 'page.tsx');
  if (!existsSync(routeFile)) failures.push(`Missing documented SEO route file: ${routeFile}`);
}

const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
for (const script of ['test', 'audit', 'lint', 'build', 'format', 'format:check']) if (!packageJson.scripts?.[script]) failures.push(`Missing package script: ${script}`);
if (!packageJson.devDependencies?.prettier) failures.push('Missing Prettier devDependency');
if (!projectCorpus.includes('export tests passed')) failures.push('Missing export test runtime assertion');

const adsTxtPath = join(root, 'public/ads.txt');
const adsTxt = existsSync(adsTxtPath) ? readFileSync(adsTxtPath, 'utf8').trim() : '';
if (adsTxt !== 'google.com, pub-1653188471819736, DIRECT, f08c47fec0942fa0') failures.push('public/ads.txt is missing or has the wrong AdSense publisher record');
const layoutSource = readFileSync(join(root, 'src/app/layout.tsx'), 'utf8');
if (!layoutSource.includes("'google-adsense-account': 'ca-pub-1653188471819736'")) failures.push('Missing AdSense account meta in layout metadata');
if ((layoutSource.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/g) || []).length !== 1) failures.push('AdSense Auto Ads script must appear exactly once in RootLayout');
if (!pages.includes("'/contact'")) failures.push('Contact page must be included in staticPages so sitemap contains it');
if (!readFileSync(join(root, 'src/components/layout/Footer.tsx'), 'utf8').includes('/contact')) failures.push('Footer must link to Contact');
if (!readFileSync(join(root, '.env.example'), 'utf8').includes('NEXT_PUBLIC_SITE_URL=https://blocklayer.ymirtool.com')) failures.push('.env.example must document NEXT_PUBLIC_SITE_URL for the production domain');
if (!projectCorpus.includes('https://blocklayer.ymirtool.com')) failures.push('Production domain blocklayer.ymirtool.com must appear in SEO/default-domain configuration');
const runtimeDomainCorpus = runtimeDomainFiles.map((file) => readFileSync(file, 'utf8')).join('\n');
if (runtimeDomainCorpus.includes('vercel.app')) failures.push('Found vercel.app domain reference in runtime source/config; canonical production domain should be blocklayer.ymirtool.com');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('implementation audit passed');