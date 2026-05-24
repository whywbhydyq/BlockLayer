import type { LayerBlueprint } from '@/lib/geometry';

export function LayerSummaryTable({ layers }: { layers: LayerBlueprint[] }) {
  return (
    <div className="table-wrap layer-summary-table">
      <table>
        <thead><tr><th>Layer</th><th>Y</th><th>Blocks</th><th>Local radius</th><th>Rows</th></tr></thead>
        <tbody>{layers.map((layer) => <tr key={layer.index}><td>{layer.index + 1}</td><td>{layer.y}</td><td>{layer.blockCount}</td><td>{layer.localRadius.toFixed(2)}</td><td>{layer.rows.length}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
