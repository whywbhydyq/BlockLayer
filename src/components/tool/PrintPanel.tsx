'use client';
import type { LayeredResult } from '@/lib/geometry';
import { parseNumber } from './controlTypes';

export function PrintPanel({ layered, printStartLayer, printEndLayer, setPrintStartLayer, setPrintEndLayer }: { layered: LayeredResult | null; printStartLayer: number; printEndLayer: number; setPrintStartLayer: (value: number) => void; setPrintEndLayer: (value: number) => void }) {
  if (!layered) return null;
  return (
    <div className="print-range">
      <label>Print start layer<input type="number" min={1} max={layered.layerCount} value={printStartLayer} onChange={(event) => setPrintStartLayer(parseNumber(event.target.value, 1))} /></label>
      <label>Print end layer<input type="number" min={1} max={layered.layerCount} value={printEndLayer} onChange={(event) => setPrintEndLayer(parseNumber(event.target.value, layered.layerCount))} /></label>
    </div>
  );
}
