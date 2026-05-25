import { countStacks } from './blockCount';
import type { EllipseParams, GridCell, TwoDimensionalResult } from './types';
import { axisCoords, boundsFromSizes, cellCenter, centerType, centerWarning, clampInt, rowsFromCells, sizeWarnings } from './utils';

export function generateEllipse(params: EllipseParams): TwoDimensionalResult {
  const width = clampInt(params.width, 1, 1024);
  const height = clampInt(params.height, 1, 1024);
  const rx = width / 2;
  const rz = height / 2;
  const thickness = Math.max(1, Math.min(8, Math.round(params.thickness)));
  const xs = axisCoords(width);
  const zs = axisCoords(height);
  const cells: GridCell[] = [];
  let outlineBlocks = 0;
  let filledBlocks = 0;

  for (const z of zs) {
    for (const x of xs) {
      const nx = cellCenter(x, width) / rx;
      const nz = cellCenter(z, height) / rz;
      const normalized = Math.sqrt(nx * nx + nz * nz);
      const innerRx = Math.max(0.1, rx - thickness);
      const innerRz = Math.max(0.1, rz - thickness);
      const inner = Math.sqrt((cellCenter(x, width) / innerRx) ** 2 + (cellCenter(z, height) / innerRz) ** 2);
      const inside = normalized <= 1;
      const inOutline = inside && inner >= 1;
      if (inside) filledBlocks += 1;
      if (inOutline) outlineBlocks += 1;
      const visible = params.fillMode === 'filled' ? inside : inOutline;
      if (visible) {
        const role = inOutline ? 'outline' : 'fill';
        cells.push({ x, z, filled: true, role });
      }
    }
  }

  const totalBlocks = cells.length;
  return {
    shape: 'ellipse',
    title: `${width} × ${height} ${params.fillMode === 'filled' ? 'Filled ' : ''}Ellipse`,
    dimensions: { width, height },
    centerType: width % 2 === 1 && height % 2 === 1 ? 'single-block' : 'between-blocks',
    totalBlocks,
    stacks: countStacks(totalBlocks),
    warnings: [centerWarning(width), centerWarning(height), ...sizeWarnings(width, height)],
    generatedAt: new Date().toISOString(),
    cells,
    rows: rowsFromCells(cells),
    bounds: boundsFromSizes(width, height),
    outlineBlocks,
    filledBlocks
  };
}
