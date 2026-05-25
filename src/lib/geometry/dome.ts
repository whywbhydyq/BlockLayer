import { countStacks } from './blockCount';
import type { DomeParams, GridCell, LayerBlueprint } from './types';
import { axisCoords, boundsFromSizes, cellCenter, centerType, centerWarning, diameterFromInput, rowsFromCells, sizeWarnings } from './utils';

function makeLayer(index: number, y: number, diameter: number, cells: GridCell[], localRadius: number, total: number): LayerBlueprint {
  return {
    index,
    y,
    label: `Layer ${index + 1} of ${total} · Y ${y}`,
    cells,
    rows: rowsFromCells(cells),
    bounds: boundsFromSizes(diameter, diameter),
    blockCount: cells.length,
    localRadius,
    isCenterLayer: Math.abs(cellCenter(y, diameter)) < 0.001
  };
}

export function generateDome(params: DomeParams) {
  const diameter = diameterFromInput(params.inputMode, params.diameter, params.radius, 257);
  const radius = diameter / 2;
  const shellThickness = Math.max(1, Math.min(4, Math.round(params.shellThickness)));
  const allY = axisCoords(diameter);
  const half = params.half ?? 'top';
  const halfY = half === 'top' ? allY.filter((y) => cellCenter(y, diameter) >= 0) : allY.filter((y) => cellCenter(y, diameter) <= 0);
  const naturalHeight = halfY.length;
  const capHeight = Math.max(1, Math.min(naturalHeight, Math.round(params.capHeight || naturalHeight)));
  const selectedY = half === 'top' ? halfY.slice(0, capHeight) : halfY.slice(Math.max(0, halfY.length - capHeight));
  const xs = axisCoords(diameter);
  const zs = axisCoords(diameter);
  const layers: LayerBlueprint[] = [];
  let totalBlocks = 0;

  for (const y of selectedY) {
    const dy = cellCenter(y, diameter);
    const cells: GridCell[] = [];
    const localRadius = Math.sqrt(Math.max(0, radius * radius - dy * dy));
    for (const z of zs) {
      for (const x of xs) {
        const dx = cellCenter(x, diameter);
        const dz = cellCenter(z, diameter);
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const inside = distance <= radius;
        const hollowKeep = distance >= Math.max(0, radius - shellThickness) || Math.abs(dy) < 0.001;
        const filled = params.mode === 'solid' ? inside : inside && hollowKeep;
        if (filled) cells.push({ x, z, filled: true, role: hollowKeep ? 'outline' : 'fill' });
      }
    }
    totalBlocks += cells.length;
    layers.push(makeLayer(layers.length, y, diameter, cells, localRadius, selectedY.length));
  }

  const ordered = params.buildDirection === 'top-down' ? [...layers].reverse() : layers;
  const reindexed = ordered.map((layer, index) => ({ ...layer, index, label: `Layer ${index + 1} of ${ordered.length} · Y ${layer.y}${layer.isCenterLayer ? ' · base center' : ''}` }));
  const warnings = [centerWarning(diameter), ...sizeWarnings(diameter, diameter, capHeight)];
  if (capHeight !== Math.round(params.capHeight || capHeight)) warnings.push({ code: 'CUSTOM_HEIGHT_CLAMPED' as const, message: 'Dome cap height was clamped to the available hemisphere layers.', severity: 'info' as const });

  return {
    shape: 'dome' as const,
    title: `${diameter} Block ${params.mode === 'solid' ? 'Solid ' : 'Hollow '}Dome`,
    dimensions: { width: diameter, height: capHeight, depth: diameter },
    centerType: centerType(diameter),
    totalBlocks,
    stacks: countStacks(totalBlocks),
    warnings,
    generatedAt: new Date().toISOString(),
    layers: reindexed,
    layerCount: reindexed.length,
    mode: params.mode,
    shellThickness,
    buildDirection: params.buildDirection
  };
}
