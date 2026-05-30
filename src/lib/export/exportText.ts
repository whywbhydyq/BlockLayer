import type { BlueprintResult, LayeredResult, RowSegment, TwoDimensionalResult } from '@/lib/geometry/types';

function segmentText(row: RowSegment) {
  return row.segments.map((segment) => `${segment.startX}..${segment.endX} (${segment.length})`).join('; ');
}

function isLayered(result: BlueprintResult): result is LayeredResult {
  return result.shape === 'sphere' || result.shape === 'dome';
}

function as2d(result: BlueprintResult): TwoDimensionalResult {
  return result as TwoDimensionalResult;
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
