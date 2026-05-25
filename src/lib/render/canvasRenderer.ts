import type { GridBounds, GridCell } from '@/lib/geometry';
import { blueprintPalette } from './colors';

export type DrawBlueprintOptions = {
  bounds: GridBounds;
  cells: GridCell[];
  previousCells: GridCell[];
  width: number;
  height: number;
  cellSize: number;
  offset: { x: number; y: number };
  showCoordinates: boolean;
  showSegments: boolean;
  showGhost: boolean;
  highContrast: boolean;
  highlightedRowZ?: number | null;
};

export function drawBlueprintGrid(ctx: CanvasRenderingContext2D, options: DrawBlueprintOptions) {
  const palette = blueprintPalette(options.highContrast);
  const cellSet = new Map(options.cells.map((cell) => [`${cell.x}:${cell.z}`, cell]));
  const ghostSet = new Set(options.previousCells.map((cell) => `${cell.x}:${cell.z}`));
  const originX = options.offset.x;
  const originY = options.offset.y;

  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, options.width, options.height);

  for (let z = options.bounds.minZ; z <= options.bounds.maxZ; z += 1) {
    for (let x = options.bounds.minX; x <= options.bounds.maxX; x += 1) {
      const px = originX + (x - options.bounds.minX) * options.cellSize;
      const py = originY + (z - options.bounds.minZ) * options.cellSize;
      if (px + options.cellSize < -50 || py + options.cellSize < -50 || px > options.width + 50 || py > options.height + 50) continue;
      const key = `${x}:${z}`;
      const cell = cellSet.get(key);
      const ghost = options.showGhost && ghostSet.has(key) && !cell;
      ctx.fillStyle = cell ? (cell.role === 'fill' ? palette.fill : palette.outline) : ghost ? palette.ghost : palette.empty;
      ctx.fillRect(px, py, options.cellSize, options.cellSize);
      if (options.highlightedRowZ === z) {
        ctx.fillStyle = palette.highlight;
        ctx.fillRect(px, py, options.cellSize, options.cellSize);
      }
      ctx.strokeStyle = x === 0 || z === 0 ? palette.axis : palette.grid;
      ctx.lineWidth = x === 0 || z === 0 ? 1.5 : 1;
      ctx.strokeRect(px, py, options.cellSize, options.cellSize);
    }
  }

  if (options.showCoordinates && options.cellSize >= 12) {
    ctx.fillStyle = palette.text;
    ctx.font = `${Math.max(9, Math.min(12, options.cellSize * 0.35))}px ui-monospace, monospace`;
    for (let x = options.bounds.minX; x <= options.bounds.maxX; x += Math.max(1, Math.ceil(24 / options.cellSize))) {
      ctx.fillText(String(x), originX + (x - options.bounds.minX) * options.cellSize + 2, Math.max(12, originY - 4));
    }
    for (let z = options.bounds.minZ; z <= options.bounds.maxZ; z += Math.max(1, Math.ceil(24 / options.cellSize))) {
      ctx.fillText(String(z), Math.max(2, originX - 28), originY + (z - options.bounds.minZ) * options.cellSize + options.cellSize - 2);
    }
  }

  if (options.showSegments && options.cellSize >= 14) {
    ctx.fillStyle = palette.text;
    ctx.font = `${Math.max(8, Math.min(11, options.cellSize * 0.32))}px ui-monospace, monospace`;
    for (const cell of options.cells) {
      const px = originX + (cell.x - options.bounds.minX) * options.cellSize;
      const py = originY + (cell.z - options.bounds.minZ) * options.cellSize;
      if ((cell.x === 0 || cell.z === 0) && options.cellSize >= 18) ctx.fillText(`${cell.x},${cell.z}`, px + 2, py + options.cellSize * 0.66);
    }
  }
}
