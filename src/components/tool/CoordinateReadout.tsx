// Legacy modular component retained for migration/reference.
// ToolShell.tsx is the current primary homepage/tool-page workspace; see LEGACY_COMPONENTS.md before reintroducing this component.
import type { BlueprintResult, LayeredResult } from '@/lib/geometry';

function isLayeredResult(result: BlueprintResult): result is LayeredResult {
  return result.shape === 'sphere' || result.shape === 'dome';
}

export function CoordinateReadout({ result, layerIndex }: { result: BlueprintResult; layerIndex: number }) {
  if (isLayeredResult(result)) {
    const layer = result.layers[layerIndex] || result.layers[0];
    const bounds = layer.bounds;
    return (
      <section className="coordinate-readout" aria-label="Coordinate bounds">
        <strong>Coordinate readout</strong>
        <p>X {bounds.minX}..{bounds.maxX} · Z {bounds.minZ}..{bounds.maxZ} · Layer {layer.index + 1} at Y {layer.y}</p>
      </section>
    );
  }

  const bounds = result.bounds;
  return (
    <section className="coordinate-readout" aria-label="Coordinate bounds">
      <strong>Coordinate readout</strong>
      <p>X {bounds.minX}..{bounds.maxX} · Z {bounds.minZ}..{bounds.maxZ}</p>
    </section>
  );
}
