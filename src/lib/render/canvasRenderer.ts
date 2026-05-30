import type { GridBounds, GridCell, RowSegment } from '@/lib/geometry';
import { blueprintPalette } from './colors';

export type DrawBlueprintOptions = {
  bounds: GridBounds;
  cells: GridCell[];
  previousCells: GridCell[];
  rows: RowSegment[];
  width: number;
  height: number;
  cellSize: number;
  offset: { x: number; y: number };
  showCoordinates: boolean;
  showSegments: boolean;
  showGhost: boolean;
  showCenter: boolean;
  showAxis: boolean;
  highContrast: boolean;
  highlightedRowZ?: number | null;
};

function cellPosition(options: DrawBlueprintOptions, x: number, z: number) {
  return {
    px: options.offset.x + (x - options.bounds.minX) * options.cellSize,
    py: options.offset.y + (z - options.bounds.minZ) * options.cellSize
  };
}

function axisPixel(start: number, size: number, minCoord: number, cellSize: number) {
  const originAtCellStart = start + (0 - minCoord) * cellSize;
  return size % 2 === 0 ? originAtCellStart : originAtCellStart + cellSize / 2;
}

function isCentralColumn(x: number, width: number) {
  return width % 2 === 1 ? x === 0 : x === -1 || x === 0;
}

function isCentralRow(z: number, height: number) {
  return height % 2 === 1 ? z === 0 : z === -1 || z === 0;
}

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
      const { px, py } = cellPosition(options, x, z);
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
      const centralAxisCell = options.showAxis && (isCentralColumn(x, options.bounds.width) || isCentralRow(z, options.bounds.height));
      ctx.strokeStyle = centralAxisCell ? palette.axis : palette.grid;
      ctx.lineWidth = centralAxisCell ? 1.6 : 1;
      ctx.strokeRect(px, py, options.cellSize, options.cellSize);
    }
  }

  const centerX = axisPixel(originX, options.bounds.width, options.bounds.minX, options.cellSize);
  const centerY = axisPixel(originY, options.bounds.height, options.bounds.minZ, options.cellSize);

  if (options.showAxis) {
    ctx.strokeStyle = palette.axisStrong;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(centerX, originY);
    ctx.lineTo(centerX, originY + options.bounds.height * options.cellSize);
    ctx.moveTo(originX, centerY);
    ctx.lineTo(originX + options.bounds.width * options.cellSize, centerY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  if (options.showCenter) {
    const oddX = options.bounds.width % 2 === 1;
    const oddZ = options.bounds.height % 2 === 1;
    ctx.save();
    ctx.fillStyle = palette.center;
    ctx.strokeStyle = palette.center;
    ctx.lineWidth = Math.max(2, Math.min(4, options.cellSize * 0.12));
    if (oddX && oddZ) {
      const size = Math.max(6, options.cellSize * 0.6);
      ctx.fillRect(centerX - size / 2, centerY - size / 2, size, size);
    } else {
      ctx.globalAlpha = 0.28;
      const markerWidth = oddX ? Math.max(6, options.cellSize * 0.5) : options.cellSize * 2;
      const markerHeight = oddZ ? Math.max(6, options.cellSize * 0.5) : options.cellSize * 2;
      ctx.fillRect(centerX - markerWidth / 2, centerY - markerHeight / 2, markerWidth, markerHeight);
      ctx.globalAlpha = 1;
      ctx.strokeRect(centerX - markerWidth / 2, centerY - markerHeight / 2, markerWidth, markerHeight);
    }
    ctx.restore();
  }

  if (options.showCoordinates && options.cellSize >= 10) {
    ctx.fillStyle = palette.text;
    ctx.font = `${Math.max(10, Math.min(13, options.cellSize * 0.35))}px ui-monospace, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const stepX = Math.max(1, Math.ceil(64 / options.cellSize));
    for (let x = options.bounds.minX; x <= options.bounds.maxX; x += stepX) {
      const { px } = cellPosition(options, x, options.bounds.minZ);
      ctx.fillText(String(x), px + options.cellSize / 2, Math.max(16, originY - 16));
    }
    const stepZ = Math.max(1, Math.ceil(64 / options.cellSize));
    for (let z = options.bounds.minZ; z <= options.bounds.maxZ; z += stepZ) {
      const { py } = cellPosition(options, options.bounds.minX, z);
      ctx.fillText(String(z), Math.max(18, originX - 24), py + options.cellSize / 2);
      ctx.fillText(String(z), Math.min(options.width - 18, originX + options.bounds.width * options.cellSize + 24), py + options.cellSize / 2);
    }
  }

  if (options.showSegments && options.cellSize >= 10) {
    const labelX = axisPixel(originX, options.bounds.width, options.bounds.minX, options.cellSize);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${Math.max(11, Math.min(14, options.cellSize * 0.38))}px ui-monospace, monospace`;
    for (const row of options.rows) {
      if (row.blockCount <= 0) continue;
      const { py } = cellPosition(options, 0, row.z);
      const label = String(row.blockCount);
      const w = Math.max(28, label.length * 8 + 12);
      const h = Math.max(18, options.cellSize * 0.8);
      const x = labelX - w / 2;
      const y = py + options.cellSize / 2 - h / 2;
      ctx.fillStyle = palette.labelBackground;
      ctx.strokeStyle = palette.labelBorder;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = palette.labelText;
      ctx.fillText(label, labelX, py + options.cellSize / 2);
    }
  }
}
