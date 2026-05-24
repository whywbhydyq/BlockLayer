'use client';
import { siteUrl } from '@/lib/seo/pages';
import type { BlueprintResult } from '@/lib/geometry';
import { LayerSummaryTable } from './LayerSummaryTable';
import { RowSegmentTable } from './RowSegmentTable';

export function rowsForResult(result: BlueprintResult, layerIndex: number) {
  if (result.shape === 'circle' || result.shape === 'ellipse') return result.rows;
  return (result.layers[layerIndex] || result.layers[0]).rows;
}

export function BlueprintTables({ result, layerIndex, printMode, printStartLayer, printEndLayer, selectedRowIndex, setSelectedRowIndex }: { result: BlueprintResult; layerIndex: number; printMode: 'current' | 'all' | 'selected'; printStartLayer: number; printEndLayer: number; selectedRowIndex: number; setSelectedRowIndex: (index: number) => void }) {
  if (result.shape === 'circle' || result.shape === 'ellipse') {
    const rows = result.rows;
    return (
      <section className="data-panel printable-data">
        <h3>Row-by-row table</h3>
        <p>Continuous row segments are listed as start..end ranges so builders do not need to count every block by eye. Use Builder mode to highlight a row and copy only that row.</p>
        <p className="print-url">Page URL: {siteUrl()}</p>
        <RowSegmentTable rows={rows} selectedRowIndex={selectedRowIndex} setSelectedRowIndex={setSelectedRowIndex} />
        {result.rows.length > 160 && <p className="small-note">Table preview is limited for screen readability. Use CSV export for the complete row list.</p>}
      </section>
    );
  }
  const selected = result.layers[layerIndex] || result.layers[0];
  const start = Math.max(1, Math.min(printStartLayer, result.layerCount));
  const end = Math.max(start, Math.min(printEndLayer, result.layerCount));
  const printLayers = printMode === 'all' ? result.layers : printMode === 'selected' ? result.layers.slice(start - 1, end) : [selected];
  return (
    <section className="data-panel printable-data">
      <h3>Layer table</h3>
      <p>Print mode: {printMode === 'all' ? 'all layers' : printMode === 'selected' ? `layers ${start}–${end}` : 'current layer'}.</p>
      <p className="print-url">Page URL: {siteUrl()}</p>
      <LayerSummaryTable layers={printLayers} />
      <h4>Current layer row segments</h4>
      <RowSegmentTable rows={selected.rows} selectedRowIndex={selectedRowIndex} setSelectedRowIndex={setSelectedRowIndex} maxRows={120} />
    </section>
  );
}
