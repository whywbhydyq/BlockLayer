import { countStacks } from './blockCount';
import type { CircleParams, GridCell, TwoDimensionalResult } from './types';
import { axisCoords, boundsFromSizes, cellCenter, centerType, centerWarning, diameterFromInput, rowsFromCells, sizeWarnings } from './utils';

export function generateCircle(params: CircleParams): TwoDimensionalResult {
  const diameter = diameterFromInput(params.inputMode, params.diameter, params.radius, 1024);
  const radius = diameter / 2;
  const thickness = Math.max(1, Math.min(8, Math.round(params.thickness)));
  const coords = axisCoords(diameter);
  const cells: GridCell[] = [];
  let outlineBlocks = 0;
  let filledBlocks = 0;

  for (const z of coords) {
    for (const x of coords) {
      const dx = cellCenter(x, diameter);
      const dz = cellCenter(z, diameter);
      const distance = Math.sqrt(dx * dx + dz * dz);
      const inside = distance <= radius;
      const inOutline = inside && distance >= Math.max(0, radius - thickness);
      const filled = params.fillMode === 'filled' ? inside : inOutline;
      if (filled) {
        const role = inOutline ? 'outline' : 'fill';
        cells.push({ x, z, filled: true, role });
        if (inOutline) outlineBlocks += 1;
        if (inside) filledBlocks += 1;
      }
    }
  }

  const rows = rowsFromCells(cells);
  const totalBlocks = cells.length;
  return {
    shape: 'circle',
    title: `${diameter} Block ${params.fillMode === 'filled' ? 'Filled ' : ''}Circle`,
    dimensions: { width: diameter, height: diameter },
    centerType: centerType(diameter),
    totalBlocks,
    stacks: countStacks(totalBlocks),
    warnings: [centerWarning(diameter), ...sizeWarnings(diameter, diameter)],
    generatedAt: new Date().toISOString(),
    cells,
    rows,
    bounds: boundsFromSizes(diameter, diameter),
    outlineBlocks,
    filledBlocks: params.fillMode === 'filled' ? filledBlocks : outlineBlocks
  };
}
