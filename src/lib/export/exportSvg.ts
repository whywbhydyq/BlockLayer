import type { BlueprintResult, GridBounds, GridCell, LayeredResult, TwoDimensionalResult } from '../geometry';
import { summaryText } from './exportCsv';

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function isLayered(result: BlueprintResult): result is LayeredResult {
  return result.shape === 'sphere' || result.shape === 'dome';
}

function currentCells(result: BlueprintResult, layerIndex: number): { cells: GridCell[]; bounds: GridBounds } {
  if (isLayered(result)) {
    const layer = result.layers[layerIndex] || result.layers[0];
    return { cells: layer.cells, bounds: layer.bounds };
  }
  const flat = result as TwoDimensionalResult;
  return { cells: flat.cells, bounds: flat.bounds };
}

export function exportBlueprintSvg(result: BlueprintResult, selectedLayerIndex = 0) {
  const { cells, bounds } = currentCells(result, selectedLayerIndex);
  const cellSize = cells.length > 12000 ? 6 : cells.length > 4000 ? 10 : 16;
  const padding = 32;
  const width = bounds.width * cellSize + padding * 2;
  const height = bounds.height * cellSize + padding * 2 + 44;
  const cellSet = new Set(cells.map((cell) => `${cell.x}:${cell.z}`));
  const rects: string[] = [];

  for (let z = bounds.minZ; z <= bounds.maxZ; z += 1) {
    for (let x = bounds.minX; x <= bounds.maxX; x += 1) {
      const px = padding + (x - bounds.minX) * cellSize;
      const py = padding + (z - bounds.minZ) * cellSize + 44;
      const filled = cellSet.has(`${x}:${z}`);
      rects.push(`<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="${filled ? '#2f7d4c' : '#ffffff'}" stroke="${x === 0 || z === 0 ? '#c06a25' : '#d5ddd5'}" stroke-width="1" />`);
    }
  }

  const label = escapeXml(summaryText(result, selectedLayerIndex).split('\n')[0]);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}"><rect width="100%" height="100%" fill="#f8fbf7"/><text x="${padding}" y="26" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#17201b">${label}</text>${rects.join('')}</svg>`;
}
