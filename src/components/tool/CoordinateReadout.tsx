import type { BlueprintResult } from '@/lib/geometry';

export function CoordinateReadout({ result, layerIndex }: { result: BlueprintResult; layerIndex: number }) {
  const bounds = result.shape === 'sphere' || result.shape === 'dome' ? (result.layers[layerIndex] || result.layers[0]).bounds : result.bounds;
  const layer = result.shape === 'sphere' || result.shape === 'dome' ? result.layers[layerIndex] || result.layers[0] : null;
  return (
    <section className="coordinate-readout" aria-label="Coordinate bounds">
      <strong>Coordinate readout</strong>
      <p>X {bounds.minX}..{bounds.maxX} · Z {bounds.minZ}..{bounds.maxZ}{layer ? ` · Layer ${layer.index + 1} at Y ${layer.y}` : ''}</p>
    </section>
  );
}
