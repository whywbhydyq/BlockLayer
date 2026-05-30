import type { BlueprintResult, LayerBlueprint, RowSegment, LayeredResult, TwoDimensionalResult } from '../geometry';

export type CsvExportMode = 'selected' | 'all' | 'range';
export type CsvLayerRange = { start: number; end: number };

function quote(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function segmentText(row: RowSegment) {
  return row.segments.map((segment) => `${segment.startX}..${segment.endX} (${segment.length})`).join('; ');
}

function isLayered(result: BlueprintResult): result is LayeredResult {
  return result.shape === 'sphere' || result.shape === 'dome';
}

function as2d(result: BlueprintResult): TwoDimensionalResult {
  return result as TwoDimensionalResult;
}

function layerLine(layer: LayerBlueprint) {
  return [layer.index + 1, layer.y, layer.blockCount, layer.localRadius.toFixed(2), layer.rows.map((row) => `Z ${row.z}: ${segmentText(row)}`).join(' | ')].map(quote).join(',');
}

export function exportBlueprintCsv(result: BlueprintResult, selectedLayerIndex = 0, mode: CsvExportMode = 'all', range?: CsvLayerRange) {
  if (isLayered(result)) {
    const header = ['layer', 'y', 'blocks', 'local_radius', 'row_segments'];
    const selected = result.layers[selectedLayerIndex] || result.layers[0];
    const start = Math.max(1, Math.min(Math.round(range?.start ?? selectedLayerIndex + 1), result.layerCount));
    const end = Math.max(start, Math.min(Math.round(range?.end ?? start), result.layerCount));
    const rows = mode === 'selected' ? [selected] : mode === 'range' ? result.layers.slice(start - 1, end) : result.layers;
    return [header.map(quote).join(','), ...rows.map(layerLine)].join('\n');
  }
  const flat = as2d(result);
  const header = ['shape', 'title', 'width', 'height', 'total_blocks', 'full_stacks', 'remainder', 'z', 'row_blocks', 'segments'];
  const rows = flat.rows.map((row) => [flat.shape, flat.title, flat.dimensions.width, flat.dimensions.height, flat.totalBlocks, flat.stacks.fullStacks, flat.stacks.remainder, row.z, row.blockCount, segmentText(row)].map(quote).join(','));
  return [header.map(quote).join(','), ...rows].join('\n');
}

export function rowListText(result: BlueprintResult, selectedLayerIndex = 0) {
  const rows = isLayered(result) ? (result.layers[selectedLayerIndex] || result.layers[0]).rows : as2d(result).rows;
  return rows.map((row) => `Z ${row.z}: ${segmentText(row)} (${row.blockCount} blocks)`).join('\n');
}

export function layerSummaryText(result: BlueprintResult) {
  if (!isLayered(result)) return rowListText(result);
  return result.layers.map((layer) => `Layer ${layer.index + 1}, Y ${layer.y}: ${layer.blockCount} blocks, local radius ${layer.localRadius.toFixed(2)}`).join('\n');
}

export function summaryText(result: BlueprintResult, selectedLayerIndex = 0) {
  const lines = [
    result.title,
    `Shape: ${result.shape}`,
    `Dimensions: ${result.dimensions.width} × ${result.dimensions.height}${result.dimensions.depth ? ` × ${result.dimensions.depth}` : ''}`,
    `Center: ${result.centerType}`,
    `Total blocks: ${result.totalBlocks}`,
    `64-stacks: ${result.stacks.fullStacks} stacks + ${result.stacks.remainder} blocks`,
    `Rounded stacks: ${result.stacks.totalStacksRoundedUp}`,
    `Shulker estimate: ${result.stacks.shulkerBoxes} boxes + ${result.stacks.shulkerRemainderStacks} stacks`
  ];
  if (isLayered(result)) {
    const layer = result.layers[selectedLayerIndex] || result.layers[0];
    lines.push(`Layers: ${result.layerCount}`);
    lines.push(`Current layer: ${layer.index + 1} / ${result.layerCount}`);
    lines.push(`Current layer blocks: ${layer.blockCount}`);
  }
  return lines.join('\n');
}

export function safeFilename(result: BlueprintResult, extension: 'png' | 'csv' | 'svg' | 'txt') {
  const dimensions = result.shape === 'ellipse' ? `${result.dimensions.width}x${result.dimensions.height}` : `${result.dimensions.width}`;
  const name = result.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `minecraft-${result.shape}-${dimensions}-${name}.${extension}`;
}
