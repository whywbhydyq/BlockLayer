import { exportBlueprintCsv, layerSummaryText, rowListText, safeFilename, summaryText } from '../src/lib/export/exportCsv';
import { safeExportFilename } from '../src/lib/export/filenames';
import { clampPrintRange } from '../src/lib/export/exportPrint';
import { isPngExportLarge } from '../src/lib/export/exportPng';
import { clampScale, fitBoundsToViewport } from '../src/lib/render/viewport';
import { blueprintPalette } from '../src/lib/render/colors';
import { exportBlueprintSvg } from '../src/lib/export/exportSvg';
import { generateCircle, generateSphere } from '../src/lib/geometry';

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const circle = generateCircle({ inputMode: 'diameter', diameter: 9, radius: 4, fillMode: 'outline', thickness: 1 });
const circleCsv = exportBlueprintCsv(circle);
assert(circleCsv.includes('"shape"'), 'circle CSV should include header');
assert(circleCsv.includes('"circle"'), 'circle CSV should include shape rows');
assert(rowListText(circle).includes('Z '), 'row list should include row labels');
assert(summaryText(circle).includes('Total blocks'), 'summary should include total blocks');
assert(safeFilename(circle, 'png').endsWith('.png'), 'filename should preserve extension');
assert(safeExportFilename(circle, 'html').endsWith('.html'), 'HTML print filename should use html extension');
assert(clampPrintRange(0, 99, 10).start === 1, 'print range should clamp start');
assert(isPngExportLarge(5000, 1000), 'large PNG helper should detect oversized exports');
assert(clampScale(100) === 80 && clampScale(1) === 2, 'viewport scale should clamp to safe range');
assert(fitBoundsToViewport(circle.bounds, 900, 600).scale > 0, 'viewport fit should produce a positive scale');
assert(blueprintPalette(true).outline === '#000000', 'high contrast palette should use black outline');

const sphere = generateSphere({ inputMode: 'diameter', diameter: 9, radius: 4, mode: 'hollow', shellThickness: 1, buildDirection: 'bottom-up' });
const selectedCsv = exportBlueprintCsv(sphere, 2, 'selected');
const allCsv = exportBlueprintCsv(sphere, 2, 'all');
assert(selectedCsv.split('\n').length === 2, 'selected sphere CSV should contain header plus one layer');
assert(allCsv.split('\n').length === sphere.layerCount + 1, 'all sphere CSV should contain every layer');
assert(layerSummaryText(sphere).includes('Layer 1'), 'layer summary should include layer labels');
const svg = exportBlueprintSvg(sphere, 2);
assert(svg.startsWith('<svg'), 'SVG export should start with svg tag');
assert(svg.includes('<rect'), 'SVG export should include rect cells');

console.log('export tests passed');
