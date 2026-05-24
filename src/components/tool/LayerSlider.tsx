'use client';
import { trackToolEvent } from '@/lib/analytics/events';
import type { LayeredResult } from '@/lib/geometry';

export function LayerSlider({ result, layerIndex, setLayerIndex }: { result: LayeredResult | null; layerIndex: number; setLayerIndex: (next: number) => void }) {
  if (!result) return null;
  const currentLayer = result.layers[layerIndex] || result.layers[0];
  const setTracked = (next: number) => {
    const clamped = Math.max(0, Math.min(result.layerCount - 1, next));
    setLayerIndex(clamped);
    trackToolEvent('layer_changed', { shape: result.shape, layer: clamped + 1 });
  };
  return (
    <div className="layer-panel">
      <strong>{currentLayer.label}</strong>
      <p>Current layer blocks: {currentLayer.blockCount.toLocaleString()} · Local radius: {currentLayer.localRadius.toFixed(2)}</p>
      <input aria-label="Layer slider" type="range" min={0} max={Math.max(0, result.layerCount - 1)} value={layerIndex} onChange={(event) => setTracked(Number(event.target.value))} />
      <div className="layer-actions">
        <button type="button" onClick={() => setTracked(0)}>First</button>
        <button type="button" onClick={() => setTracked(layerIndex - 1)}>Previous</button>
        <button type="button" onClick={() => setTracked(layerIndex + 1)}>Next</button>
        <button type="button" onClick={() => setTracked(result.layerCount - 1)}>Last</button>
      </div>
    </div>
  );
}
