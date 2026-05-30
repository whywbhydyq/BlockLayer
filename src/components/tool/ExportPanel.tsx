'use client';
// Legacy modular component retained for migration/reference.
// ToolShell.tsx is the current primary homepage/tool-page workspace; see LEGACY_COMPONENTS.md before reintroducing this component.
import type { LayeredResult } from '@/lib/geometry';
import { PrintPanel } from './PrintPanel';

export function ExportPanel({ layered, copied, printStartLayer, printEndLayer, setPrintStartLayer, setPrintEndLayer, exportPng, exportSvg, exportCsv, printBlueprint, copyRowList, copyLayerSummary, copyShareLink, copySummary, copyCurrentRow, previousRow, nextRow }: { layered: LayeredResult | null; copied: string; printStartLayer: number; printEndLayer: number; setPrintStartLayer: (value: number) => void; setPrintEndLayer: (value: number) => void; exportPng: () => void; exportSvg: () => void; exportCsv: (mode: 'selected' | 'all') => void; printBlueprint: (mode: 'current' | 'all' | 'selected') => void; copyRowList: () => void; copyLayerSummary: () => void; copyShareLink: () => void; copySummary: () => void; copyCurrentRow: () => void; previousRow: () => void; nextRow: () => void }) {
  return (
    <div className="export-panel">
      <h3>Export, print, and copy</h3>
      <p>These controls are intentionally kept separate from ad placements.</p>
      <PrintPanel layered={layered} printStartLayer={printStartLayer} printEndLayer={printEndLayer} setPrintStartLayer={setPrintStartLayer} setPrintEndLayer={setPrintEndLayer} />
      <div className="export-actions">
        <button type="button" onClick={exportPng}>Download PNG</button>
        <button type="button" onClick={exportSvg}>Download SVG</button>
        <button type="button" onClick={() => exportCsv('all')}>Download CSV</button>
        {layered && <button type="button" onClick={() => exportCsv('selected')}>CSV current layer</button>}
        <button type="button" onClick={() => printBlueprint('current')}>Print current blueprint</button>
        {layered && <button type="button" onClick={() => printBlueprint('all')}>Print all layers</button>}
        {layered && <button type="button" onClick={() => printBlueprint('selected')}>Print selected range</button>}
        <button type="button" onClick={copyRowList}>Copy row list</button>
        <button type="button" onClick={copyCurrentRow}>Copy current row</button>
        <button type="button" onClick={previousRow}>Previous row</button>
        <button type="button" onClick={nextRow}>Next row</button>
        {layered && <button type="button" onClick={copyLayerSummary}>Copy layer summary</button>}
        <button type="button" onClick={copyShareLink}>Copy share link</button>
        <button type="button" onClick={copySummary}>Copy summary</button>
      </div>
      {copied && <p aria-live="polite"><strong>{copied}</strong></p>}
    </div>
  );
}
