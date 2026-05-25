import type { BlueprintWarning, CenterType, GridBounds, GridCell, RowSegment } from './types';

export function clampInt(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function diameterFromInput(inputMode: 'diameter' | 'radius', diameter: number, radius: number, maxDiameter: number) {
  const raw = inputMode === 'radius' ? radius * 2 + 1 : diameter;
  return clampInt(raw, 1, maxDiameter);
}

export function centerType(size: number): CenterType {
  return size % 2 === 1 ? 'single-block' : 'between-blocks';
}

export function axisCoords(size: number): number[] {
  const values: number[] = [];
  if (size % 2 === 1) {
    const r = Math.floor(size / 2);
    for (let v = -r; v <= r; v += 1) values.push(v);
  } else {
    const half = size / 2;
    for (let v = -half; v < half; v += 1) values.push(v);
  }
  return values;
}

export function cellCenter(coord: number, size: number) {
  return size % 2 === 0 ? coord + 0.5 : coord;
}

export function boundsFromSizes(width: number, height: number): GridBounds {
  const xs = axisCoords(width);
  const zs = axisCoords(height);
  return {
    minX: xs[0] ?? 0,
    maxX: xs[xs.length - 1] ?? 0,
    minZ: zs[0] ?? 0,
    maxZ: zs[zs.length - 1] ?? 0,
    width,
    height
  };
}

export function rowsFromCells(cells: GridCell[]): RowSegment[] {
  const byZ = new Map<number, number[]>();
  for (const cell of cells) {
    if (!cell.filled) continue;
    const row = byZ.get(cell.z) ?? [];
    row.push(cell.x);
    byZ.set(cell.z, row);
  }
  return [...byZ.entries()].sort((a, b) => a[0] - b[0]).map(([z, xs]) => {
    xs.sort((a, b) => a - b);
    const segments: { startX: number; endX: number; length: number }[] = [];
    let start = xs[0];
    let previous = xs[0];
    for (let i = 1; i < xs.length; i += 1) {
      if (xs[i] === previous + 1) {
        previous = xs[i];
      } else {
        segments.push({ startX: start, endX: previous, length: previous - start + 1 });
        start = previous = xs[i];
      }
    }
    if (start !== undefined && previous !== undefined) segments.push({ startX: start, endX: previous, length: previous - start + 1 });
    return { z, segments, blockCount: xs.length };
  });
}

export function centerWarning(size: number): BlueprintWarning {
  return size % 2 === 1
    ? { code: 'ODD_CENTER', message: 'Odd size: the blueprint has one exact center block.', severity: 'info' }
    : { code: 'EVEN_CENTER', message: 'Even size: the center is between four blocks, so mirror carefully.', severity: 'info' };
}

export function sizeWarnings(width: number, height: number, depth = 1): BlueprintWarning[] {
  const maxDim = Math.max(width, height, depth);
  const volume = width * height * depth;
  const warnings: BlueprintWarning[] = [];
  if (maxDim >= 257) warnings.push({ code: 'LARGE_BLUEPRINT', message: 'Large blueprint: use zoom, fit-to-screen, and exports instead of reading every grid line at once.', severity: 'warning' });
  if (volume >= 257 * 257 * 129) warnings.push({ code: 'PERFORMANCE_DEGRADED', message: 'Very large 3D blueprint: rendering and CSV export may be degraded to protect the browser.', severity: 'warning' });
  if (maxDim >= 385) warnings.push({ code: 'PRINT_TOO_MANY_PAGES', message: 'Print may span many pages for this size. Consider printing selected views or exporting CSV.', severity: 'warning' });
  return warnings;
}
