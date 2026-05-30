'use client';
// Legacy modular component retained for migration/reference.
// ToolShell.tsx is the current primary homepage/tool-page workspace; see LEGACY_COMPONENTS.md before reintroducing this component.
import type { RowSegment } from '@/lib/geometry';

export function segmentLabel(row: RowSegment) {
  return row.segments.map((segment) => `${segment.startX}..${segment.endX} (${segment.length})`).join('; ');
}

export function RowSegmentTable({ rows, selectedRowIndex, setSelectedRowIndex, maxRows = 160 }: { rows: RowSegment[]; selectedRowIndex: number; setSelectedRowIndex: (index: number) => void; maxRows?: number }) {
  const visibleRows = rows.slice(0, maxRows);
  return (
    <div className="table-wrap row-segment-table">
      <table>
        <thead><tr><th>Z row</th><th>Blocks</th><th>Segments</th><th>Builder mode</th></tr></thead>
        <tbody>{visibleRows.map((row, index) => (
          <tr key={row.z} className={index === selectedRowIndex ? 'active-row' : ''}>
            <td>{row.z}</td><td>{row.blockCount}</td><td>{segmentLabel(row)}</td><td><button type="button" onClick={() => setSelectedRowIndex(index)}>Highlight row</button></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
