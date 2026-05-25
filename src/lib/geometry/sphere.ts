import { countStacks } from './blockCount';
import type { GridCell, LayerBlueprint, SphereParams } from './types';
import { axisCoords, boundsFromSizes, cellCenter, centerType, centerWarning, diameterFromInput, rowsFromCells, sizeWarnings } from './utils';

function makeLayer(index: number, y: number, diameter: number, cells: GridCell[], localRadius: number): LayerBlueprint {
  return {
    index,
    y,
    label: `Layer ${index + 1} · Y ${y}`,
    cells,
    rows: rowsFromCells(cells),
    bounds: boundsFromSizes(diameter, diameter),
    blockCount: cells.length,
    localRadius,
    isCenterLayer: Math.abs(cellCenter(y, diameter)) < 0.001
  };
}

export function generateSphere(params: SphereParams) {
  const diameter = diameterFromInput(params.inputMode, params.diameter, params.radius, 257);
  const radius = diameter / 2;
  const shellThickness = Math.max(1, Math.min(4, Math.round(params.shellThickness)));
  const coords = axisCoords(diameter);
  const layers: LayerBlueprint[] = [];
  let totalBlocks = 0;

  for (const y of coords) {
    const dy = cellCenter(y, diameter);
    const cells: GridCell[] = [];
    const localRadius = Math.sqrt(Math.max(0, radius * radius - dy * dy));
    for (const z of coords) {
      for (const x of coords) {
        const dx = cellCenter(x, diameter);
        const dz = cellCenter(z, diameter);
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const inside = distance <= radius;
        const hollowKeep = distance >= Math.max(0, radius - shellThickness);
        const filled = params.mode === 'solid' ? inside : inside && hollowKeep;
        if (filled) cells.push({ x, z, filled: true, role: hollowKeep ? 'outline' : 'fill' });
      }
    }
    totalBlocks += cells.length;
    layers.push(makeLayer(layers.length, y, diameter, cells, localRadius));
  }

  const ordered = params.buildDirection === 'top-down' ? [...layers].reverse() : layers;
  const reindexed = ordered.map((layer, index) => ({ ...layer, index, label: `Layer ${index + 1} of ${ordered.length} · Y ${layer.y}${layer.isCenterLayer ? ' · center' : ''}` }));

  return {
    shape: 'sphere' as const,
    title: `${diameter} Block ${params.mode === 'solid' ? 'Solid ' : 'Hollow '}Sphere`,
    dimensions: { width: diameter, height: diameter, depth: diameter },
    centerType: centerType(diameter),
    totalBlocks,
    stacks: countStacks(totalBlocks),
    warnings: [centerWarning(diameter), ...sizeWarnings(diameter, diameter, diameter)],
    generatedAt: new Date().toISOString(),
    layers: reindexed,
    layerCount: reindexed.length,
    mode: params.mode,
    shellThickness,
    buildDirection: params.buildDirection
  };
}
