// Legacy modular component retained for migration/reference.
// ToolShell.tsx is the current primary homepage/tool-page workspace; see LEGACY_COMPONENTS.md before reintroducing this component.
import type { BlueprintResult } from '@/lib/geometry';

function asLayered(result: BlueprintResult) {
  return result.shape === 'sphere' || result.shape === 'dome' ? result : null;
}

export function ResultsSummary({ result, layerIndex }: { result: BlueprintResult; layerIndex: number }) {
  const layered = asLayered(result);
  const current = layered ? layered.layers[layerIndex] || layered.layers[0] : null;
  return (
    <div className="summary" aria-live="polite">
      <h3>Results</h3>
      <div className="summary-grid">
        <div className="stat"><span>Total blocks</span><strong>{result.totalBlocks.toLocaleString()}</strong></div>
        <div className="stat"><span>64-stacks</span><strong>{result.stacks.fullStacks} + {result.stacks.remainder}</strong></div>
        <div className="stat"><span>Rounded stacks</span><strong>{result.stacks.totalStacksRoundedUp}</strong></div>
        <div className="stat"><span>Shulker estimate</span><strong>{result.stacks.shulkerBoxes} + {result.stacks.shulkerRemainderStacks} stacks</strong></div>
        <div className="stat"><span>Center</span><strong>{result.centerType}</strong></div>
        {(result.shape === 'circle' || result.shape === 'ellipse') && <><div className="stat"><span>Outline blocks</span><strong>{result.outlineBlocks.toLocaleString()}</strong></div><div className="stat"><span>Filled blocks</span><strong>{result.filledBlocks.toLocaleString()}</strong></div></>}
        {current && <><div className="stat"><span>Current layer</span><strong>{current.index + 1} / {layered?.layerCount}</strong></div><div className="stat"><span>Layer blocks</span><strong>{current.blockCount.toLocaleString()}</strong></div></>}
      </div>
    </div>
  );
}
